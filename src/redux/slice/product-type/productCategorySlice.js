import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    
}

const ProductCategoryDataSlice = createSlice({
    name: 'ProductCategoryData',
    initialState,
    reducers: {
        setCategoryData: (state, action) => {
            const {
                    productCategoryData
                } = action.payload;
               
            return {
                ...state,
                ...productCategoryData
            }
        },
        resetCategoryData: () => {
            return {}
        }
    }
})

export const { setCategoryData, resetCategoryData } = ProductCategoryDataSlice.actions;
export default ProductCategoryDataSlice.reducer;