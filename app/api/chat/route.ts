import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getStateDivisions } from "@/lib/actions/locations";
import { getPropertyTypes } from "@/lib/actions/property-types";
import { searchProperties } from "@/lib/actions/properties";
import type { PropertyOperation } from "@/types/property";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ChatRequestBody {
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface ChatResponseBody {
  message: string;
  properties?: import("@/types/property").TokkoProperty[];
  total?: number;
  searchParams?: {
    operation?: string;
    type?: string;
    location?: string;
    min_price?: number;
    max_price?: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { message, history = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { message: "El mensaje no puede estar vacío." },
        { status: 400 }
      );
    }

    const [barrios, propertyTypes] = await Promise.all([
      getStateDivisions(146),
      getPropertyTypes(),
    ]);

    const barrioOptions = barrios
      .map((b) => `"${b.name}" → id ${b.id}`)
      .join(", ");
    const typeOptions = propertyTypes
      .map((t) => `"${t.name}" → id ${t.id}`)
      .join(", ");

    const systemPrompt = `Eres un asistente inmobiliario de Cabral Inmobiliaria, una empresa de bienes raíces argentina especializada en propiedades de Capital Federal / Buenos Aires.

Tu rol es ayudar a los usuarios a encontrar propiedades usando lenguaje natural en español de Argentina.

Barrios disponibles (Capital Federal): ${barrioOptions}
Tipos de propiedad disponibles: ${typeOptions}

Cuando el usuario solicite propiedades, usá la herramienta buscar_propiedades extrayendo los parámetros de su consulta:
- Si menciona "venta", "comprar", "en venta" → operation: "sell"
- Si menciona "alquiler", "alquilar", "en alquiler" → operation: "rent"
- Si menciona un barrio, buscá el ID más cercano en la lista de barrios
- Si menciona un tipo de propiedad (departamento, casa, etc.), buscá el ID correspondiente
- Si menciona un precio mínimo, completá min_price
- Si menciona un precio máximo, completá max_price
- Usá solo los IDs de la lista, no inventes IDs

Respondé siempre en español de Argentina. Sé amigable y conciso.

Nunca hables en primera persona del singular. No uses frases como "no tengo", "puedo ayudarte", "estoy aquí para ayudarte".
Hablá SIEMPRE en nombre de la inmobiliaria, en primera persona del plural. Usá expresiones como "no tenemos", "podemos ayudarte", "estamos para ayudarte".

Muy importante sobre cómo responder:
- No enumeres cada propiedad ni listes precios uno por uno.
- Solo indicá el total aproximado de resultados y hacé una descripción general (por ejemplo rango de precios o cantidad de ambientes típica).
- Los detalles concretos de cada propiedad se muestran en las tarjetas que ve el usuario en la interfaz, NO los repitas en la respuesta.
- Podés usar Markdown para resaltar partes importantes con **negrita**, por ejemplo: **21 departamentos en venta**.

Si no encontrás propiedades, sugerí ampliar los criterios (por ejemplo quitar filtro de precio o de barrio) usando siempre primera persona del plural.`;

    const historySlice = history.slice(-10);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...historySlice.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const tools: OpenAI.Chat.ChatCompletionTool[] = [
      {
        type: "function",
        function: {
          name: "buscar_propiedades",
          description:
            "Busca propiedades en la base de datos según los criterios del usuario.",
          parameters: {
            type: "object",
            properties: {
              operation: {
                type: "string",
                enum: ["sell", "rent"],
                description:
                  "'sell' para venta, 'rent' para alquiler. Omitir si no se especifica.",
              },
              type_id: {
                type: "number",
                description: `ID numérico del tipo de propiedad. Opciones: ${typeOptions}`,
              },
              location_id: {
                type: "number",
                description: `ID numérico del barrio. Opciones: ${barrioOptions}`,
              },
              min_price: {
                type: "number",
                description: "Precio mínimo en USD (número entero, sin símbolos).",
              },
              max_price: {
                type: "number",
                description: "Precio máximo en USD (número entero, sin símbolos).",
              },
            },
            required: [],
          },
        },
      },
    ];

    const firstResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      tools,
      tool_choice: "auto",
    });

    const firstChoice = firstResponse.choices[0].message;

    const functionToolCall = firstChoice.tool_calls?.find(
      (tc): tc is OpenAI.Chat.ChatCompletionMessageFunctionToolCall =>
        tc.type === "function"
    );

    if (functionToolCall) {
      const toolCall = functionToolCall;
      let args: {
        operation?: PropertyOperation;
        type_id?: number;
        location_id?: number;
        min_price?: number;
        max_price?: number;
      } = {};

      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch {
        args = {};
      }

      const searchResult = await searchProperties({
        operation: args.operation,
        type: args.type_id != null ? String(args.type_id) : undefined,
        location: args.location_id != null ? String(args.location_id) : undefined,
        min_price: args.min_price,
        max_price: args.max_price,
        limit: 10,
        page: 1,
      });

      const toolResultMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        ...messages,
        firstChoice,
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify({
            total_encontradas: searchResult.total ?? 0,
            propiedades: (searchResult.properties ?? []).slice(0, 10).map((p) => ({
              id: p.id,
              titulo: p.publication_title,
              tipo: p.type?.name,
              ubicacion: p.location?.short_location,
              precio: p.web_price,
              ambientes: p.room_amount,
              banos: p.bathroom_amount,
              superficie: p.surface,
            })),
          }),
        },
      ];

      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: toolResultMessages,
      });

      const responseMessage =
        secondResponse.choices[0].message.content ??
        "No pude generar una respuesta.";

      const responseBody: ChatResponseBody = {
        message: responseMessage,
        properties: (searchResult.properties ?? []).slice(0, 10),
        total: searchResult.total ?? 0,
        searchParams: {
          operation: args.operation,
          type: args.type_id != null ? String(args.type_id) : undefined,
          location: args.location_id != null ? String(args.location_id) : undefined,
          min_price: args.min_price,
          max_price: args.max_price,
        },
      };

      return NextResponse.json(responseBody);
    }

    return NextResponse.json({
      message:
        firstChoice.content ??
        "Podés decirme qué tipo de propiedad buscás y te ayudo a encontrarla.",
      properties: [],
      total: 0,
    } satisfies ChatResponseBody);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message:
          "Hubo un error al procesar tu consulta. Por favor intentá de nuevo.",
        properties: [],
        total: 0,
      } satisfies ChatResponseBody,
      { status: 500 }
    );
  }
}
