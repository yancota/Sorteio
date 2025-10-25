const cors = require('cors');

module.exports = cors({
  origin: function (origin, callback) {
    // Permite qualquer origem em desenvolvimento (localhost)
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:3000', 'https://localhost:49674', 'http://localhost:49674', 'http://localhost:61497']; // Adicione a porta do Flutter Web
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true, // Se usar cookies/autenticação
  optionsSuccessStatus: 200
});