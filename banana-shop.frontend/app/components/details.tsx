import { CSSProperties, PropsWithChildren, useRef } from "react";
import Section from "./section";
import bananaBg from '../images/banana-bg.png';
import bananaBgMobile from '../images/banana-bg-mobile.png';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import nutritionInfos from '../data/nutrition-info.json';

export default function Details({ className, style, isMobile }: DetailsProps) {
    return (
        <Section sectionId="details" className={className} style={style}>
            <BackgroundImage isMobile={isMobile} />
            <ParallaxContent isMobile={isMobile} />
        </Section>
    );
}

function BackgroundImage({ isMobile }) {
    const { scrollYProgress } = useScroll();
    const backgroundSize = useTransform(scrollYProgress,
        [0, 0.2, 0.8, 1],
        ["50%", "100%", "100%", "50%"]
    );
    const clip1 = useTransform(scrollYProgress,
        [0, 0.2],
        [25, 0]
    );
    const clip2 = useTransform(scrollYProgress,
        [0, 0.2],
        [75, 100]
    );

    const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

    return (
        <motion.div
            className="sticky top-0 h-screen w-full"
            style={{
                backgroundImage: `url(${isMobile ? bananaBgMobile : bananaBg})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize,
                clipPath
            }}
        />
    );
}

function ParallaxContent({ isMobile }) {
    return (
        <div className="mx-auto">
            {nutritionInfos.map((info) => {
                return (
                    <NutritionInfo key={info.header} header={info.header} x={info.x} start={info.start} end={info.end}
                        className="mb-40"
                    >
                        <span>{info.text}</span>
                    </NutritionInfo>
                );
            })}
        </div>
    );
}

function NutritionInfo({ children, header, className, x = 0, start, end }: NutritionInfo) {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: [`${start}px end`, `end ${end * -1}px`]
    });
    const opacity = useTransform(scrollYProgress,
        [0, 0.2, 0.8, 1],
        [0, 1, 1, 0]
    );
    const y = useTransform(scrollYProgress,
        [0, 1],
        [start, end]
    )
    const scale = useTransform(scrollYProgress,
        [0, 0.2, 0.8, 1],
        [0.5, 1, 1, 0.5]
    );
    const transform = useMotionTemplate`${x ? `translateX(${x}vw)` : ''} translateY(${y}px) scale(${scale})`;

    return (
        <motion.div ref={ref} className={`flex justify-center ${className}`} style={{ opacity, transform }}>
            <div
                className="block max-w-[18rem] rounded-lg bg-white/80 shadow-secondary-1 dark:bg-gray-950/80">
                <div
                    className="border-b-2 border-yellow-400 px-1 py-1 md:px-5 md:py-2 text-center">
                    {header}
                </div>
                <div className="p-6">
                    <p className="text-base text-center">
                        {children}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

interface DetailsProps extends PropsWithChildren {
    className?: string;
    style?: CSSProperties;
    isMobile: boolean;
}

interface NutritionInfo extends PropsWithChildren {
    header: string;
    className?: string;
    x?: number;
    start: number;
    end: number;
}