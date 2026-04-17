import React from 'react'
import { motion } from 'framer-motion'
import { Button } from './button'
import { AnimatedGroup } from './animated-group'
import { cn } from "../../lib/utils"
import { Link } from 'react-router-dom'
import { InfiniteSlider } from './infinite-slider'
import { ProgressiveBlur } from './progressive-blur'
import { 
    Pizza, 
    ShoppingCart, 
    Pill, 
    Flower2, 
    Dog, 
    Smartphone, 
    Shirt, 
    Coffee,
    Zap,
    Truck,
    Navigation,
    User,
    Clock,
    ShieldCheck,
    CheckCircle
} from 'lucide-react'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
            <main className="overflow-hidden pt-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
                <section>
                    <div className="relative mx-auto max-w-7xl px-6 pt-16 lg:pb-32 lg:pt-24">
                        <div className="flex flex-col items-center text-center">
                            {/* Top Content */}
                            <div className="relative z-10 max-w-4xl mx-auto">
                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                >
                                    <h1 className="text-balance text-5xl font-black md:text-8xl text-zinc-900 dark:text-white tracking-tighter leading-[0.9] italic uppercase mb-8">
                                        The <span className="text-orange-500">Fastest</span> <br/>Way to Buy.
                                    </h1>

                                    <p className="mt-6 mx-auto max-w-xl text-pretty text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        Get anything delivered in minutes. From your favorite food to everyday essentials, 
                                        our local riders bring it all to your doorstep.
                                    </p>

                                    <div className="mt-12 flex justify-center">
                                        <Link to="/download">
                                            <Button
                                                size="lg"
                                                className="rounded-[24px] px-10 py-7 bg-orange-500 hover:bg-orange-600 text-white shadow-2xl shadow-orange-500/20 transition-all active:scale-95 text-lg font-black italic uppercase">
                                                Download App
                                            </Button>
                                        </Link>
                                    </div>
                                </AnimatedGroup>
                            </div>

                            {/* Center Phone Mock */}
                            <div className="relative mt-24">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    className="relative z-10"
                                >
                                    {/* Radial Glow */}
                                    <div className="absolute inset-x-0 top-1/2 -ms-40 -translate-y-1/2 h-[500px] w-[600px] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none" />
                                    {/* Smartphone Frame */}
                                    <div className="relative w-[320px] h-[650px] bg-zinc-950 rounded-[4rem] p-3 shadow-[0_0_0_2px_rgba(255,255,255,0.1),0_0_0_6px_rgba(0,0,0,0.8),0_40px_100px_-20px_rgba(0,0,0,0.3)] border-4 border-zinc-800/50">
                                        {/* Dynamic Island */}
                                        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30 flex items-center justify-center">
                                            <div className="size-2 rounded-full bg-blue-500/30 blur-sm" />
                                        </div>

                                        {/* Buttons */}
                                        <div className="absolute -left-1 top-24 w-1 h-12 bg-zinc-800 rounded-r-lg" />
                                        <div className="absolute -left-1 top-40 w-1 h-16 bg-zinc-800 rounded-r-lg" />
                                        <div className="absolute -right-1 top-32 w-1 h-20 bg-zinc-800 rounded-l-lg" />

                                        {/* Screen Content */}
                                        <div className="relative h-full w-full bg-zinc-50 dark:bg-zinc-950 rounded-[3.2rem] overflow-hidden flex flex-col">
                                            {/* App Top Bar */}
                                            <div className="pt-12 px-6 pb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <img src="/cheetah12post.png" alt="Logo" className="size-8 rounded-full object-contain bg-white shadow-sm" />
                                                    <span className="text-xs font-black dark:text-white uppercase tracking-wider">CheetahBuy</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <div className="size-1 bg-zinc-300 rounded-full" />
                                                    <div className="size-1 bg-zinc-300 rounded-full" />
                                                    <div className="size-1 bg-zinc-300 rounded-full" />
                                                </div>
                                            </div>

                                            {/* Map Background Concept */}
                                            <div className="flex-1 relative bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                                                {/* Grid Map Pattern */}
                                                <div className="absolute inset-0 opacity-20 dark:opacity-40" 
                                                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #f97316 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                                                
                                                {/* Delivery Path */}
                                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100">
                                                    <motion.path 
                                                        d="M20,80 Q50,50 80,20" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        strokeWidth="0.5" 
                                                        strokeDasharray="2,2"
                                                        className="text-orange-500"
                                                    />
                                                </svg>

                                                {/* Active Rider */}
                                                <motion.div 
                                                    animate={{ 
                                                        x: [20, 150, 120, 200, 150],
                                                        y: [400, 300, 250, 150, 100],
                                                        rotate: [0, 10, -5, 15, 0]
                                                    }}
                                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                    className="absolute"
                                                >
                                                    <div className="relative group">
                                                        <div className="absolute inset-0 bg-orange-500 blur-xl opacity-40 group-hover:opacity-80 transition-opacity" />
                                                        <div className="relative size-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-xl shadow-orange-500/40">
                                                            <Truck className="size-6" />
                                                        </div>
                                                        <div className="absolute -top-10 -right-2 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-xl shadow-xl border dark:border-zinc-700 whitespace-nowrap">
                                                            <span className="text-[10px] font-black italic text-orange-500 uppercase">Abeid (Rider)</span>
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* Delivery Notification Card */}
                                                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                                                    <motion.div 
                                                        initial={{ y: 50, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 1.5 }}
                                                        className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/20 dark:border-zinc-700"
                                                    >
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center"><CheckCircle className="size-5 text-emerald-500" /></div>
                                                            <div>
                                                                <h4 className="text-xs font-black dark:text-white uppercase italic">Order Confirmed</h4>
                                                                <p className="text-[10px] text-zinc-500">Pick-up in 2 mins</p>
                                                            </div>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-emerald-500" />
                                                        </div>
                                                    </motion.div>

                                                    <motion.div 
                                                        initial={{ y: 50, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 1.8 }}
                                                        className="bg-zinc-900 p-4 rounded-3xl shadow-2xl flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-10 rounded-full bg-orange-500 flex items-center justify-center text-white"><Clock className="size-5" /></div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black text-orange-500 uppercase">Estimated arrival</span>
                                                                <span className="text-lg font-black text-white italic tracking-tighter">14:24 PM</span>
                                                            </div>
                                                        </div>
                                                        <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white"><Navigation className="size-4" /></div>
                                                    </motion.div>
                                                </div>
                                            </div>

                                            {/* App Bottom Bar */}
                                            <div className="p-6 bg-white dark:bg-zinc-950 flex items-center justify-around">
                                                <div className="size-1.5 bg-orange-500 rounded-full" />
                                                <div className="size-1.5 bg-zinc-300 rounded-full" />
                                                <div className="size-1.5 bg-zinc-300 rounded-full" />
                                                <div className="size-1.5 bg-zinc-300 rounded-full" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Decorations around phone */}
                                    <div className="absolute -top-12 -right-12 size-24 bg-orange-500/20 blur-3xl" />
                                    <div className="absolute -bottom-12 -left-12 size-32 bg-blue-500/20 blur-3xl" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>
                <LogoCloud />
            </main>
        </>
    )
}

