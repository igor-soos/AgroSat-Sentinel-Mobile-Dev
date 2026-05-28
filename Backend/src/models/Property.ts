export interface Property {
  id: string;
  userId: string;
  name: string;
  area: number;
  latitude: number;
  longitude: number;
  crops?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyRequest {
  name: string;
  area: number;
  latitude: number;
  longitude: number;
  crops?: string;
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {}