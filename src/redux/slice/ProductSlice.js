import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    productId: null,
    productData: null,
    selectedVariantId: null,
    selectedSize: null,
    variantData: null,
}

const ProductSlice = createSlice({
    name: 'ProductSlice',
    initialState,
    reducers: {
        setProductId: (state, action) => {
            state.productId = action.payload ?? null;
        },
        setVariantId: (state, action) => {
            state.selectedVariantId = action.payload ?? null;
        },
        setProductData: (state, action) => {
            state.productData = action.payload ?? {};
        },
        setSelectedSize: (state, action) => {
            state.selectedSize = action.payload ?? null;
        },
        setVariantData: (state, action) => {
            state.variantData = action.payload ?? null;
        },
        resetProductState: () => {
            return {
                selectedProductId: null,
                productData: null,
                selectedVariantId: null,
                selectedSize: null,
                variantData: null,
            }
        }
    }
})

export const {
    setProductData,
    setProductId,
    setVariantId,
    setSelectedSize,
    setVariantData,
    resetProductState
} = ProductSlice.actions;

export default ProductSlice.reducer;