import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/userProfile.css";

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [editableUser, setEditableUser] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
          setEditableUser({
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
          });
        } else {
          throw new Error(data.message || "Could not fetch user data");
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUserData();
  }, [token, dataUpdated]);

  const handleInputChange = (event) => {
    setEditableUser({
      ...editableUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editableUser),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data);
      setEditableUser(data);
      setIsEditMode(false);
      setDataUpdated(true);
      console.log("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  if (!user) {
    return <div>Error</div>;
  }

  return (
    <div className="user-profile">
      <h1 className="profile-title">User Profile</h1>
      <div className="profile-info">
        {isEditMode ? (
          <form onSubmit={handleUpdateSubmit}>
            <input
              type="text"
              name="firstName"
              value={editableUser.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lastName"
              value={editableUser.lastName}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="dateOfBirth"
              value={editableUser.dateOfBirth}
              onChange={handleInputChange}
            />
            <button type="submit">Save Changes</button>
          </form>
        ) : (
          <>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>First Name:</strong> {user.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastName}
            </p>
            <p>
              <strong>Date of Birth:</strong> {user.dateOfBirth}
            </p>
            <button onClick={() => setIsEditMode(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};
