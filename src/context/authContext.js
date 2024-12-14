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
    const [bagItems, setBagItems] = useState('');
  

    useEffect(() => {
        const checkAdminStatus = async() => {
            const accessToken = Cookies.get('access-token');

            if(accessToken){

                const response = await axiosInstance.get('/api/auth/user')            
                setIsAdmin(response.data?.user?.isSeller)

            } else setIsAdmin(false)
        }

        checkAdminStatus();

        const storedBag = localStorage.getItem('bag');
        if (storedBag) {
            const parsedBag = JSON.parse(storedBag) || [];
            setBagItems(parsedBag?.length)
        }

    }, []);

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, 
            setIsLoggedIn, 
            isAdmin,
            bagItems,
            setBagItems
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
