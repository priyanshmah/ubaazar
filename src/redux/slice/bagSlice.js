import { createSlice } from "@reduxjs/toolkit"

// Constants
const COD_CHARGES = 79;
const MRP_MULTIPLIER = 1.5;

// Helper functions
const calculateProductTotals = (products) => {
    if (!Array.isArray(products)) return { totalMrp: 0, subTotal: 0 };
    
    return products.reduce((acc, item) => {
        const price = Number(item?.price) || 0;
        const quantity = Number(item?.quantity) || 0;
        const mrp = Number(item?.mrp) || Math.round(price * MRP_MULTIPLIER);

        return {
            totalMrp: acc.totalMrp + (mrp * quantity),
            subTotal: acc.subTotal + (price * quantity)
        };
    }, { totalMrp: 0, subTotal: 0 });
};

const validateProduct = (product) => {
    if (!product?.productId) {
        console.warn('Invalid product: Missing ID');
        return false;
    }
    if (typeof product.price !== 'number' || isNaN(product.price)) {
        console.warn(`Invalid product price for product ${product.id}`);
        return false;
    }
    if (typeof product.quantity !== 'number' || isNaN(product.quantity)) {
        console.warn(`Invalid product quantity for product ${product.id}`);
        return false;
    }
    return true;
};

const initialState = {
    selectedAddress: '',
    products: [],
    appliedCoupon: '',
    priceDetails: {
        totalMrp: 0,
        subTotal: 0,
        couponDiscount: 0,
        codCharges: 0,
    },
    paymentMode: 'ONLINE'
};

const BagSlice = createSlice({
    name: 'BagSlice',
    initialState,
    reducers: {
        setPriceDetails: (state, action) => {
            const {
                totalMrp = state.priceDetails.totalMrp,
                subTotal = state.priceDetails.subTotal,
                codCharges = state.priceDetails.codCharges,
                couponDiscount = state.priceDetails.couponDiscount
            } = action.payload || {};

            // Ensure non-negative values
            state.priceDetails = {
                totalMrp: Math.max(0, Number(totalMrp) || 0),
                subTotal: Math.max(0, Number(subTotal) || 0),
                codCharges: Math.max(0, Number(codCharges) || 0),
                couponDiscount: Math.max(0, Number(couponDiscount) || 0)
            };
        },

        setPaymentMode: (state, action) => {
            const  paymentMode = action.payload || {};
            
            // Default to ONLINE if invalid payment mode
            state.paymentMode = ['ONLINE', 'COD', 'PARTIAL_COD'].includes(paymentMode) ? paymentMode : 'ONLINE';
            state.priceDetails.codCharges = state.paymentMode === 'COD' ? COD_CHARGES : 0;
        },

        setAppliedCoupon: (state, action) => {
            state.appliedCoupon = action.payload || '';
        },

        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload || {};
        },

        setProductQuantity: (state, action) => {
            const { productId, quantity } = action.payload || {};
            
            if (!productId || typeof quantity !== 'number' || isNaN(quantity)) {
                console.warn('Invalid product quantity update attempt');
                return;
            }

            const productIndex = state.products.findIndex(
                (value) => value?.productId?.toString() === productId?.toString()
            );

            if (productIndex === -1) {
                console.warn(`Product ${productId} not found in bag`);
                return;
            }

            const product = state.products[productIndex];
            if (!validateProduct(product)) return;
            
            const price = product.price;
            const mrp = Number(product?.mrp) || Math.round(price * MRP_MULTIPLIER);
            const prevQuantity = product.quantity;
            const newQuantity = Math.max(0, quantity);

            console.log("new quantity is: ", newQuantity);
            
            // Update product quantity
            product.quantity = newQuantity;
            
            // Update price details
            state.priceDetails.totalMrp += (newQuantity - prevQuantity) * mrp;
            state.priceDetails.subTotal += (newQuantity - prevQuantity) * price;
        },

        setProducts: (state, action) => {

            // Filter out invalid products
            const validProducts = action.payload.filter(validateProduct);

            // Calculate totals
            const { totalMrp, subTotal } = calculateProductTotals(validProducts);

            // Update state
            state.products = validProducts;
            state.appliedCoupon = '';
            state.paymentMode = 'ONLINE';
            state.priceDetails = {
                totalMrp,
                subTotal,
                couponDiscount: 0,
                codCharges: 0
            };
        },

        removeProduct: (state, action) => {
            const { productId } = action.payload || {};
            
            if (!productId) {
                console.warn('Invalid product ID for removal');
                return;
            }

            const productIndex = state.products.findIndex(
                (value) => value?.productId?.toString() === productId?.toString()
            );

            if (productIndex === -1) {
                console.warn(`Product ${productId} not found for removal`);
                return;
            }

            const product = state.products[productIndex];
            if (!validateProduct(product)) return;

            const price = product.price;
            const mrp = Math.round(price * MRP_MULTIPLIER);
            const quantity = product.quantity;

            // Remove product
            state.products.splice(productIndex, 1);

            // Update price details
            state.priceDetails.totalMrp -= mrp * quantity;
            state.priceDetails.subTotal -= price * quantity;
        },

        clearBag: (state) => {
            state.products = [];
            state.appliedCoupon = '';
            state.paymentMode = 'ONLINE';
            state.priceDetails = {
                totalMrp: 0,
                subTotal: 0,
                couponDiscount: 0,
                codCharges: 0
            };
        }
    }
});

export const {
    setPriceDetails,
    setPaymentMode,
    setAppliedCoupon,
    setSelectedAddress,
    setProductQuantity,
    setProducts,
    removeProduct,
    clearBag
} = BagSlice.actions;

export default BagSlice.reducer;