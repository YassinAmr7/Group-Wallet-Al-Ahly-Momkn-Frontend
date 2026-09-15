import React, { createContext, useState, useContext, useEffect } from "react";
import { setActiveUserId } from "../api/axiosConfig";
import api from "../api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUserId = Number(localStorage.getItem("activeUserId"));
    return {
      id: Number.isInteger(savedUserId) && savedUserId > 0 ? savedUserId : 1,
      name: "Loading...",
    };
  });

  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    api
      .get("/api/users")
      .then((response) => {
        setAvailableUsers(response.data);

        const savedUserId = Number(localStorage.getItem("activeUserId"));
        const savedUser = response.data.find((user) => user.id === savedUserId);
        const defaultUser = response.data.find((user) => user.id === 1);
        setCurrentUser(savedUser || defaultUser || response.data[0]);
      })
      .catch((err) => {
        console.error("Failed to fetch users from database", err);
      });
  }, []);

  // Update Axios interceptor whenever user changes
  useEffect(() => {
    setActiveUserId(currentUser.id);
    localStorage.setItem("activeUserId", String(currentUser.id));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, availableUsers }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
