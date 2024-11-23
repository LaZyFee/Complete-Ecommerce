import dotenv from "dotenv";
import connectDB from "./src/config/DBconnection.js";
import app from "./app.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
