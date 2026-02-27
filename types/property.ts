// types/property.ts

export type PropertyOperation = "sell" | "rent";

export type PropertyType =
  | "house"
  | "apartment"
  | "terrain"
  | "office"
  | "local"
  | "other";

// What you SEND to the API (all optional except internally managed fields)
export interface PropertySearchParams {
  operation?: PropertyOperation;
  type?: PropertyType | string;
  location?: string;
  page?: number;        // optional — hook sets it via pageParam
  limit?: number;       // optional — hook sets it via LIMIT constant
  min_price?: number;
  max_price?: number;
  orderBy?: "price" | "room_amount" | "surface";
  order?: "asc" | "desc";
}

// What you GET BACK from the API (all required — your actions always return these)
export interface PropertySearchResponse {
  properties: TokkoProperty[];
  total: number;        // required
  page: number;         // required
  total_pages: number;  // required
}

export interface TokkoCoverPicture {
  thumb?: string;
  url?: string;
}

export interface TokkoPropertyType {
  id?: number;
  name?: string;
}

export interface TokkoLocation {
  id?: number;
  short_location?: string;
  full_location?: string;
}

export interface TokkoProperty {
  id: number;
  reference_code?: string;
  publication_title?: string;
  type?: TokkoPropertyType;
  location?: TokkoLocation;
  geo_lat?: string;
  geo_long?: string;
  web_price?: string;
  price?: number;
  available_operations?: string[];
  room_amount?: number;
  bathroom_amount?: number;
  surface?: number;
  roofed_surface?: number;
  description?: string;
  rich_description?: string;
  cover_picture?: TokkoCoverPicture;
  amenities?: string[];
}