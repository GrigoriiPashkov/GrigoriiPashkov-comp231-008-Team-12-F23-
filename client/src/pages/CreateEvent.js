import React, { useState, useEffect, useContext } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";
import { TagInput } from "../components/TagInput";

export const CreateEvent = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { request, error, loading, clearError } = useHttp();
  const [address, setAddress] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);
  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const createEventHandler = async () => {
    try {
      const eventData = {
        ...form,
        location: address,
        lat: coordinates.lat,
        lng: coordinates.lng,
        tags: selectedTags,
      };
      const data = await request("/api/events/create", "POST", eventData, {
        Authorization: `Bearer ${auth.token}`,
      });
      message(data.message);
    } catch (e) {}
  };

  return (
    <div>
      <form>
        <h1>Create Event</h1>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          id="title"
          value={form.title}
          onChange={changeHandler}
        />
        <label htmlFor="title"></label>
        <input
          name="description"
          placeholder="Event Description"
          id="description"
          value={form.description}
          onChange={changeHandler}
        />
        <label htmlFor="description"></label>
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <input {...getInputProps({ placeholder: "Type address" })} />
              <div>
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => (
                  <div {...getSuggestionItemProps(suggestion)}>
                    {suggestion.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <label htmlFor="location"></label>
        <input
          type="date"
          name="date"
          id="date"
          value={form.date}
          onChange={changeHandler}
        />
        <label htmlFor="date"></label>
        <TagInput
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        <button onClick={createEventHandler} disabled={loading}>
          Create Event
        </button>
      </form>
    </div>
  );
};
