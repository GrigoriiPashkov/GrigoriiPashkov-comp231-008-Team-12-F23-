import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

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

  const { logout } = useContext(AuthContext);
  const auth = useContext(AuthContext);
  const [events, setEvents] = useState([]);
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

  return (
    <div>
      <div className="home-container">
        <div className="left-content">
          <h2>Event</h2>

          <button className="add-building-button">Add Building</button>
        </div>

        <div className="right-content">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            {events.map((event) => (
              <Marker
                key={event._id}
                position={{ lat: event.lat, lng: event.lng }}
                onClick={() => setSelectedEvent(event)}
              />
            ))}

            {selectedEvent && (
              <InfoWindow
                position={{ lat: selectedEvent.lat, lng: selectedEvent.lng }}
                onCloseClick={() => setSelectedEvent(null)}
              >
                <div>
                  <h2>{selectedEvent.title}</h2>
                  <p>{selectedEvent.description}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};
