import { createContext, useContext, useState, useEffect } from "react";

export const CartContext = createContext(null);

export const useCart = () => {
    const cart = useContext(CartContext);
    return cart;
};

export const CartContextProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        // Load cart items from localStorage if available
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        // Save cart items to localStorage whenever they change
        localStorage.setItem("cartItems", JSON.stringify(items));
    }, [items]);

    return (
        <CartContext.Provider value={{ items, setItems }}>
            {children}
        </CartContext.Provider>
    );
};