import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { execute, query } from '@/database/db';

const router = Router();

// Endpoint para criar dados de teste
router.post('/', async (req, res, next) => {
  try {
    const userId = uuidv4();
    const propertyId = uuidv4();
    const now = new Date().toISOString();

    // 1. Criar usuário teste
    await execute(
      `INSERT INTO users (id, email, username, fullName, password, role, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        'farmer@test.com',
        'farmerteste',
        'Fazendeiro Teste',
        '$2a$10$abcdefghijklmnopqrstuvwxyz', // Password hash (já hasheado)
        'farmer',
        now,
        now,
      ]
    );

    // 2. Criar propriedade
    await execute(
      `INSERT INTO properties (id, userId, name, area, latitude, longitude, crops, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        propertyId,
        userId,
        'Fazenda Teste - AgroSat',
        150.5,
        -10.2641,
        -55.5012,
        'Milho, Soja',
        now,
        now,
      ]
    );

    // 3. Criar alertas de teste
    const alerts = [
      {
        id: uuidv4(),
        type: 'drought',
        severity: 'high',
        title: 'Seca Detectada',
        description: 'Umidade do solo abaixo de 20%',
        ndvi: 0.35,
        temperature: 32,
      },
      {
        id: uuidv4(),
        type: 'fire',
        severity: 'critical',
        title: 'Queimada em Progresso',
        description: 'Temperatura anormalmente alta detectada',
        ndvi: 0.15,
        temperature: 85,
      },
      {
        id: uuidv4(),
        type: 'frost',
        severity: 'medium',
        title: 'Geada Possível',
        description: 'Temperatura em queda para próximas horas',
        ndvi: 0.6,
        temperature: 2,
      },
    ];

    for (const alert of alerts) {
      await execute(
        `INSERT INTO alerts (id, propertyId, type, severity, title, description, latitude, longitude, ndvi, temperature, confidence, status, timestamp, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          alert.id,
          propertyId,
          alert.type,
          alert.severity,
          alert.title,
          alert.description,
          -10.2641 + Math.random() * 0.1,
          -55.5012 + Math.random() * 0.1,
          alert.ndvi,
          alert.temperature,
          0.85 + Math.random() * 0.1,
          'active',
          now,
          now,
          now,
        ]
      );
    }

    // 4. Criar dados NDVI
    const ndviData = [
      { value: 0.65, classification: 'moderate' },
      { value: 0.45, classification: 'sparse' },
      { value: 0.75, classification: 'dense' },
    ];

    for (const ndvi of ndviData) {
      await execute(
        `INSERT INTO ndvi_data (id, propertyId, latitude, longitude, value, classification, source, timestamp, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          propertyId,
          -10.2641 + Math.random() * 0.1,
          -55.5012 + Math.random() * 0.1,
          ndvi.value,
          ndvi.classification,
          'sentinel2',
          now,
          now,
        ]
      );
    }

    res.json({
      message: 'Dados de teste criados com sucesso!',
      credentials: {
        email: 'farmer@test.com',
        password: 'senha123',
        userId,
        propertyId,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;