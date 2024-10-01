import { Form, MetaFunction, redirect, useActionData } from "@remix-run/react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { ChangeEvent, ChangeEventHandler, PointerEventHandler, useEffect, useState } from "react";
import { GetItemsInCart, ModifyItemQuantity, Cart, GetTotalAndShipping, Item } from "../hooks/useCart";

export const meta: MetaFunction = () => {
    return [
        { title: "The Best Banana In The World" },
        { name: "description", content: "Welcome!" },
    ];
};

export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const itemsJson = JSON.parse(formData.get("items") as string) as { [key: string]: { quantity: number } };
    const cartItems = Object.entries(itemsJson);
    const items: { [key: string]: { quantity: number } } = {};

    cartItems.forEach(([key, value]) => {
        items[key] = { quantity: value.quantity }
    });

    const customerDetails = {
        name: formData.get("name") as string,
        address: formData.get("address") as string,
        apartment: formData.get("apartment") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        postcode: parseInt(formData.get("postcode")!.toString()),
        phone: parseInt(formData.get("phone")!.toString()),
        email: formData.get("email")
    };

    const data = {
        id: null,
        items,
        customerDetails,
        subtotal: parseFloat(formData.get("subtotal")!.toString()),
        shippingCost: parseFloat(formData.get("shippingCost")!.toString()),
        status: 0,
    };

    const response = await fetch('http://localhost:5066/api/SalesOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        return { error: "Failed to create the order" };
    }

    const orderId = await response.text();

    return redirect(`/order/${orderId}`)
}

export default function Index() {
    const actionData = useActionData<ActionData>();

    const [cart, setCart] = useState<Cart>();
    const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
        name: "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        postCode: "",
        phone: "",
        email: ""
    });

    function handleFormChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setCustomerDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    useEffect(() => {
        fetch(`http://localhost:5066/api/Item`)
            .then((results) => {
                return results.json();
            })
            .then((data: Item[]) => {
                const itemCart: { [key: string]: Item; } = {};

                data.forEach(item => {
                    const idStr = item.id.toString();
                    itemCart[idStr] = {
                        id: idStr,
                        name: item.name,
                        price: item.price,
                        quantity: 0,
                        maxQuantityPerOrder: item.maxQuantityPerOrder
                    }
                });

                const cart: Cart = {
                    items: itemCart,
                    subtotal: 0,
                    shipping: 0,
                    total: 0
                }

                setCart(cart);
            })
    }, []);

    useEffect(() => {
        const cartWithoutTotal = GetItemsInCart();
        setCart(GetTotalAndShipping(cartWithoutTotal));
    }, []);

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
                                    maxQuantityPerOrder={item.maxQuantityPerOrder}
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
                        <CartForm cart={cart} customerDetails={customerDetails} handleFormChange={handleFormChange} actionData={actionData} />
                    }
                </div>
            </div>
        </ReactLenis>
    );
}

