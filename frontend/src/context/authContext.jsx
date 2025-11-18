import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const userContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Always send cookies with requests
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:3000/api";

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get("/auth/verify");
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log("Verify error:", error.response?.data || error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // When user logs in (after successful login API)
  const login = (userData) => {
    setUser(userData);
  };

  // Logout: clear cookie on server + reset state
  const logout = async () => {
    try {
      await axios.post("/auth/logout"); // backend clears cookie
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
export default AuthProvider;
