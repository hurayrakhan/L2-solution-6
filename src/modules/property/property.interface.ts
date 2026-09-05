export type TPropertyFilterRequest = {
  q?: string;
  city?: string;
  area?: string;
  propertyType?: 'FLAT' | 'SUBLET' | 'MESS';
  minRent?: string;
  maxRent?: string;
  isAvailable?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
