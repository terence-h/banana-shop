import defaultCart from '../data/default-cart.json';

export function GetItemsInCart(): Cart {
    const cartString = localStorage.getItem('cart');
    const cart: Cart = cartString ? JSON.parse(cartString) : defaultCart;
    return cart;
}

export function GetItemsCount(): number {
    const cart = GetItemsInCart();
    let totalCount = 0;

    for (const item of Object.values(cart.items)) {
        totalCount += item.quantity;
    }

    return totalCount;
}

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
    SetCartLocalStorage(updatedCart);
    console.log(updatedCart);
    return updatedCart;
}

function SetCartLocalStorage(cartString: Cart) {
    localStorage.setItem('cart', JSON.stringify(cartString));
}

export interface Item {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Cart {
    items: { [key: string]: Item; }
    subtotal: number;
    shipping: number;
    total: number;
}