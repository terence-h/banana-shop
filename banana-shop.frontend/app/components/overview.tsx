import { Canvas } from "@react-three/fiber";
import Section from "./section";
import { OrbitControls, Html } from "@react-three/drei";
import { PropsWithChildren, Suspense, useState } from 'react';
import { easeInOut, motion } from 'framer-motion';
import BananaModel from "../models/banana-model";

export default function Overview({ className, isMobile }: OverviewProps) {
    const [animationId, setAnimationId] = useState(0);

    return (
        <Section sectionId="overview" className={className}>
            <Canvas
                className="bg-white dark:bg-gray-950"
                camera={{ near: 0.1, far: 1000, zoom: isMobile ? 1 : 2 }}>
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={true}
                    autoRotateSpeed={1}
                />
                <Suspense fallback={<Html>Loading...</Html>}>
                    {animationId >= 3 &&
                        <group>
                            <ambientLight intensity={2} />
                            <spotLight position={[0, 10, 0]} intensity={50} angle={180} />
                            <BananaModel scale={isMobile ? [0.85, 0.85, 0.85] : [1.75, 1.75, 1.75]} />
                        </group>
                    }
                </Suspense>
            </Canvas>
            <motion.div
                className="absolute top-[10vh] md:top-[20vh] left-1/2 transform -translate-x-1/2 text-6xl opacity-0 text-center mix-blend-difference"
                animate={{ opacity: 1, transition: { duration: 0.5, ease: easeInOut } }}
                onAnimationComplete={() => setAnimationId(1)}
            >
                <span className="text-white">The Best </span>
            </motion.div>
            {animationId >= 1 &&
                <motion.div
                    className="absolute top-[23vh] md:top-[27vh] left-1/2 transform -translate-x-1/2 text-6xl opacity-0 text-center dark:mix-blend-difference"
                    animate={{ opacity: 1, transition: { duration: 0.5, ease: easeInOut } }}
                    onAnimationComplete={() => setAnimationId(2)}
                >
                    <motion.span className="text-yellow-400">Banana</motion.span>
                </motion.div>
            }
            {animationId >= 2 &&
                <motion.div className="absolute top-[70vh] md:top-[80vh] left-1/2 transform -translate-x-1/2 text-6xl opacity-0 text-white text-center mix-blend-difference"
                    animate={{ opacity: 1, transition: { duration: 0.5, ease: easeInOut } }}
                    onAnimationComplete={() => setAnimationId(3)}
                >
                    In The World
                </motion.div>
            }
        </Section>
    );
}

interface OverviewProps extends PropsWithChildren {
    className?: string;
    isMobile: boolean;
}