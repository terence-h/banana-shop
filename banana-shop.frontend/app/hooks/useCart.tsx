export function GetTotalAndShipping(cart: Cart): Cart {
    const updatedCart = { ...cart };
    let totalQuantity = 0;
    updatedCart.subtotal = 0;
    updatedCart.shipping = 0;
    updatedCart.total = 0;

    Object.values(cart.items).map(item => {
        updatedCart.subtotal += item.price * item.quantity;
        totalQuantity += item.quantity;
    });

    updatedCart.shipping = totalQuantity > 0 ? 1.99 + +((totalQuantity / 4).toFixed(0)) : 0;
    updatedCart.total = updatedCart.subtotal + updatedCart.shipping;
    return updatedCart;
}

export function ModifyItemQuantity(cart: Cart, itemId: string, add: boolean): Cart {
    let updatedCart = { ...cart };
    if (updatedCart.items[itemId]) {
        add ? updatedCart.items[itemId].quantity++ : updatedCart.items[itemId].quantity--;
    }
    updatedCart = GetTotalAndShipping(updatedCart);
    return updatedCart;
}

export interface Item {
    id: string;
    name: string;
    price: number;
    quantity: number;
    maxQuantityPerOrder: number;
}

export interface Cart {
    items: { [key: string]: Item; }
    subtotal: number;
    shipping: number;
    total: number;
}