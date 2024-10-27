import { createContext, useState, useEffect, ReactNode } from 'react';
import {jwtDecode} from "jwt-decode";

interface AuthContextType {
    isLoggedIn: boolean;
    login: (token: string, _id: string, email: string, role: string) => void;
    logout: () => void;
}

interface DecodedToken {
    exp: number;
    email: string;
    userId: string;
    role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded: DecodedToken = jwtDecode(token);
            const isExpired = decoded.exp * 1000 < Date.now();
            if (isExpired) {
                console.log("Token expired");
                logout();
            } else {
                console.log("Decoded JWT:", decoded);
                setIsLoggedIn(true);
            }
        }
    }, []);

    const login = (token: string, _id: string, email: string, role: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', _id);
        localStorage.setItem('email', email);
        localStorage.setItem('role', role || 'user');
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};