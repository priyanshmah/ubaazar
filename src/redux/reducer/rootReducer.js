import { combineReducers } from "@reduxjs/toolkit";

import productArraySlice from "../slice/productArraySlice.js"
import selectedCategorySlice from "../slice/selectedCategory.js"
import productSlice from "../slice/ProductSlice.js"
import bagSlice from "../slice/bagSlice.js"

const rootReducer = combineReducers({
    productArray: productArraySlice,
    selectedCategory: selectedCategorySlice,
    product: productSlice,
    bag: bagSlice,
})

export default rootReducer;