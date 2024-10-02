import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import useMobile from "../hooks/useMobile";
import { useLenis } from "@studio-freight/react-lenis";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "@remix-run/react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({
        left: 0, // Used on larger window
        top: 0, // Used on smaller window
        width: 0,
        opacity: 0
    });
    const [height, setHeight] = useState(0);
    const listRef = useRef<HTMLUListElement>(null);
    const [isTriggerResize, setTriggerResize] = useState(false);

    const isMobile = useMobile();

    useEffect(() => {
        if (isMobile) {
            setTriggerResize(false);
        } else {
            setTriggerResize(true);
            setIsOpen(false);
        }
    }, [isMobile])

    useEffect(() => {
        if (listRef.current) {
            setHeight(listRef.current.scrollHeight);
        }
    }, [isOpen]);

    const variants = {
        desktop: {
            height: 'auto',
            transition: { duration: 0 }
        },
        mobile: {
            height: isOpen ? height : 0,
            opacity: isOpen ? 1 : 0,
            transition: { duration: isTriggerResize ? 0 : 0.2, ease: 'easeInOut' }
        }
    }

    return (
        <nav className={`w-screen fixed top-0 ${isOpen ? "bg-yellow-400/80" : "bg-transparent"} md:bg-white/60 md:dark:bg-gray-950/20 z-50`}>
            <div className="flex justify-between items-center px-4 py-2">
                <motion.ul ref={listRef}
                    onPointerLeave={() => {
                        setPosition(prev => ({
                            ...prev,
                            opacity: 0
                        }));
                    }}
                    className={`relative w-fit md:w-full p-1 overflow-hidden flex flex-col md:flex-row md:h-auto`}
                    animate={isMobile ? "mobile" : "desktop"}
                    variants={variants}
                >
                    <div className="md:flex md:flex-1 md:justify-center">
                        <NavbarItem setPosition={setPosition} navLink="#overview">Overview</NavbarItem>
                        <NavbarItem setPosition={setPosition} navLink="#details">Details</NavbarItem>
                        <NavbarItem setPosition={setPosition} navLink="#contact">Contact</NavbarItem>
                    </div>
                    <Cursor position={position} />
                </motion.ul>

                <button
                    className="text-black dark:text-white ml-auto mt-4 mr-4 md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <GiHamburgerMenu size={30} />
                </button>
            </div>
        </nav>
    );
}

const NavbarItem = ({ children, setPosition, navLink }: NavbarItemProps) => {
    const ref = useRef<HTMLLIElement>(null);
    const navigate = useNavigate();
    const lenis = useLenis();

    return (
        <motion.li
            ref={ref}
            onPointerEnter={() => {
                if (!ref.current) return;

                const { width } = ref.current.getBoundingClientRect();
                setPosition({
                    left: ref.current.offsetLeft,
                    top: ref.current.offsetTop,
                    width,
                    opacity: 1
                });
            }}
            onPointerDown={() => {
                if (navLink.charAt(0) === '#') {
                    lenis?.scrollTo(navLink);
                } else {
                    navigate(navLink);
                }

            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 block cursor-pointer px-3 py-1.5 uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base">
            {children}
        </motion.li>
    );
}

const Cursor = ({ position }: CursorProps) => {
    return <motion.li
        animate={position}
        className="absolute z-0 h-7 mt-1 w-36 rounded-full bg-black dark:bg-white opacity-0 md:h-12 md:mt-0"></motion.li>
}

interface NavbarItemProps extends PropsWithChildren {
    setPosition: React.Dispatch<React.SetStateAction<{
        left: number;
        top: number;
        width: number;
        opacity: number;
    }>>
    navLink: string;
}

interface CursorProps extends PropsWithChildren {
    position: {
        left: number,
        top: number,
        width: number,
        opacity: number
    }
}