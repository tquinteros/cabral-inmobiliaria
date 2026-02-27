"use server";

import axios from "axios";
import type {
  PropertySearchParams,
  PropertySearchResponse,
  TokkoProperty,
} from "@/types/property";
import { getPropertyTypes } from "@/lib/actions/property-types";

const TOKKO_BASE_URL =
  process.env.TOKKO_BASE_URL || "https://www.tokkobroker.com/api";
const TOKKO_API_KEY = process.env.TOKKO_API_KEY;

const MAX_PRICE = 999999999999;

interface TokkoPhoto {
  image?: string;
  thumb?: string;
  original?: string;
  is_front_cover?: boolean;
}

interface TokkoOperation {
  operation_id?: number;
  operation_type?: string;
  prices?: Array<{ currency?: string; price?: number }>;
}

interface TokkoRawProperty {
  id: number;
  reference_code?: string;
  type?: { name?: string };
  location?: { short_location?: string };
  geo_lat?: string;
  geo_long?: string;
  publication_title?: string;
  photos?: TokkoPhoto[];
  web_price?: boolean;
  operations?: TokkoOperation[];
  room_amount?: number;
  bathroom_amount?: number;
  surface?: string;
  roofed_surface?: string;
  total_surface?: string;
  description?: string;
  rich_description?: string;
  custom_tags?: Array<{ public_name?: string; name?: string }>;
}

function mapTokkoToProperty(raw: TokkoRawProperty): TokkoProperty {
  const coverPhoto =
    raw.photos?.find((p) => p.is_front_cover) ?? raw.photos?.[0];
  const operation = raw.operations?.[0];
  const price = operation?.prices?.[0];
  const priceNum = price ? Number(price.price) : undefined;
  const priceStr =
    raw.web_price && price
      ? `${price.currency ?? "USD"} ${Number(price.price).toLocaleString()}`
      : "Consultar precio";

  const availableOperations = (raw.operations ?? []).map((op) =>
    op.operation_type?.toLowerCase().includes("rent") ? "rent" : "sell"
  );

  const surfaceNum = parseFloat(
    raw.total_surface ?? raw.roofed_surface ?? raw.surface ?? "0"
  );
  const roofedNum = parseFloat(raw.roofed_surface ?? "0");
  const amenities = (raw.custom_tags ?? [])
    .map((t) => t.public_name ?? t.name ?? "")
    .filter(Boolean);
  return {
    id: raw.id,
    reference_code: raw.reference_code,
    publication_title: raw.publication_title,
    type: raw.type ? { name: raw.type.name } : undefined,
    location: raw.location
      ? { short_location: raw.location.short_location }
      : undefined,
    geo_lat: raw.geo_lat,
    geo_long: raw.geo_long,
    web_price: priceStr,
    price: priceNum,
    available_operations:
      availableOperations.length ? availableOperations : ["sell"],
    room_amount: raw.room_amount,
    bathroom_amount: raw.bathroom_amount,
    surface: surfaceNum || undefined,
    roofed_surface: roofedNum || undefined,
    description: raw.description,
    rich_description: raw.rich_description,
    cover_picture: coverPhoto
      ? {
        url: coverPhoto.image ?? coverPhoto.original,
        thumb: coverPhoto.thumb ?? coverPhoto.image,
      }
      : undefined,
    amenities: amenities.length ? amenities : undefined,
  };
}

