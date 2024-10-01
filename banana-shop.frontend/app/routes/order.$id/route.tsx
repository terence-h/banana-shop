import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Item } from "../../hooks/useCart";
import { CustomerDetails } from "../cart";

export default function Index() {
    const { order } = useLoaderData<{ order: OrderModel }>();

    return (
        <div>
            <h1>Order ID: {order.id}</h1>
            <h1>Order Status: {order.status == 0 ? "Pending shipment" : order.status == 1 ? "Shipped" : "Delivered"}</h1>
            <h1>Subtotal: ${order.subtotal.toFixed(2)}</h1>
            <h1>Shipping: ${order.shippingCost.toFixed(2)}</h1>
            <h1>Total: ${(order.subtotal + order.shippingCost).toFixed(2)}</h1>
            <br />
            <h2 className="underline">List of Items</h2>
            <ul>
                {Object.entries(order.items).map(([id, item]) => {
                    return (
                        <li key={id}>{item.name} x{item.quantity}</li>
                    )
                })}
            </ul>
            <br />
            <h2 className="underline">Customer Details</h2>
            <p>Name: {order.customerDetails.name}</p>
            <p>Address: {order.customerDetails.address}</p>
            <p>Apartment: {order.customerDetails.apartment!.length == 0 ? "-" : order.customerDetails.apartment}</p>
            <p>City: {order.customerDetails.city!.length == 0 ? "-" : order.customerDetails.city}</p>
            <p>State: {order.customerDetails.state!.length == 0 ? "-" : order.customerDetails.state}</p>
            <p>Postal/Zip Code: {order.customerDetails.postCode}</p>
            <p>Phone: {order.customerDetails.phone}</p>
            <p>E-mail: {order.customerDetails.email}</p>
        </div>
    );
}

export async function loader({ params }: LoaderFunctionArgs) {
    const response = await fetch(`${process.env.API_URL}/SalesOrder/${params.id}`);

    if (!response.ok) {
        throw new Response("Not Found", { status: 404 });
    }

    const order = await response.json();
    console.log(order);

    return { order };
}

interface OrderModel {
    id: string;
    items: { [key: string]: Item; };
    customerDetails: CustomerDetails;
    subtotal: number;
    shippingCost: number;
    status: number;
}