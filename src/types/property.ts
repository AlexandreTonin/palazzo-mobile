export interface PropertyImage {
  key: string;
  url: string;
}

export interface Property {
  id: number;
  title: string;
  type: "house" | "apartment" | "penthouse" | "loft";
  price: string;
  description: string;
  city: string;
  neighborhood: string;
  region: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  images: PropertyImage[];
  contactPhone: string;
  contactEmail: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: number;
  userId: number;
  listingId: number;
  createdAt: string;
  updatedAt: string;
  listing: Property;
}

export interface PropertiesResponse {
  data: Property[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  type?: "house" | "apartment" | "penthouse" | "loft";
  search?: string;
  country?: string;
  city?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  minSquareMeters?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreatePropertyData {
  title: string;
  type: "house" | "apartment" | "penthouse" | "loft";
  price: string;
  description: string;
  city: string;
  neighborhood: string;
  region: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  contactPhone: string;
  contactEmail: string;
  images: File[];
}

export interface UpdatePropertyData {
  title?: string;
  type?: "house" | "apartment" | "penthouse" | "loft";
  price?: string;
  description?: string;
  city?: string;
  neighborhood?: string;
  region?: string;
  country?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  contactPhone?: string;
  contactEmail?: string;
  images?: File[];
  removeImages?: string[];
}

export function getPropertyTypeName(type: string): string {
  switch (type) {
    case "house":
      return "Casa";
    case "apartment":
      return "Apartamento";
    case "penthouse":
      return "Cobertura";
    case "loft":
      return "Loft";
    default:
      return "Desconhecido";
  }
}