export async function getProperties(
  filters?: PropertySearchParams
): Promise<PropertySearchResponse> {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 12;
  const offset = (page - 1) * limit;

  try {
    const params: Record<string, string | number> = {
      key: TOKKO_API_KEY ?? "",
      format: "json",
      lang: "es_ar",
      limit,
      offset,
    };

    const { data } = await axios.get(`${TOKKO_BASE_URL}/v1/property/`, {
      params,
      timeout: 30000,
    });

    const objects = (data as { objects?: TokkoRawProperty[] })?.objects ?? [];
    const meta = (data as { meta?: { total_count?: number } })?.meta;
    const totalCount = meta?.total_count ?? objects.length;

    const properties = objects
      .filter((p) => p && typeof p.id !== "undefined")
      .map(mapTokkoToProperty);

    return {
      properties,
      total: totalCount,
      page,
      total_pages: Math.ceil(totalCount / limit) || 1,
    };
  } catch (error) {
    console.error("Tokko API error:", error);
    return {
      properties: [],
      total: 0,
      page: 1,
      total_pages: 0,
    };
  }
}

export async function searchProperties(
  filters: PropertySearchParams
): Promise<PropertySearchResponse> {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 12;
  const offset = (page - 1) * limit;
  console.log(filters, "filters");
  try {
    let operationTypes: number[];
    if (filters.operation === "sell") {
      operationTypes = [1];
    } else if (filters.operation === "rent") {
      operationTypes = [2];
    } else {
      operationTypes = [1, 2];
    }

    const minPrice = filters?.min_price;
    const maxPrice = filters?.max_price;

    let price_from: number;
    let price_to: number;
    if (minPrice != null && maxPrice != null) {
      price_from = minPrice;
      price_to = maxPrice;
    } else if (minPrice != null) {
      price_from = minPrice;
      price_to = MAX_PRICE;
    } else if (maxPrice != null) {
      price_from = 0;
      price_to = maxPrice;
    } else {
      price_from = 0;
      price_to = MAX_PRICE;
    }

    const propertyTypes = await getPropertyTypes();
    const allTypeIds = propertyTypes.map((t) => t.id);
    const typeId = filters?.type ? parseInt(String(filters.type), 10) : NaN;
    const property_types = !isNaN(typeId)
      ? [typeId]
      : allTypeIds.length > 0
        ? allTypeIds
        : [1, 2, 3, 4, 5, 6, 7];

    const locationId = filters?.location
      ? parseInt(String(filters.location), 10)
      : NaN;

    const searchData: Record<string, unknown> = {
      price_from,
      price_to,
      operation_types: operationTypes,
      property_types,
      limit,
      offset,
    };

    if (!isNaN(locationId)) {
      searchData.current_localization_id = [locationId];
      searchData.current_localization_type = "division";
    }

    const { data } = await axios.get(
      `${TOKKO_BASE_URL}/v1/property/search`,
      {
        params: {
          data: JSON.stringify(searchData),
          key: TOKKO_API_KEY ?? "",
          format: "json",
          lang: "es_ar",
        },
        timeout: 30000,
      }
    );

    const objects = (data as { objects?: TokkoRawProperty[] })?.objects ?? [];
    const meta = (data as { meta?: { total_count?: number } })?.meta;
    const totalCount = meta?.total_count ?? objects.length;

    const properties = objects
      .filter((p) => p && typeof p.id !== "undefined")
      .map(mapTokkoToProperty);

    return {
      properties,
      total: totalCount,
      page,
      total_pages: Math.ceil(totalCount / limit) || 1,
    };
  } catch (error) {
    console.error("Tokko API error:", error);
    return {
      properties: [],
      total: 0,
      page: 1,
      total_pages: 0,
    };
  }
}

export async function getPropertyById(
  id: number
): Promise<TokkoProperty | null> {
  const idNum = parseInt(String(id), 10);
  if (isNaN(idNum)) return null;

  try {
    const { data } = await axios.get(`${TOKKO_BASE_URL}/v1/property/${idNum}/`, {
      params: {
        key: TOKKO_API_KEY,
        format: "json",
        lang: "es_ar",
      },
      timeout: 30000,
    });
    console.log(data.rich_description,"asdasd")
    const raw = data as TokkoRawProperty;
    if (raw && typeof raw.id !== "undefined") {
      return mapTokkoToProperty(raw);
    }
  } catch (error) {
    console.error("Tokko API error:", error);
  }

  return null;
}
