import { createSlice } from "@reduxjs/toolkit";

const initialState = 'sarees';

const selectedCategorySlice = createSlice({
    name: 'selectedCategory',
    initialState,
    reducers: {
        setSelectedCategory: (_, action) => {
            const { category } = action.payload;
            return category;
        },
    }
})

export const { setSelectedCategory } = selectedCategorySlice.actions;
export default selectedCategorySlice.reducer;