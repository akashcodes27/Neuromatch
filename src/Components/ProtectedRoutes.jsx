// import React from "react";
// import { Navigate } from "react-router-dom";
// import { auth } from "../firebase";

// const ProtectedRoute = ({ children }) => {
//   const user = auth.currentUser;

//   return user ? children : <Navigate to="/" />;
// };

// export default ProtectedRoute;



import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined means: still checking

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return <div>Loading...</div>; // or show a spinner
  }

  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
