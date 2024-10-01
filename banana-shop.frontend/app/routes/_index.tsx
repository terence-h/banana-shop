import type { MetaFunction } from "@remix-run/node";
import { ReactLenis } from "@studio-freight/react-lenis";
import CartButton from "../components/cart-button";
import Contact from "../components/contact";
import Details from "../components/details";
import Navbar from "../components/navbar";
import Overview from "../components/overview";
import useMobile from "../hooks/useMobile";

export const meta: MetaFunction = () => {
  return [
    { title: "The Best Banana In The World" },
    { name: "description", content: "Welcome!" },
  ];
};

export default function Index() {
  const isMobile = useMobile();

  return (
    <>
      <header>
        <Navbar />
      </header>
      <ReactLenis root>
        <main>
          <Overview className="h-screen w-full" isMobile={isMobile} />
          <Details className="relative h-[500vh] w-full" isMobile={isMobile} />
          <Contact className="h-screen w-full mx-auto" />
        </main>
      </ReactLenis>
      <footer>
        <CartButton isMobile={isMobile}>Test</CartButton>
      </footer>
    </>
  );
}