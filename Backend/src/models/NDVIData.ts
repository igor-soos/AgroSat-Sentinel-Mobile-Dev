export interface NDVIData {
  id: string;
  propertyId: string;
  latitude: number;
  longitude: number;
  value: number;
  classification: 'water' | 'barren' | 'sparse' | 'moderate' | 'dense';
  timestamp: string;
  source: 'sentinel2' | 'landsat8';
  createdAt: string;
}

export interface CreateNDVIDataRequest {
  propertyId: string;
  latitude: number;
  longitude: number;
  value: number;
  classification: NDVIData['classification'];
  source?: NDVIData['source'];
}