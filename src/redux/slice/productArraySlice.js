import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const productArraySlice = createSlice({
    name: 'productArray',
    initialState,
    reducers: {
        setProductarray: (state, action) => {
            const { productArray } = action.payload;
            console.log("product array is: ", productArray);
            
            if (productArray?.length > 0) return [...productArray]
            else return state;

        },
    }
})

export const { setProductarray } = productArraySlice.actions;
export default productArraySlice.reducer;