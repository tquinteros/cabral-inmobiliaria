"use server";

import axios from "axios";

const TOKKO_BASE_URL = (
  process.env.TOKKO_BASE_URL || "https://www.tokkobroker.com/api"
).trim();
const TOKKO_API_KEY = (process.env.TOKKO_API_KEY || "").trim();

export interface PropertyTypeItem {
  id: number;
  code: string;
  name: string;
}

export async function getPropertyTypes(): Promise<PropertyTypeItem[]> {
  try {
    const { data } = await axios.get(`${TOKKO_BASE_URL}/v1/property_type/`, {
      params: {
        key: TOKKO_API_KEY,
        format: "json",
        lang: "es_ar",
        limit: 100,
      },
      timeout: 10000,
    });

    const objects = (data as { objects?: PropertyTypeItem[] })?.objects ?? [];
    return objects.filter(
      (item) => item && typeof item.id !== "undefined" && item.name
    );
  } catch (error) {
    console.error("Tokko property types API error:", error);
    return [];
  }
}
