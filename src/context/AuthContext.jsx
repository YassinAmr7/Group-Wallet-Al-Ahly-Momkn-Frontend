import React, { createContext, useState, useContext, useEffect } from "react";
import { setActiveUserId } from "../api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // We will default to Khaled (ID: 1)
  const [currentUser, setCurrentUser] = useState({ id: 1, name: "Khaled" });

  // A list of our pre-made users from data.sql
  const availableUsers = [
    { id: 1, name: "Khaled" },
    { id: 2, name: "Junior Intern" },
    { id: 3, name: "Team Lead" },
  ];

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
