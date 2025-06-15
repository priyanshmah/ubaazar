import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedCategory: 'all',
    categorisedProducts: null,
    products: null
};

const FeedSlice = createSlice({
    name: 'feedSlice',
    initialState,
    reducers: {
        setSelectedCategory: (state, action) => {
            const newCategory = action.payload;
            state.selectedCategory = newCategory ?? null;

            if (newCategory === 'all') {
                state.categorisedProducts = state.products
            }
            else {
                const filteredProducts = state.products?.filter(value => value.category === state.selectedCategory);
                state.categorisedProducts = filteredProducts || [];
            }

        },
        setCategorisedProducts: (state, action) => {
            state.categorisedProducts = action.payload ?? null;
        },
        setProducts: (state, action) => {
            state.products = action.payload ?? null;
        },

    }
});

export const {
    setCategorisedProducts,
    setSelectedCategory,
    setTrendingProducts,
    setProducts,
} = FeedSlice.actions;

export default FeedSlice.reducer;

