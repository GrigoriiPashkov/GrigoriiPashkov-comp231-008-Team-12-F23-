const { Router } = require("express");
const Event = require("../models/Event");
const User = require("../models/User"); // Make sure this path is correct

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
    const events = await Event.find({})

      .populate("owner", "firstName lastName") // Populating owner data
      .exec();
    res.json(events);
  } catch (e) {
    res.status(500).json({ message: "Something goes wrong", error: e.message });
  }
});

// Register for an event
router.post("/register/:eventId", auth, async (req, res) => {
  try {
    console.log(req.params);
    console.log(req.user);
    const { eventId } = req.params;
    const userId = req.user.userId; // Assuming your auth middleware sets req.user

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is already registered
    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    // Add user to event's attendees
    event.attendees.push(userId);
    await event.save();

    // Add event to user's events
    const user = await User.findById(userId);
    user.events.push(eventId);
    await user.save();

    res.json({ message: "Registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;
