import React, { useState, useEffect, useContext } from "react";
import { useMessage } from "../hooks/message.hook";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { GoogleMap, Marker } from "@react-google-maps/api";

import "../styles/homePage.css";

const containerStyle = {
  width: "100%",
  height: "400px",
};
const center = {
  lat: 43.6532,
  lng: -79.3832,
};

export const HomePage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const message = useMessage();
  const { loading, error, request, clearError } = useHttp();
  const auth = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);
  useEffect(() => {
    const token = auth.token;
    fetch("/api/events/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, [auth.token]);
  const registerForEvent = async (eventId) => {
    try {
      const data = await request(
        `/api/events/register/${eventId}`,
        "POST",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      message(data.message);
    } catch (e) {
      message(e.message || "Registration failed");
    }
  };

  return (
    <div className="home-container">
      <div className="left-content">
        <h2 className="eventD">Select an Event to See Details</h2>
        {selectedEvent ? (
          <ul className="event-details-list">
            <li>
              <strong>Title:</strong> {selectedEvent.title}
            </li>
            <li>
              <strong>Description:</strong> {selectedEvent.description}
            </li>
            <li>
              <strong>Date of Start:</strong>{" "}
              {new Date(selectedEvent.date).toLocaleDateString()}
            </li>
            <li>
              <strong>Location:</strong> {selectedEvent.location}
            </li>
            <li>
              <strong>Owner:</strong> {selectedEvent.owner?.firstName}{" "}
              {selectedEvent.owner?.lastName}
            </li>
            <button
              className="register-button"
              onClick={() => registerForEvent(selectedEvent._id)}
              disabled={loading}
            >
              Register for Event
            </button>
          </ul>
        ) : (
          <p>No event selected</p>
        )}
      </div>
      <div className="right-content">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
          {events.map((event) => (
            <Marker
              key={event._id}
              position={{ lat: event.lat, lng: event.lng }}
              onClick={() => setSelectedEvent(event)}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};
