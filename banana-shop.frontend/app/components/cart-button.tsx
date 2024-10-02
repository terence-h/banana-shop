import { useNavigate } from "@remix-run/react";
import { PropsWithChildren } from "react";
import { BsCart } from "react-icons/bs";
import { motion } from 'framer-motion';

export default function CartButton({ isMobile }: AddToCartButtonProps) {
    const navigate = useNavigate();

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
            </motion.button>
        </div>
    );
}

interface AddToCartButtonProps extends PropsWithChildren {
    isMobile: boolean;
}