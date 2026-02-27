import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  const locations = [
    "Buenos Aires",
    "Córdoba",
    "Rosario",
    "Mendoza",
    "La Plata",
    "Mar del Plata",
    "San Miguel de Tucumán",
    "Salta",
    "Santa Fe",
    "San Juan",
    "Resistencia",
    "Neuquén",
    "Posadas",
    "San Luis",
    "Corrientes",
  ];

  const filtered = query
    ? locations.filter((loc) => loc.toLowerCase().includes(query))
    : locations;

  return NextResponse.json(filtered.slice(0, 10));
}
