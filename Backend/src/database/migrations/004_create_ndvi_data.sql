CREATE TABLE IF NOT EXISTS ndvi_data (
  id TEXT PRIMARY KEY,
  propertyId TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  value REAL NOT NULL,
  classification TEXT NOT NULL CHECK(classification IN ('water', 'barren', 'sparse', 'moderate', 'dense')),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  source TEXT DEFAULT 'sentinel2',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ndvi_propertyId ON ndvi_data(propertyId);
CREATE INDEX IF NOT EXISTS idx_ndvi_timestamp ON ndvi_data(timestamp);