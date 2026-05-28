CREATE TABLE IF NOT EXISTS thermal_anomalies (
  id TEXT PRIMARY KEY,
  propertyId TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  temperature REAL NOT NULL,
  anomaly BOOLEAN NOT NULL,
  confidence REAL NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_thermal_propertyId ON thermal_anomalies(propertyId);
CREATE INDEX IF NOT EXISTS idx_thermal_anomaly ON thermal_anomalies(anomaly);