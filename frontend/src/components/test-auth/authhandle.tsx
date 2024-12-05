// authhandle.tsx
import React, { useContext, useState, useEffect, ReactNode } from "react";
import { authStateListener } from "./auth.ts"; 
import { User } from "firebase/auth";

// Define the shape of the context value
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    setIsAuthenticated: (value: boolean) => void; // Add this line
}

// Create the context with an undefined initial value
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = authStateListener((user) => {
            if (user) {
                setIsAuthenticated(true);
                setUser(user);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value = {{ isAuthenticated, user, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};