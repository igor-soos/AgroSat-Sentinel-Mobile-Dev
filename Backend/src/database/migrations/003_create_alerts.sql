CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  propertyId TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('drought', 'fire', 'frost', 'flood')),
  severity TEXT NOT NULL CHECK(severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  ndvi REAL,
  temperature REAL,
  confidence REAL NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active', 'acknowledged', 'resolved')) DEFAULT 'active',
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_alerts_propertyId ON alerts(propertyId);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);