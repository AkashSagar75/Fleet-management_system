 import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

   const [User, setUser] = useState(() => {
    const user = sessionStorage.getItem("user");

    return {
      role_id: user ? JSON.parse(user)?.role_id ?? null : null,
      user: user ? JSON.parse(user) : null,
    };
  });

  return (
    <AuthContext.Provider value={{ User, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export const useUser = () => useContext(AuthContext);