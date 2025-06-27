import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
    totalCount: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart(state, action) {
            state.cart = action.payload;
        },
        update(state, action) {
            const item = state.cart.find((c) => c.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },        
        calculateTotal(state) {
            let sum = 0;
            let price = 0;
            state.cart.forEach((c) => {
                sum += c.quantity;
                const productPrice = parseFloat(c.product.discount_price);
                if (!isNaN(productPrice)) {
                    price += productPrice * c.quantity;
                }
            });
            state.totalCount = sum;
            state.totalPrice = price;
        },
    },
});

export const { setCart, update, calculateTotal } = cartSlice.actions;
export default cartSlice.reducer;
