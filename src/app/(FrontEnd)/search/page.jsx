"use client";
import Category from '@/components/feed/category';
import ProductFeed from '@/components/feed/post';
import axiosInstance from '@/helpers/axios/axiosInstance';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { IoSearch } from 'react-icons/io5'

function Search() {
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);

const handleSearchQuery = async() => {
    try {

        if (searchQuery.length < 3) {
            toast.error("Invalid search query")
            return ;
        }
        
        const response = await axios.post('/api/search', JSON.stringify({
            search: searchQuery
        }));

        console.log("response is: ", response.data);
        

        if (response.data?.success && response.data?.results) {
            console.log("search results is: ", response.data)
            setSearchResults(response.data?.results)
            
        } else toast.error("Invalid search query")
        

    } catch (error) {
        toast.error("Something went wrong...Plz try again later");
        return ;
    }
}

  return (
    <div className='flex flex-col gap-4 px-2'>
        <form 
        onSubmit={handleSearchQuery}
        className='bg-searchBarColor rounded-xl w-full p-2 flex flex-row items-center gap-2'>
            <IoSearch size={"1.2rem"} className='text-silver'/>
            <input 
            type='search'
            value={searchQuery}
            onChange={(e) =>{
                e.preventDefault();
                setSearchQuery(e.target.value)
            }}
            maxLength={50}
            minLength={3}
            placeholder='Search for brands, products and more'
            className='focus:outline-none bg-searchBarColor w-full'
            
            />
        </form>
        { searchResults.length == 0 && <div className='rounded-2xl shadow mx-2 border-pink border'>
            <div className='p-2 text-white bg-pink border-pink border-b text-lg font-semibold rounded-t-xl'>
                Popular searches
            </div>
            <div className='text-xs flex flex-col gap-2 p-4 font-semibold text-pink'>
                <div>
                    Party Wear Sarees
                </div>
                <div>
                    Daily Wear Sarees
                </div>
                <div>
                    Cord set
                </div>
                <div>
                    Traditional Suit
                </div>
                <div>
                    Daily wear suits
                </div>
            </div>
        </div>}

        {
            searchResults.length > 0 && (
               <SearchResults results={searchResults}/>
            )
        }
        <Toaster />
    </div>
  )
}

export default Search

function SearchResults({ results }){
    return (
        <div>
            <ProductFeed feed={results}/>
        </div>
    )
}