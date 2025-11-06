export interface PropertyImage {
  key: string;
  url: string;
}

export interface Property {
  id: number;
  title: string;
  type: string;
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
  createdAt: string;
  updatedAt: string;
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
