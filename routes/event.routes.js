const { Router } = require("express");
const Event = require("../models/Event");

const auth = require("../middlware/auth.middleware");
const config = require("config");
const router = Router();
// Create an event
router.post("/create", auth, async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, location, lat, lng, date } = req.body;
    const owner = req.user.userId;

    const existingEvent = await Event.findOne({ location });
    if (existingEvent) {
      return res
        .status(400)
        .json({ message: "An event at this time and place already exists." });
    }
    console.log("Received event data:", req.body);
    console.log("Owner", owner);
    const event = new Event({
      title,
      description,
      date,
      location,
      lat,
      lng,
      owner,
    });
    await event.save();
    res.status(201).json(event);
  } catch (e) {
    res.status(500).json({
      message: "Something goes wrong,Please try again",
      error: e.message,
    });
  }
});

// Get all events
router.get("/all", auth, async (req, res) => {
  try {
    const events = await Event.find({});

    res.json(events);
  } catch (e) {
    res.status(500).json({ message: "Something goes wrong", error: e.message });
  }
});

// Register for an event
router.post("/register/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (event.attendees.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event." });
    }

    event.attendees.push(userId);
    await event.save();
    res.json({ message: "Registered successfully." });
  } catch (e) {
    res.status(500).json({ message: "Something goes wrong", error: e.message });
  }
});

module.exports = router;
