export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Email ou senha incorretos',
  EMAIL_ALREADY_EXISTS: 'Este email já está cadastrado',
  USER_NOT_FOUND: 'Usuário não encontrado',
  INVALID_TOKEN: 'Token inválido ou expirado',
  MISSING_TOKEN: 'Token não fornecido',
  UNAUTHORIZED: 'Não autorizado',
  INTERNAL_ERROR: 'Erro interno do servidor',
  VALIDATION_ERROR: 'Erro na validação dos dados',
  PROPERTY_NOT_FOUND: 'Propriedade não encontrada',
  ALERT_NOT_FOUND: 'Alerta não encontrado',
};

export const ALERT_TYPES = {
  DROUGHT: 'drought',
  FIRE: 'fire',
  FROST: 'frost',
  FLOOD: 'flood',
} as const;

export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const NDVI_CLASSIFICATIONS = {
  WATER: 'water',
  BARREN: 'barren',
  SPARSE: 'sparse',
  MODERATE: 'moderate',
  DENSE: 'dense',
} as const;