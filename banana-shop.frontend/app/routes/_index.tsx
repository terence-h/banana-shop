import { json, type MetaFunction } from "@remix-run/node";
import { ReactLenis } from "@studio-freight/react-lenis";
import CartButton from "../components/cart-button";
import Contact from "../components/contact";
import Details from "../components/details";
import Navbar from "../components/navbar";
import Overview from "../components/overview";
import useMobile from "../hooks/useMobile";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "The Best Banana In The World" },
    { name: "description", content: "The Best Banana In The World" },
  ];
};

export function loader() {
  const apiUrl = process.env.API_URL;
  return json<ApiUrl>({ apiUrl });
}

export default function Index() {
  const isMobile = useMobile();
  const { apiUrl } = useLoaderData<ApiUrl>();

  return (
    <>
      <header>
        <Navbar />
      </header>
      <ReactLenis root>
        <main>
          <Overview className="h-screen w-full" isMobile={isMobile} />
          <Details className="relative h-[500vh] w-full" isMobile={isMobile} />
          <Contact className="h-screen w-full mx-auto" apiUrl={apiUrl} />
        </main>
      </ReactLenis>
      <footer>
        <CartButton isMobile={isMobile} />
      </footer>
    </>
  );
}

export interface ApiUrl {
  apiUrl: string;
}