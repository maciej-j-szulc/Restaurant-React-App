import { useReducer } from "react";
import { createContext } from "react";

//Context for managing chosen items list & functions to manage Cart operations
const CartContext = createContext({
    items:[],
    addItem: (item) => {},
    removeItem: (id) => {},
    clearCart: () => {}
});

//Reducer for managing Cart operations
function cartReducer(state, action){
    if(action.type === 'ADD_ITEM'){
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.item.id
        );

        const updatedItems = [...state.items];

        //If item is already in the cart
        if(existingCartItemIndex > -1){
            const existingItem = state.items[existingCartItemIndex];
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity + 1
            };
            updatedItems[existingCartItemIndex] = updatedItem;

        //If the item is new
        } else {
            updatedItems.push({...action.item, quantity: 1})
        }

        return {...state, items: updatedItems};
    }

    if(action.type === 'REMOVE_ITEM'){
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.id
        );

        const existingCartItem = state.items[existingCartItemIndex];

        const updatedItems = [...state.items];
        //If quantity of given item it = 1 remove it
        if(existingCartItem.quantity === 1){
            updatedItems.splice(existingCartItemIndex, 1);
        } else {
            const updatedItem = {
                ...existingCartItem, 
                quantity: existingCartItem.quantity - 1
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        }
        return {...state, items: updatedItems};
    }

    //Clearing cart
    if(action.type === 'CLEAR_CART'){
        return {...state, items: []};
    }

    return state;
}

//Custom Context Provider for Cart operations & providing Cart status across application with a Reducer
export function CartContextProvider({children}){
    const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

    function addItem(item){
        dispatchCartAction({type: 'ADD_ITEM', item});
    }

    function removeItem(id){
        dispatchCartAction({type: 'REMOVE_ITEM', id})
    }

    function clearCart(){
        dispatchCartAction({type: 'CLEAR_CART'})
    }

    //Context structure for providing value
    const cartContext = {
        items: cart.items,
        addItem,
        removeItem,
        clearCart
    };

    return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
}

export default CartContext;