// Carrega as variáveis de ambiente locais (para desenvolvimento)
// Esta linha será ignorada no Render, o que é correto.
require('dotenv').config({ path: '.env.bolao' });

// Objeto de configuração base para desenvolvimento (local)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sorteio',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',

  // Configurações adicionais
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Objeto de configuração para produção (Render)
const productionConfig = {
  // O Render fornece a URL de conexão completa na variável DATABASE_URL
  connectionString: process.env.DATABASE_URL,

  // O Render exige SSL para conexões de banco de dados
  ssl: {
    rejectUnauthorized: false
  },

  // Configurações adicionais
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Exporta a configuração correta baseada no ambiente
// No Render, você DEVE definir a variável de ambiente NODE_ENV="production"
module.exports = process.env.NODE_ENV === 'production' ? productionConfig : dbConfig;