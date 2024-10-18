import { combineReducers } from "@reduxjs/toolkit";

import productDetailSlice from "../slice/productDetailSlice";
import productCategorySlice from "../slice/product-type/productCategorySlice";
import productInventorySlice from "../slice/product-type/productInventorySlice";


const rootReducer = combineReducers({
    productDetails: productDetailSlice,
    productCategoryData: productCategorySlice,
    productVariants: productInventorySlice
})

export default rootReducer;