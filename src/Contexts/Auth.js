import React, { useEffect, useState, useContext } from "react";
import { auth, db } from "../firebase/firebase";
//We want to be able to access current user anywhere in application
//To do this, I make a context.
//The provider wraps the code that needs access
//It has a prop called value which will be the current user.
//TLDR: the context passes down the information without having to manually
//pass it as props to every component, can think of it like a global state
export const AuthContext = React.createContext();
//use auth allows us to actually use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [userData, setUserData] = useState();
  const [pending, setPending] = useState(true); //loading true by default because it takes a second to get user data
  useEffect(() => {
    //whenever a new user is logged in, this method is called
    //in use effect to only set listener once, and to unsubscribe when needed
    const unsub = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      setPending(false);
    });
    return unsub;
  }, []);
  // These functions can be switched out if not using firebase
  const signIn = (token) => {
    return auth.signInWithCustomToken(token);
  };
  const signOut = () => {
    return auth.signOut();
  };
  const fetchUserData = async () => {
    const usersRef = db.collection("users").doc(currentUser.uid);
    let doc;
    // Attempt to grab user data
    try {
      doc = await usersRef.get();
    } catch (error) {
      return { errorMessage: "Incorrect permissions" };
    }

    if (!doc.exists) {
      signOut();
      return { errorMessage: "User not found" };
    }

    const data = doc.data();
    try {
      return setUserData({
        ...userData,

        name: data.fitbit.user_name,
        profilePicUrl: data.fitbit.profile_pic_url,
        fitbitId: currentUser.uid,
        fitbitRefreshToken: data.fitbit.refresh_token,
        spotifyRefreshToken: data.spotify ? data.spotify.refresh_token : "",
      });
    } catch (error) {
      return { errorMessage: "There has been an error with your user data." };
    }
  };

  const value = {
    currentUser,
    signIn,
    signOut,
    fetchUserData,
    userData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!pending && children}
    </AuthContext.Provider>
  );
};
