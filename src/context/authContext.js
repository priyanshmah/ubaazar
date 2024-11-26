"use client";
import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
  

    useEffect(() => {
        const token = Cookies.get('token');
        const checkAdminStatus = async(authToken) => {
            const response = await axios.get('/api/auth/user', {
                headers: {
                    'Authorization': authToken
                }
            })
            
            setIsAdmin(response.data?.user?.isSeller)
        }

        if (token) {
            setIsLoggedIn(true);
            checkAdminStatus(token);            

        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
