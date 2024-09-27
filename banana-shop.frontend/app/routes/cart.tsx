import { MetaFunction } from "@remix-run/react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { PointerEventHandler, useEffect, useState } from "react";
import { GetItemsInCart, Item, ModifyItemQuantity, Cart, GetTotalAndShipping } from "~/hooks/useCart";

export const meta: MetaFunction = () => {
    return [
        { title: "The Best Banana In The World" },
        { name: "description", content: "Welcome!" },
    ];
};

export default function Index() {
    const [cart, setCart] = useState<Cart>();

    useEffect(() => {
        const cartWithoutTotal = GetItemsInCart();
        setCart(GetTotalAndShipping(cartWithoutTotal));
    }, [])

    function OnModifyQuantity(itemId: string, add: boolean) {
        const updatedCart = ModifyItemQuantity(cart!, itemId, add);
        setCart(updatedCart);
    }

    return (
        <ReactLenis root>
            <div className="max-w-6xl max-lg:max-w-2xl mx-auto p-4">
                <div className="grid lg:grid-cols-2 gap-12">
                    <div>
                        <div className="p-6 rounded-md">
                            <h2 className="text-2xl font-extrabold text-white mix-blend-difference">Your Cart</h2>

                            {cart && Object.values(cart.items).map(item => {
                                const totalPrice = item.price * item.quantity;
                                return (<CartItem
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    price={totalPrice}
                                    quantity={item.quantity}
                                    onAddQuantity={() => { OnModifyQuantity(item.id, true) }}
                                    onMinusQuantity={() => { OnModifyQuantity(item.id, false) }} />);
                            })}
                        </div>

                        {/* Card accepted */}
                        {/* <div className="mt-4 flex flex-wrap justify-center gap-4">
                            <img src='https://readymadeui.com/images/master.webp' alt="card1" className="w-12 object-contain" />
                            <img src='https://readymadeui.com/images/visa.webp' alt="card2" className="w-12 object-contain" />
                            <img src='https://readymadeui.com/images/american-express.webp' alt="card3" className="w-12 object-contain" />
                        </div> */}
                    </div>
                    {cart &&
                        <CartForm cart={cart} />
                    }
                </div>
            </div>
        </ReactLenis>
    );
}

function CartItem({ id, name, price, quantity, onAddQuantity, onMinusQuantity }: CartItemProps) {
    return (
        <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 shrink-0 p-2 rounded-md">
                    <img src={`items/${id}.png`} className="w-full h-full object-contain" alt="Product Item" />
                </div>

                <div className="w-full">
                    <h3 className="text-base emibold text-white mix-blend-difference">{name}</h3>
                    <h6 className="text-sm text-white mix-blend-difference font-bold cursor-pointer mt-0.5">${price.toFixed(2)}</h6>

                    <div className="flex gap-4 mt-4">
                        <div>
                            <button type="button"
                                onPointerDown={(e) => quantity > 0 && onMinusQuantity(e)}
                                disabled={quantity === 0}
                                className="px-3 py-3 border border-gray-300 text-white disabled:border-gray-600 disabled:text-gray-600 mix-blend-difference text-xs outline-none bg-transparent rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 fill-current" viewBox="0 0 124 124">
                                    <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" data-original="#000000"></path>
                                </svg>
                            </button>
                            <span className="mx-5">{quantity}</span>
                            <button type="button"
                                onPointerDown={onAddQuantity}
                                className="px-3 py-3 border border-gray-300 text-white disabled:border-gray-600 disabled:text-gray-600 mix-blend-difference text-xs outline-none bg-transparent rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 fill-current" viewBox="0 0 42 42">
                                    <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" data-original="#000000"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Delete */}
                        {/* <div className="ml-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 fill-red-500 inline cursor-pointer" viewBox="0 0 24 24">
                                <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" data-original="#000000"></path>
                                <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" data-original="#000000"></path>
                            </svg>
                        </div> */}
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </div>
    );
}

function CartForm({ cart }: CartFormProps) {
    return (
        <form>
            <h2 className="text-2xl font-extrabold text-white mix-blend-difference ">Payment Details</h2>
            <div className="grid gap-4 mt-8">
                <div>
                    <label htmlFor="name" className="block text-base font-semibold text-white mix-blend-difference mb-2">Card Holder Name</label>
                    <input required type="text" name="name" id="name" autoComplete="name" placeholder="John Doe" className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                </div>

                <div>
                    <label htmlFor="cardNumber" className="block text-base font-semibold text-white mix-blend-difference mb-2">Card Number</label>
                    <div className="flex bg-transparent border border-gray-300 rounded-md focus-within:border-yellow-400 overflow-hidden">
                        <input required type="number" name="cardNumber" id="cardNumber" autoComplete="cc-number" placeholder="1234 5678 9012 3456" className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="expiryDate" className="block text-base font-semibold text-white mix-blend-difference mb-2">Expiry Date</label>
                        <input required type="number" name="expiryDate" id="expiryDate" autoComplete="cc-exp" placeholder="09/29" className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                    </div>

                    <div>
                        <label htmlFor="cvv" className="block text-base font-semibold text-white mix-blend-difference mb-2">CVV</label>
                        <input required type="number" name="cvv" id="cvv" placeholder="123" className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                    </div>
                </div>
            </div>

            <ul className="text-white mix-blend-difference mt-8 space-y-4">
                <li className="flex flex-wrap gap-4 text-sm">Subtotal <span className="ml-auto font-bold">${cart.subtotal.toFixed(2) ?? 0}</span></li>
                <li className="flex flex-wrap gap-4 text-sm">Shipping <span className="ml-auto font-bold">${cart.shipping.toFixed(2) ?? 0}</span></li>
                {/* <li className="flex flex-wrap gap-4 text-sm">Discount <span className="ml-auto font-bold">$0.00</span></li>
                <li className="flex flex-wrap gap-4 text-sm">Tax <span className="ml-auto font-bold">$4.00</span></li> */}
                <hr className="border-gray-300" />
                <li className="flex flex-wrap gap-4 text-sm font-bold">Total <span className="ml-auto">${cart.total.toFixed(2) ?? 0}</span></li>
            </ul>

            <button type="button" className="mt-8 text-sm px-4 py-3 w-full font-semibold tracking-wide bg-yellow-400 text-white rounded-md"><span className="mix-blend-difference">Make Payment</span></button>
        </form>
    );
}

interface CartItemProps extends Item {
    onAddQuantity: PointerEventHandler;
    onMinusQuantity: PointerEventHandler;
}

interface CartFormProps {
    cart: Cart;
}