import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Item } from "../../hooks/useCart";
import { CustomerDetails } from "../cart";

export default function Index() {
    const { order, items } = useLoaderData<{ order: OrderModel, items: Item[] }>();

    return (
        <section className="py-24 relative">
            <div className="container w-full px-4 md:px-5 mx-auto">

                <h2 className="text-3xl sm:text-4xl leading-10 text-white mix-blend-difference mb-11">
                    Order <span className="font-bold">{order.id}</span>
                </h2>
                <h6 className="font-medium text-xl leading-8 text-white mix-blend-difference mb-3">Hello, {order.customerDetails.name}</h6>
                <p className="font-normal text-lg leading-8 text-white mix-blend-difference mb-11">Your order has been confirmed and will be shipped shortly.</p>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 py-6 border-y border-gray-100 mb-6">
                    <div className="box group">
                        <p className="text-lg font-bold leading-7 text-white mix-blend-difference mb-3">Order Status</p>
                        <h6 className="text-lg leading-9 text-white mix-blend-difzference">{order.status == 0 ? "Pending shipment" : order.status == 1 ? "Shipped" : "Delivered"}</h6>
                    </div>
                    <div className="box group">
                        <p className="text-lg font-bold leading-7 text-white mix-blend-difference mb-3">Address</p>
                        <h6 className="text-lg leading-9 text-white mix-blend-difference">
                            {order.customerDetails.address}<br />
                            {order.customerDetails.apartment!.length > 0 && <><span>{order.customerDetails.apartment}</span><br /></>}
                            {order.customerDetails.city!.length > 0 && <><span>{order.customerDetails.city}</span><br /></>}
                            {order.customerDetails.state!.length > 0 && <><span>{order.customerDetails.state}</span><br /></>}
                            {order.customerDetails.country} {order.customerDetails.postCode}
                        </h6>
                    </div>
                    <div className="box group">
                        <p className="text-lg font-bold leading-7 text-white mix-blend-difference mb-3">Phone No.</p>
                        <h6 className="text-lg leading-9 text-white mix-blend-difference">
                            {order.customerDetails.phone}
                        </h6>
                    </div>
                    <div className="box group">
                        <p className="text-lg font-bold leading-7 text-white mix-blend-difference mb-3">E-mail</p>
                        <h6 className="text-lg leading-9 text-white mix-blend-difference">
                            {order.customerDetails.email}
                        </h6>
                    </div>
                </div>
                {Object.entries(order.items).map(([key, item]) => {
                    return (
                        <OrderItem key={key} id={key} name={item.name} quantity={item.quantity} items={items} />
                    );
                })}

                <div className="flex items-center justify-center sm:justify-end w-full my-6">
                    <div className=" w-full">
                        <div className="flex items-center justify-between mb-6">
                            <p className="font-normal text-lg leading-8 text-white mix-blend-difference">Subtotal</p>
                            <p className="font-semibold text-lg leading-8 text-white mix-blend-difference">${order.subtotal.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <p className="font-normal text-lg leading-8 text-white mix-blend-difference">Shipping</p>
                            <p className="font-semibold text-lg leading-8 text-white mix-blend-difference">${order.shippingCost.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between py-6 border-y border-gray-100">
                            <p className="text-lg leading-9 text-white mix-blend-difference">Total</p>
                            <p className="font-bold text-xl leading-9 text-white mix-blend-difference">${(order.subtotal + order.shippingCost).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="data ">
                    <p className="font-normal text-lg leading-8 text-white mix-blend-difference mb-11">We will be sending a shipping
                        confirmation email when the items shipped successfully.</p>
                    <h6 className="font-bold text-2xl leading-9 text-white mix-blend-difference mb-3">Thank you for shopping
                        with us!</h6>
                </div>
            </div>
        </section>
    );
}

interface OrderItemProps {
    id: string;
    name: string;
    quantity: number;
    items: Item[];
}

function OrderItem({ id, name, quantity, items }: OrderItemProps) {
    const item = items.find(item => +item.id === +id);
    const pricePerQuantity = item ? item.price : 0;

    const totalCost = (quantity * pricePerQuantity).toFixed(2);
    return (
        <div className="grid grid-cols-7 w-full pb-6 border-b border-gray-100">
            <div className="col-span-7 min-[500px]:col-span-2 md:col-span-1">
                <img src={`/items/item-0000${id}.png`} alt={name} className="w-full rounded-xl object-cover" />
            </div>
            <div
                className="col-span-7 min-[500px]:col-span-5 md:col-span-6 min-[500px]:pl-5 max-sm:mt-5 flex flex-col justify-center">
                <div className="flex flex-col min-[500px]:flex-row min-[500px]:items-center justify-between">
                    <div className="">
                        <h5 className="text-lg leading-9 text-white mix-blend-difference mb-6">{name}</h5>
                        <p className="font-normal text-lg leading-8 text-white mix-blend-difference">Quantity : <span
                            className="text-white mix-blend-difference">{quantity}</span></p>
                    </div>

                    <h5 className="text-lg leading-10 text-white mix-blend-difference sm:text-right mt-3">
                        ${totalCost}
                    </h5>
                </div>
            </div>
        </div>
    );
}

export async function loader({ params }: LoaderFunctionArgs) {
    const responseSalesOrder = await fetch(`${process.env.API_URL}/SalesOrder/${params.id}`);
    const responseItems = await fetch(`${process.env.API_URL}/Item`);

    if (!responseSalesOrder.ok) {
        throw new Response(`Sales order ${params.id} not found`, { status: 404 });
    } else if (!responseItems.ok) {
        throw new Response(`Item collection not found`, { status: 404 });
    }

    const order = await responseSalesOrder.json();
    const items = await responseItems.json();

    return { order, items };
}

interface OrderModel {
    id: string;
    items: { [key: string]: Item; };
    customerDetails: CustomerDetails;
    subtotal: number;
    shippingCost: number;
    status: number;
}