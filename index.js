const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const app = express();

app.use(express.json({ extended: true }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/events", require("./routes/event.routes"));

const PORT = config.get("port") || 5000;
async function start() {
  try {
    mongoose.connection.on("connecting", () => {
      console.log("Connecting to MongoDB...");
    });

    mongoose.connection.on("error", (error) => {
      console.error("Error in MongoDb connection: " + error);
      mongoose.disconnect();
    });

    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB!");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("Reconnected to MongoDB!");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected!");
    });
    await mongoose.connect(config.get("mongoUri"));
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}`));
  } catch (e) {
    console.log("Server Error", e.message);
    process.exit(1);
  }
}
start();
