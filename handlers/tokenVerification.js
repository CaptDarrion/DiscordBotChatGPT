const dotenv = require('dotenv');
dotenv.config();

const requiredKeys = ['TOKEN', 'OPENAI_API_KEY', 'CHAT_BOT_CHANNEL'];
const missingKeys = requiredKeys.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  console.log(`Missing required keys in .env file: ${missingKeys.join(', ')}`);
  process.exit(1);
}
