import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    variants: []
};

const productInventorySlice = createSlice({
    name: 'variants',
    initialState,
    reducers: {
        addVariant: (state, actions) => {

            const { newVariant } = actions.payload;
            const newIndex = state.variants.length;

            return {
                ...state,
                variants: [
                    ...state.variants,
                    { ...newVariant, index: newIndex }
                ]
            }

        },
        deleteVariant: (state, actions) => {

            const { index } = actions.payload;            
            const updatedVariant = state.variants.filter((element) => element.index !== index);

            return {
                variants: [
                    ...updatedVariant
                ]
            }
        },
        resetVariants: () => {
            return {
                variants: []
            }
        }
    }
})

export const { addVariant, deleteVariant, resetVariants } = productInventorySlice.actions;
export default productInventorySlice.reducer;