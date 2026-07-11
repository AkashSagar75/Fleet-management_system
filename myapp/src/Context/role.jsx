 import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [authRole, setAuthRole] = useState({
    role_id: null,
  });

  useEffect(() => {
    const user = sessionStorage.getItem('user');
 if (user) {
      setAuthRole({
        user: JSON.parse(user),
      });
    } 
  }, []);

  return (
    <AuthContext.Provider value={{ authRole, setAuthRole }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export const useUser = () => useContext(AuthContext);