const LogoCloud = () => {
    const categories = [
        { name: 'Food', icon: Pizza, color: 'text-orange-500' },
        { name: 'Groceries', icon: ShoppingCart, color: 'text-green-500' },
        { name: 'Pharmacy', icon: Pill, color: 'text-red-500' },
        { name: 'Flowers', icon: Flower2, color: 'text-pink-500' },
        { name: 'Pets', icon: Dog, color: 'text-amber-500' },
        { name: 'Electronics', icon: Smartphone, color: 'text-blue-500' },
        { name: 'Fashion', icon: Shirt, color: 'text-purple-500' },
        { name: 'Coffee', icon: Coffee, color: 'text-yellow-600' },
    ];

    return (
        <section className="pb-16 md:pb-32 bg-white dark:bg-zinc-950">
            <div className="group relative m-auto max-w-7xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="inline md:max-w-44 md:border-r md:pr-6">
                        <p className="text-end text-sm font-medium text-zinc-500 uppercase tracking-widest">Explore Categories</p>
                    </div>
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            speedOnHover={2}
                            speed={6}
                            gap={112}>
                            {categories.map((cat, i) => {
                                const Icon = cat.icon;
                                return (
                                    <div 
                                        key={i} 
                                        className="flex items-center gap-4 px-8 py-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-2xl hover:shadow-orange-100 dark:hover:shadow-orange-900/20 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className={`p-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm`}>
                                            <Icon className={`size-6 ${cat.color}`} />
                                        </div>
                                        <span className="text-base font-bold whitespace-nowrap text-zinc-800 dark:text-zinc-200 uppercase italic tracking-tighter">{cat.name}</span>
                                    </div>
                                );
                            })}
                        </InfiniteSlider>

                        <div className="bg-linear-to-r from-white dark:from-zinc-950 absolute inset-y-0 left-0 w-20"></div>
                        <div className="bg-linear-to-l from-white dark:from-zinc-950 absolute inset-y-0 right-0 w-20"></div>
                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}