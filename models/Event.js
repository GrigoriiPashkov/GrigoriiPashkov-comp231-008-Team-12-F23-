const { Schema, model, Types } = require("mongoose");

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  date: { type: Date, required: true },
  owner: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("Event", eventSchema);
