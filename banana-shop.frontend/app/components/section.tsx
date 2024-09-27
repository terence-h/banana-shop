import { motion, useScroll, useTransform } from "framer-motion";
import { CSSProperties, PropsWithChildren, useRef } from "react";
import { ModifyClassName } from "~/utils/Helper";

export default function Section({ children, sectionId, className, style }: SectionProps) {
    let sectionClassName = "";
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    })

    const opacity = useTransform(
        scrollYProgress,
        [0.05, 0.2, 0.8, 0.95],
        [0, 1, 1, 0],
    )

    if (className)
        sectionClassName = ModifyClassName(sectionClassName, className, false);

    // style={{ opacity }}
    return (
        <motion.section id={sectionId} ref={sectionRef} style={{ opacity }}>
            <div className={sectionClassName} style={style}>
                {children}
            </div>
        </motion.section>
    );
}

interface SectionProps extends PropsWithChildren {
    sectionId: string;
    className?: string;
    style?: CSSProperties
    overrideClass?: boolean
}