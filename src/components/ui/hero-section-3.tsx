'use client'
import React from 'react'
import { Button } from './button'
import { AnimatedGroup } from './animated-group'
import { cn } from "../../lib/utils"
import { Link } from 'react-router-dom'
import { InfiniteSlider } from './infinite-slider'
import { ProgressiveBlur } from './progressive-blur'

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
            <main className="overflow-hidden pt-16">
                <section>
                    <div className="relative mx-auto max-w-6xl px-6 pt-16 lg:pb-16 lg:pt-24">
                        <div className="relative z-10 mx-auto max-w-4xl text-center">
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
                                <h1
                                    className="text-balance text-4xl font-medium sm:text-5xl md:text-6xl">
                                    Fast Delivery for Everything
                                </h1>

                                <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg">
                                    Get anything delivered in minutes. From your favorite food to everyday essentials, 
                                    our local riders bring it all to your doorstep.
                                </p>

                                <div className="mt-12 mx-auto max-w-sm flex gap-4 justify-center">
                                    <Link to="/download">
                                        <Button
                                            size="lg"
                                            className="rounded-[0.5rem]">
                                            <span>Download App</span>
                                        </Button>
                                    </Link>
                                    <Link to="/vendor/login">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="rounded-[0.5rem]">
                                            <span>Vendor Login</span>
                                        </Button>
                                    </Link>
                                </div>

                                <div
                                    aria-hidden
                                    className="bg-radial from-orange-500/50 to-transparent relative mx-auto mt-32 max-w-2xl to-55% text-left"
                                >
                                    <div className="border-zinc-200 dark:border-zinc-800 absolute inset-0 mx-auto w-80 -translate-x-3 -translate-y-12 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:-translate-x-6">
                                        <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--border),var(--border)_1px,transparent_1px,transparent_6px)] before:opacity-50"></div>
                                    </div>
                                    <div className="bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 mx-auto w-80 translate-x-4 rounded-[2rem] border p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:translate-x-8">
                                        <div className="bg-white dark:bg-zinc-900 space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-xl dark:shadow-black dark:backdrop-blur-3xl">
                                            <DeliveryStats />

                                            <div className="bg-zinc-100 dark:bg-white/5 rounded-[1rem] p-4 pb-16"></div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5" />
                                </div>
                            </AnimatedGroup>
                        </div>
                    </div>
                </section>
                <LogoCloud />
            </main>
        </>
    )
}

const DeliveryStats = () => {
    return (
        <div className="relative space-y-3 rounded-[1rem] bg-white/5 p-4">
            <div className="flex items-center gap-1.5 text-orange-400">
                <svg
                    className="size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32">
                    <g fill="none">
                        <path
                            fill="#ff6723"
                            d="M26 19.34c0 6.1-5.05 11.005-11.15 10.641c-6.269-.374-10.56-6.403-9.752-12.705c.489-3.833 2.286-7.12 4.242-9.67c.34-.445.689 3.136 1.038 2.742c.35-.405 3.594-6.019 4.722-7.991a.694.694 0 0 1 1.028-.213C18.394 3.854 26 10.277 26 19.34"></path>
                        <path
                            fill="#ffb02e"
                            d="M23 21.851c0 4.042-3.519 7.291-7.799 7.144c-4.62-.156-7.788-4.384-7.11-8.739C9.07 14.012 15.48 10 15.48 10S23 14.707 23 21.851"></path>
                    </g>
                </svg>
                <div className="text-sm font-medium">CheetahBuy</div>
            </div>
            <div className="space-y-3">
                <div className="text-zinc-900 dark:text-white border-b border-white/10 pb-3 text-sm font-medium">Over 10,000 deliveries completed this month!</div>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <div className="space-x-1">
                            <span className="text-zinc-900 dark:text-white align-baseline text-xl font-medium">15 min</span>
                            <span className="text-zinc-500 text-xs">avg. delivery</span>
                        </div>
                        <div className="flex h-5 items-center rounded bg-gradient-to-l from-emerald-400 to-indigo-600 px-2 text-xs text-white">This Month</div>
                    </div>
                    <div className="space-y-1">
                        <div className="space-x-1">
                            <span className="text-zinc-900 dark:text-white align-baseline text-xl font-medium">500+</span>
                            <span className="text-zinc-500 text-xs">active riders</span>
                        </div>
                        <div className="text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/20 flex h-5 w-2/3 items-center rounded px-2 text-xs">Last Month</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const menuItems = [
    { name: 'Become a Vendor', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Contact', href: '#' },
]

const LogoCloud = () => {
    const categories = [
        { name: 'Fast Food', icon: '🍔' },
        { name: 'Groceries', icon: '🛒' },
        { name: 'Pharmacy', icon: '💊' },
        { name: 'Flowers', icon: '🌸' },
        { name: 'Pet Supplies', icon: '🐾' },
        { name: 'Electronics', icon: '📱' },
        { name: 'Clothing', icon: '👕' },
        { name: 'Coffee', icon: '☕' },
    ];

    return (
        <section className="pb-16 md:pb-32 bg-white dark:bg-zinc-950">
            <div className="group relative m-auto max-w-6xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="inline md:max-w-44 md:border-r md:pr-6">
                        <p className="text-end text-sm">Delivery Categories</p>
                    </div>
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={112}>
                            {categories.map((cat, i) => (
                                <div key={i} className="flex items-center gap-2 px-6 py-3">
                                    <span className="text-2xl">{cat.icon}</span>
                                    <span className="text-sm font-medium whitespace-nowrap">{cat.name}</span>
                                </div>
                            ))}
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

const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
                <span className="text-white text-lg font-bold">🦁</span>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">CheetahBuy</span>
        </div>
    )
}