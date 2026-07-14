 import { createContext, useContext, useState, useEffect } from "react";
import { getUserData } from "../Api/common";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

   const userID =  sessionStorage.getItem("id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData({ id: userID });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);