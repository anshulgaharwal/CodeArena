const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const { connectToDatabase } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToDatabase();
    console.log("PostgreSQL connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error.message);
    process.exit(1);
  }
}

startServer();
