import { useNavigate } from "@remix-run/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { GetItemsCount } from "~/hooks/useCart";
import { BsCart } from "react-icons/bs";
import { motion } from 'framer-motion';

export default function CartButton({ isMobile }: AddToCartButtonProps) {
    const navigate = useNavigate();

    const [cartItemCount, setCartItemCount] = useState<number>(0);

    useEffect(() => {
        setCartItemCount(GetItemsCount());
    }, []);

    function onPointerDown() {
        navigate('/cart');
    }

    return (
        <div className="fixed right-7 bottom-7 md:right-10 md:bottom-10">
            <motion.button className="p-3 rounded-full shadow-lg bg-white text-yellow-400" aria-label="Cart"
                onPointerDown={onPointerDown}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
            >
                <BsCart size={isMobile ? 25 : 40} />
                {cartItemCount > 0 &&
                    <span className="absolute inset-0 object-right-top -mr-8">
                        <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-yellow-400 text-white">
                            {cartItemCount}
                        </div>
                    </span>
                }
            </motion.button>
        </div>
    );
}

interface AddToCartButtonProps extends PropsWithChildren {
    isMobile: boolean;
}