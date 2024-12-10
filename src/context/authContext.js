"use client";
import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import axiosInstance from '@/helpers/axios/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
  

    useEffect(() => {
        const checkAdminStatus = async() => {
            const response = await axiosInstance.get('/api/auth/user')
            console.log("response is: ", response.data);
            
            setIsAdmin(response.data?.user?.isSeller)
        }

        checkAdminStatus();

    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
