// src/context/AppContext.js
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const backendUrl=process.env.REACT_APP_BACKEND_URL;
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/is-auth`, {
        withCredentials: true,
      });

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Error checking auth:", err);
      toast.error("Error checking authentication");
      setIsLoggedIn(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message || "Failed to load user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Error fetching user data");
    }
  };

  useEffect(() => {
    getAuthState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    backendUrl,
    userData,
    isLoggedIn,
    setIsLoggedIn,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
