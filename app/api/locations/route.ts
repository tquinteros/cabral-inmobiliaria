import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  // Barrios de CABA y ciudades principales de Argentina
  const locations = [
    "Palermo",
    "Recoleta",
    "Belgrano",
    "Caballito",
    "Villa Crespo",
    "San Telmo",
    "Puerto Madero",
    "Microcentro",
    "Almagro",
    "Colegiales",
    "Núñez",
    "Villa Urquiza",
    "Flores",
    "Boedo",
    "La Boca",
    "Monserrat",
    "Retiro",
    "Barracas",
    "Parque Chacabuco",
    "Villa del Parque",
    "Chacarita",
    "Saavedra",
    "Coghlan",
    "Villa Ortúzar",
    "Agronomía",
    "Parque Patricios",
    "Constitución",
    "San Nicolás",
    "Montserrat",
    "Buenos Aires",
    "Córdoba",
    "Rosario",
    "Mendoza",
    "La Plata",
    "Mar del Plata",
  ];

  const filtered = query
    ? locations.filter((loc) => loc.toLowerCase().includes(query))
    : locations;

  return NextResponse.json(filtered.slice(0, 10));
}
