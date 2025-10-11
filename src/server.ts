import dotenv from 'dotenv';
import app from './app.js';

// Carrega variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/healthcheck`);
});
