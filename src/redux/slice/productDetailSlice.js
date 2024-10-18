import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    productName: null,
    description: null,
    price: null,
    category: null
};

const productDetailSlice = createSlice({
    name: 'productDetails',
    initialState,
    reducers: {
        setDetails: (state, action) => {
            const { productName, description, price, category } = action.payload;

            return {
                productName,
                description,
                price,
                category
            }
        },
        resetDetails: () => {
            return {
                productName: null,
                description: null,
                price: null,
                category: null
            }
        }
    }
})

export const { setDetails, resetDetails } = productDetailSlice.actions;
export default productDetailSlice.reducer;