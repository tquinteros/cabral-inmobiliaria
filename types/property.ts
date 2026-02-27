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
  type?: PropertyType;
  location?: string;
  page?: number;
  limit?: number;
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
  web_price?: string;
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
