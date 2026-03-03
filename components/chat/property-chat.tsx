"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircleIcon,
  XIcon,
  SendIcon,
  Loader2Icon,
  HomeIcon,
  BedDoubleIcon,
  SquareIcon,
  ArrowRightIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TokkoProperty } from "@/types/property";
import type { ChatResponseBody } from "@/app/api/chat/route";

const CHAT_STORAGE_KEY = "cabral-property-chat-v1";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  properties?: TokkoProperty[];
  total?: number;
  searchParams?: ChatResponseBody["searchParams"];
}

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "¡Hola! Soy el asistente de Cabral Inmobiliaria 👋\n\nPodés decirme qué propiedad estás buscando en español. Por ejemplo:\n\n• \"Busco un departamento en venta en Palermo\"\n• \"Necesito una casa para alquilar en Belgrano hasta 800 USD\"\n• \"Quiero comprar un local en Villa Urquiza\"",
};

function formatMessageToHtml(content: string): string {
  let html = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  html = html.replace(/\n/g, "<br />");

  return html;
}

function buildPropertiesUrl(
  searchParams?: ChatResponseBody["searchParams"]
): string {
  if (!searchParams) return "/propiedades";
  const params = new URLSearchParams();
  if (searchParams.operation) params.set("operation", searchParams.operation);
  if (searchParams.type) params.set("type", searchParams.type);
  if (searchParams.location) params.set("location", searchParams.location);
  if (searchParams.min_price != null)
    params.set("min_price", String(searchParams.min_price));
  if (searchParams.max_price != null)
    params.set("max_price", String(searchParams.max_price));
  const qs = params.toString();
  return qs ? `/propiedades?${qs}` : "/propiedades";
}

function PropertyMiniCard({ property }: { property: TokkoProperty }) {
  const imageUrl =
    property.cover_picture?.url ??
    property.cover_picture?.thumb ??
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=60";

  const isRent = property.available_operations?.[0]
    ?.toLowerCase()
    .includes("rent");

  return (
    <Card className="overflow-hidden gap-0 py-0 shadow-none hover:bg-muted/40 transition-colors">
      <Link href={`/propiedades/${property.id}`} className="flex">
        <div className="relative h-20 w-24 shrink-0 overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={property.type?.name ?? "Propiedad"}
            fill
            className="object-cover"
            sizes="96px"
          />
          <div className="absolute top-1.5 left-1.5">
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 bg-background/90 backdrop-blur-sm"
            >
              {isRent ? "Alquiler" : "Venta"}
            </Badge>
          </div>
        </div>
        <CardContent className="flex flex-1 flex-col justify-center gap-0.5 min-w-0 px-3 py-2">
          <p className="text-xs font-semibold line-clamp-2 leading-tight">
            {property.publication_title ??
              `${property.type?.name ?? "Propiedad"} en ${property.location?.short_location ?? "—"}`}
          </p>
          <p className="text-[11px] text-muted-foreground line-clamp-1">
            {property.location?.short_location ?? "Sin ubicación"}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
            {property.room_amount != null && property.room_amount > 0 && (
              <span className="flex items-center gap-0.5">
                <BedDoubleIcon className="size-3" />
                {property.room_amount} amb.
              </span>
            )}
            {(property.surface ?? property.roofed_surface) != null &&
              (property.surface ?? property.roofed_surface)! > 0 && (
                <span className="flex items-center gap-0.5">
                  <SquareIcon className="size-3" />
                  {property.surface ?? property.roofed_surface} m²
                </span>
              )}
          </div>
          <p className="text-xs font-bold text-primary mt-0.5">
            {property.web_price ?? "Consultar precio"}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}

export function PropertyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(CHAT_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as ChatMessage[] | unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed as ChatMessage[]);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: ChatResponseBody = await res.json();

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.message,
          properties: data.properties,
          total: data.total,
          searchParams: data.searchParams,
        },
      ]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Lo sentimos, hubo un error al procesar tu consulta. Por favor intentá de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen((v) => !v)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label={isOpen ? "Cerrar chat" : "Abrir asistente inmobiliario"}
      >
        {isOpen ? (
          <XIcon className="size-6" />
        ) : (
          <MessageCircleIcon className="size-6" />
        )}
      </Button>
      <Card
        className={cn(
          "fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right gap-0 py-0",
          "w-[360px] sm:w-[400px]",
          isOpen
            ? "opacity-100 scale-100 h-[580px] pointer-events-auto"
            : "opacity-0 scale-95 h-0 pointer-events-none"
        )}
      >
        <div className="flex shrink-0 items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20">
            <HomeIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm leading-tight">
              Asistente Inmobiliario
            </p>
            <p className="text-xs opacity-75">Cabral Inmobiliaria</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsOpen(false)}
            className="ml-auto shrink-0 rounded-full text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
            aria-label="Cerrar chat"
          >
            <XIcon className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                  <HomeIcon className="size-3.5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                )}
              >
                <p
                  className="whitespace-pre-wrap wrap-break-word"
                  dangerouslySetInnerHTML={{ __html: formatMessageToHtml(msg.content) }}
                />

                {msg.properties && msg.properties.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.properties.slice(0, 10).map((property) => (
                      <PropertyMiniCard key={property.id} property={property} />
                    ))}
                    {msg.total != null && msg.total > 10 && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        <Link href={buildPropertiesUrl(msg.searchParams)}>
                          Ver las {msg.total} propiedades encontradas
                          <ArrowRightIcon className="size-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                <HomeIcon className="size-3.5 text-primary" />
              </div>
              <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 border-t bg-background p-3">
          <div className="flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: Busco depto en venta en Palermo..."
              className="min-h-[42px] max-h-[120px] resize-none text-sm rounded-xl border-muted-foreground/20 focus-visible:ring-primary/30"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="shrink-0 h-[42px] w-[42px] rounded-xl"
              aria-label="Enviar mensaje"
            >
              <SendIcon className="size-4" />
            </Button>
          </div>
          {/* <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Escribí tu consulta en español
          </p> */}
        </div>
      </Card>
    </>
  );
}
