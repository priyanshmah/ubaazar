import { combineReducers } from "@reduxjs/toolkit";

import feedSlice from "../slice/productArraySlice.js"
import productSlice from "../slice/ProductSlice.js"
import bagSlice from "../slice/bagSlice.js"

const rootReducer = combineReducers({
    feed: feedSlice,
    product: productSlice,
    bag: bagSlice,
});

export default rootReducer;