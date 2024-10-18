"use client";
import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');

        if (token) setIsLoggedIn(true);
        else setIsLoggedIn(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
