import React, { createContext, useState, useEffect } from "react";

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    // Check if there's a stored user role on component mount
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setUserRole(parsedData.Role || "user");
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []);
  
  const login = (role) => {
    setUserRole(role);
  };
  
  const logout = () => {
    setUserRole(null);
    localStorage.removeItem("userData");
  };
  
  return (
    <RoleContext.Provider value={{ userRole, login, logout }}>
      {children}
    </RoleContext.Provider>
  );
}; 