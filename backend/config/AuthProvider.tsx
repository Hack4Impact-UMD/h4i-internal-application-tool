import React, { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext"; 
import { auth } from "./firebase";
import { User } from "firebase/auth";


interface AuthProviderProps {
    children: ReactNode; // Define children as a required prop
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        setUser(firebaseUser);
      });
  
      return unsubscribe;
    }, []);
  
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
  };