function CartItem({ id, name, price, quantity, maxQuantityPerOrder, onAddQuantity, onMinusQuantity }: CartItemProps) {
    return (
        <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 shrink-0 p-2 rounded-md">
                    <img src={`items/item-0000${id}.png`} className="w-full h-full object-contain" alt={`Product Item ${id}`} />
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
                                onPointerDown={(e) => quantity < maxQuantityPerOrder && onAddQuantity(e)}
                                disabled={quantity === maxQuantityPerOrder}
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

function CartForm({ cart, customerDetails, handleFormChange, actionData }: CartFormProps) { // handleFormSubmit
    return (
        <Form method="post">
            <input required type="hidden" name="items" id="items" value={JSON.stringify(cart.items)} />
            <input required type="hidden" name="subtotal" id="subtotal" value={cart.subtotal} />
            <input required type="hidden" name="shippingCost" id="shippingCost" value={cart.shipping} />
            <h2 className="text-2xl font-extrabold text-white mix-blend-difference ">Payment Details</h2>
            <div className="grid gap-4 mt-8">
                <div>
                    <label htmlFor="name" className="block text-base font-semibold text-white mix-blend-difference mb-2">Name<span className="text-yellow-400">*</span></label>
                    <input required type="text" name="name" id="name" autoComplete="name" placeholder="John Doe"
                        value={customerDetails.name}
                        onChange={handleFormChange as ChangeEventHandler<HTMLInputElement>}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                </div>
                <div>
                    <label htmlFor="address" className="block text-base font-semibold text-white mix-blend-difference mb-2">Address<span className="text-yellow-400">*</span></label>
                    <textarea required name="address" id="address" rows={4} autoComplete="address-line1" placeholder="Blk 123 Eunos St 45"
                        value={customerDetails.address}
                        onChange={handleFormChange as ChangeEventHandler<HTMLTextAreaElement>}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                </div>
                <div>
                    <label htmlFor="apartment" className="block text-base font-semibold text-white mix-blend-difference mb-2">Apartment No.</label>
                    <input type="text" name="apartment" id="apartment" autoComplete="address-line2" placeholder="#02-345"
                        value={customerDetails.apartment}
                        onChange={handleFormChange as ChangeEventHandler<HTMLInputElement>}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-base font-semibold text-white mix-blend-difference mb-2">City</label>
                        <input type="text" name="city" id="city" placeholder="Los Angeles"
                            value={customerDetails.city}
                            onChange={handleFormChange as ChangeEventHandler<HTMLInputElement>}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-base font-semibold text-white mix-blend-difference mb-2">State</label>
                        <input type="text" name="state" id="state" placeholder="California"
                            value={customerDetails.state}
                            onChange={handleFormChange as ChangeEventHandler<HTMLInputElement>}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="postcode" className="block text-base font-semibold text-white mix-blend-difference mb-2">Postal/Zip Code<span className="text-yellow-400">*</span></label>
                        <input required type="number" name="postcode" id="postcode" placeholder="123456"
                            value={customerDetails.postCode}
                            onChange={handleFormChange as ChangeEventHandler<HTMLInputElement>}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-base font-semibold text-white mix-blend-difference mb-2">Phone No.<span className="text-yellow-400">*</span></label>
                        <input required type="number" name="phone" id="phone" placeholder="83457645"
                            value={customerDetails.phone}
                            onChange={handleFormChange as ChangeEventHandler<HTMLInputElement>}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-base font-semibold text-white mix-blend-difference mb-2">E-mail<span className="text-yellow-400">*</span></label>
                    <input required type="email" name="email" id="email" placeholder="johndoe@gmail.com"
                        value={customerDetails.email}
                        onChange={handleFormChange as ChangeEventHandler<HTMLInputElement>}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                </div>

                <br />

                <div>
                    <label htmlFor="cardName" className="block text-base font-semibold text-white mix-blend-difference mb-2">Card Holder Name<span className="text-yellow-400">*</span></label>
                    <input required type="text" name="cardName" id="cardName" autoComplete="name" placeholder="John Doe" className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                </div>

                <div>
                    <label htmlFor="cardNumber" className="block text-base font-semibold text-white mix-blend-difference mb-2">Card Number<span className="text-yellow-400">*</span></label>
                    <div className="flex bg-transparent border border-gray-300 rounded-md focus-within:border-yellow-400 overflow-hidden">
                        <input required type="number" name="cardNumber" id="cardNumber" autoComplete="cc-number" placeholder="1234 5678 9012 3456" className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="expiryDate" className="block text-base font-semibold text-white mix-blend-difference mb-2">Expiry Date<span className="text-yellow-400">*</span></label>
                        <input required type="number" name="expiryDate" id="expiryDate" autoComplete="cc-exp" placeholder="09/29" className="block w-full rounded-md border-0 px-3.5 py-2 text-white bg-gray-950 mix-blend-difference shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 md:text-sm md:leading-6" />
                    </div>

                    <div>
                        <label htmlFor="cvv" className="block text-base font-semibold text-white mix-blend-difference mb-2">CVV<span className="text-yellow-400">*</span></label>
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

            {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}

            <button type="submit"
                className="mt-8 text-sm px-4 py-3 w-full font-semibold tracking-wide bg-yellow-400 text-white rounded-md disabled:bg-gray-800"
                disabled={cart.subtotal == 0}
            >
                <span className="mix-blend-difference">Make Payment</span>
            </button>
        </Form>
    );
}

interface CartItemProps extends Item {
    onAddQuantity: PointerEventHandler;
    onMinusQuantity: PointerEventHandler;
}

interface CartFormProps {
    cart: Cart;
    customerDetails: CustomerDetails;
    handleFormChange: ChangeEventHandler<HTMLInputElement> | ChangeEventHandler<HTMLTextAreaElement>;
    actionData: ActionData | undefined;
}

export interface CustomerDetails {
    name: string;
    address: string;
    apartment?: string;
    city?: string;
    state?: string;
    postCode: string;
    phone: string;
    email: string;
}

interface ActionData {
    error?: string;
}