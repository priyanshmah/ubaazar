"use client";
import Post from './post.jsx'
import axios from 'axios';
import { useEffect, useState } from "react";

export default function MorePosts({ feed }) {
  const [page, setPage] = useState(1);
  const [feedData, setFeedData] = useState((feed && [...feed]) || []);

  const handelInfiniteScroll = async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.scrollHeight
      ) {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, []);

  const getMorePosts = async() => {
    
  const posts = await axios.get(`/api/feed`);
  const {feed} = posts.data;

    feed && setFeedData(prev => [...prev, ...feed])
  }

  useEffect(() => {
    getMorePosts();
  }, [page])

  return (
    <>
        <Post feed={feedData}/>
    </>
  )
}
