import React, { createContext, useState, useContext, useEffect } from "react";
import { setActiveUserId } from "../api/axiosConfig";
import api from "../api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({ id: 1, name: "Khaled" });

  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    api
      .get("/api/users")
      .then((response) => {
        setAvailableUsers(response.data);

        const defaultUser = response.data.find((u) => u.id === 1);
        if (defaultUser) {
          setCurrentUser(defaultUser);
        } else if (response.data.length > 0) {
          setCurrentUser(response.data[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users from database", err);
      });
  }, []);

  // Update Axios interceptor whenever user changes
  useEffect(() => {
    setActiveUserId(currentUser.id);
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
