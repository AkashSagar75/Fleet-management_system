 import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [User, setUser] = useState({
    role_id: null,
     user: null,
  });

  useEffect(() => {
    const user = sessionStorage.getItem('user');
 if (user) {
      setUser({
        user: JSON.parse(user),
      });
    } 
  }, []);

  return (
    <AuthContext.Provider value={{ User, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export const useUser = () => useContext(AuthContext);