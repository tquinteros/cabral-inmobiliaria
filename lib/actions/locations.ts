"use server";

import axios from "axios";

const TOKKO_BASE_URL =
  process.env.TOKKO_BASE_URL || "https://www.tokkobroker.com/api";
const TOKKO_API_KEY = process.env.TOKKO_API_KEY;

export interface LocationDivision {
  id: number;
  name: string;
  resource_uri: string;
}

export interface StateResponse {
  id: number;
  name: string;
  full_location: string;
  divisions: LocationDivision[];
}

/** Capital Federal state ID = 146 (barrios of Buenos Aires) */
export async function getStateDivisions(
  stateId: number = 146
): Promise<LocationDivision[]> {
  try {
    const { data } = await axios.get<StateResponse>(
      `${TOKKO_BASE_URL}/v1/state/${stateId}/`,
      {
        params: {
          key: TOKKO_API_KEY ?? "",
          format: "json",
          lang: "es_ar",
        },
        timeout: 10000,
      }
    );

    return data?.divisions ?? [];
  } catch (error) {
    console.error("Tokko state/divisions API error:", error);
    return [];
  }
}
