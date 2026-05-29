export interface Alert {
  id: string;
  propertyId: string;
  type: 'drought' | 'fire' | 'frost' | 'flood';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  ndvi?: number;
  temperature?: number;
  confidence: number;
  status: 'active' | 'acknowledged' | 'resolved';
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertRequest {
  propertyId: string;
  type: Alert['type'];
  severity: Alert['severity'];
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  ndvi?: number;
  temperature?: number;
  confidence: number;
}

export interface UpdateAlertRequest extends Partial<Omit<CreateAlertRequest, 'propertyId'>> {
  status?: Alert['status'];
}