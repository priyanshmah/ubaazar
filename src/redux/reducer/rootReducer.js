import { combineReducers } from "@reduxjs/toolkit";

import productArraySlice from "../slice/productArraySlice.js"
import selectedCategorySlice from "../slice/selectedCategory.js"

const rootReducer = combineReducers({
    productArray: productArraySlice,
    selectedCategory: selectedCategorySlice,
})

export default rootReducer;