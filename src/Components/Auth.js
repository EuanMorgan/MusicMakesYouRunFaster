import React, { useEffect, useState } from "react";
import { firebaseApp } from "../firebase/firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(async (user) => {
      console.log(user);
      setCurrentUser(user);

      setPending(false);
    });
  }, []);
  console.log(pending);
  if (pending) {
    //   TODO: add loading spinner
    return <h1>Loading.......</h1>;
  }

  return (
    <AuthContext.Provider value={{ currentUser }} pending={{ pending }}>
      {children}
    </AuthContext.Provider>
  );
};
