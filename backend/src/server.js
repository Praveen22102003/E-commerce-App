const app = require('./app');
require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('─────────────────────────────────────');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  console.log('─────────────────────────────────────');
});