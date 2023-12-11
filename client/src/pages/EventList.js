import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import "../styles/autoComplete.css";

import "../styles/eventList.css";

export const EventList = () => {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableEvent, setEditableEvent] = useState(null);
  const { error, request, clearError } = useHttp();
  const message = useMessage();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await request("/api/user/events", "GET", null, {
          Authorization: `Bearer ${token}`,
        });
        setEvents(fetchedData.events);
        setMyEvents(fetchedData.myEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchData();
  }, [request, token]);
  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);
  const toggleEvents = () => {
    setShowMyEvents(!showMyEvents);
  };
  const handleLocationSelect = async (value, eventId) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setEditableEvent((prevEvent) => ({
      ...prevEvent,
      location: value,
      lat: latLng.lat,
      lng: latLng.lng,
    }));
  };
  const handleEventUpdate = async (e, eventId) => {
    e.preventDefault();
    try {
      const data = await request(
        `/api/events/update/${eventId}`,
        "PUT",
        editableEvent,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      message(data.message);

      setIsEditing(false);
    } catch (error) {
      message(error.message || "Update failed");
    }
  };
  const displayedEvents = showMyEvents ? myEvents : events;
  const handleInputChange = (e) => {
    setEditableEvent({ ...editableEvent, [e.target.name]: e.target.value });
  };

  const handleEditClick = (event) => {
    setIsEditing(true);
    setEditableEvent({ ...event });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableEvent(null);
  };

  return (
    <div className="event-list">
      <h1 className="event-list-title">Events</h1>
      <button onClick={toggleEvents} className="toggle-events-button">
        {showMyEvents ? "Events to Attend" : "Show My Events"}
      </button>
      <div className="events-container">
        {displayedEvents.length > 0 ? (
          displayedEvents.map((event) =>
            isEditing && editableEvent?._id === event._id ? (
              <form
                onSubmit={(e) => handleEventUpdate(e, editableEvent._id)}
                key={event._id}
              >
                <input
                  type="text"
                  name="title"
                  value={editableEvent.title}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="description"
                  value={editableEvent.description}
                  onChange={handleInputChange}
                />
                <PlacesAutocomplete
                  value={editableEvent.location}
                  onChange={(location) =>
                    setEditableEvent({ ...editableEvent, location })
                  }
                  onSelect={(location) =>
                    handleLocationSelect(location, editableEvent._id)
                  }
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div>
                      <input
                        {...getInputProps({
                          placeholder: "Search Places ...",
                          className: "location-search-input",
                        })}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";

                          const style = suggestion.active
                            ? { backgroundColor: "#fafafa", cursor: "pointer" }
                            : { backgroundColor: "#ffffff", cursor: "pointer" };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>

                <button type="submit">Save Changes</button>
                <button type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </form>
            ) : (
              <div className="event-card" key={event._id}>
                <h3 className="event-title">
                  <strong>Title: </strong>
                  {event.title}
                </h3>
                <p className="event-description">
                  <strong>Description:</strong>
                  {event.description}
                </p>
                <p className="event-location">
                  <strong>Location:</strong> {event.location}
                </p>

                {showMyEvents && (
                  <button onClick={() => handleEditClick(event)}>Edit</button>
                )}
              </div>
            )
          )
        ) : (
          <p>No events found</p>
        )}
      </div>
    </div>
  );
};
