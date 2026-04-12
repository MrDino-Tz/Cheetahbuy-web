import { Link } from 'react-router-dom'
import {
    Globe,
    Share2,
    MessageCircle,
    Link as LinkIcon,
    Send,
    Feather,
} from 'lucide-react'

const links = [
    {
        group: 'Services',
        items: [
            { title: 'Food Delivery', href: '#' },
            { title: 'Grocery Delivery', href: '#' },
            { title: 'Express Delivery', href: '#' },
            { title: 'Pickup', href: '#' },
        ],
    },
    {
        group: 'Company',
        items: [
            { title: 'About Us', href: '#' },
            { title: 'Careers', href: '#' },
            { title: 'Blog', href: '#' },
            { title: 'Press', href: '#' },
        ],
    },
    {
        group: 'Support',
        items: [
            { title: 'Help Center', href: '#' },
            { title: 'Contact Us', href: '#' },
            { title: 'FAQs', href: '#' },
        ],
    },
    {
        group: 'Legal',
        items: [
            { title: 'Privacy Policy', href: '#' },
            { title: 'Terms of Service', href: '#' },
            { title: 'Cookie Policy', href: '#' },
        ],
    },
]

export default function FooterSection() {
    return (
        <footer className="border-t bg-white pt-12 md:pt-20 dark:bg-zinc-950 dark:border-zinc-800">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-12 md:grid-cols-5">
                    <div className="md:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center gap-2 size-fit">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
                                <span className="text-white text-lg font-bold">🦁</span>
                            </div>
                            <span className="text-xl font-bold text-zinc-900 dark:text-white">CheetahBuy</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Fast delivery for everything. Get anything delivered in minutes from our local riders.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-3">
                        {links.map((linkGroup, groupIndex) => (
                            <div key={groupIndex} className="space-y-4 text-sm">
                                <span className="block font-medium text-zinc-900 dark:text-white">{linkGroup.group}</span>
                                {linkGroup.items.map((item, itemIndex) => (
                                    <Link
                                        key={itemIndex}
                                        to={item.href}
                                        className="text-muted-foreground hover:text-orange-500 block duration-150"
                                    >
                                        <span>{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6 dark:border-zinc-800">
                    <span className="text-muted-foreground order-last block text-center text-sm md:order-first">© {new Date().getFullYear()} CheetahBuy, All rights reserved</span>
                    <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
                        <Link to="#" className="text-muted-foreground hover:text-orange-500 block">
                            <Share2 className="size-6" />
                        </Link>
                        <Link to="#" className="text-muted-foreground hover:text-orange-500 block">
                            <MessageCircle className="size-6" />
                        </Link>
                        <Link to="#" className="text-muted-foreground hover:text-orange-500 block">
                            <LinkIcon className="size-6" />
                        </Link>
                        <Link to="#" className="text-muted-foreground hover:text-orange-500 block">
                            <Globe className="size-6" />
                        </Link>
                        <Link to="#" className="text-muted-foreground hover:text-orange-500 block">
                            <Send className="size-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}