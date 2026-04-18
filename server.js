import dotenv from "dotenv";
import app from "./src/app.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Note: Database connection is handled inside src/app.js when it is imported

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});