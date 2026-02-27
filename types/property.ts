export type PropertyOperation = "sell" | "rent";

export type PropertyType =
  | "house"
  | "apartment"
  | "terrain"
  | "office"
  | "local"
  | "other";

export interface PropertySearchParams {
  operation?: PropertyOperation;
  type?: PropertyType | string; // Tokko type id (number as string) or legacy PropertyType
  location?: string;
  page?: number;
  limit?: number;
  min_price?: number;
  max_price?: number;
  orderBy?: "price" | "room_amount" | "surface";
  order?: "asc" | "desc";
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
  price?: number; // numeric price from operations for filtering
  available_operations?: string[];
  room_amount?: number;
  bathroom_amount?: number;
  surface?: number;
  roofed_surface?: number;
  description?: string;
  cover_picture?: TokkoCoverPicture;
  amenities?: string[];
}

export interface PropertySearchResponse {
  properties: TokkoProperty[];
  total?: number;
  page?: number;
  total_pages?: number;
}
