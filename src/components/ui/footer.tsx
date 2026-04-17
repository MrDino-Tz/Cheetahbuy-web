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
            { title: 'Food Delivery', href: '/food-delivery' },
            { title: 'Grocery Delivery', href: '/grocery-delivery' },
            { title: 'Express Delivery', href: '/express-delivery' },
            { title: 'Pickup', href: '/pickup' },
        ],
    },
    {
        group: 'Company',
        items: [
            { title: 'About Us', href: '/about' },
            { title: 'Careers', href: '#' },
            { title: 'Blog', href: '#' },
            { title: 'Press', href: '#' },
        ],
    },
    {
        group: 'Support',
        items: [
            { title: 'Help Center', href: '/help' },
            { title: 'Contact Us', href: '/contact' },
            { title: 'FAQs', href: '/faq' },
        ],
    },
    {
        group: 'Legal',
        items: [
            { title: 'Privacy Policy', href: '/privacy' },
            { title: 'Terms of Service', href: '/terms' },
            { title: 'Cookie Policy', href: '#' },
        ],
    },
]

export default function FooterSection() {
    return (
        <footer className="relative border-t bg-white dark:bg-zinc-950 dark:border-zinc-900 transition-colors duration-300">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500 rounded-full blur-[100px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-pink-600 rounded-full blur-[100px]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-12">
                <div className="grid gap-12 lg:grid-cols-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="flex items-center size-fit group">
                            <img 
                                src="/cheetah_logo.webp" 
                                alt="CheetahBuy" 
                                className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                        </Link>
                        <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                            Revolutionizing local commerce with lightning-fast delivery and premium service. Get anything you need, delivered in minutes.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: Share2, href: "#" },
                                { icon: MessageCircle, href: "#" },
                                { icon: Send, href: "#" },
                                { icon: Globe, href: "#" }
                            ].map((social, i) => (
                                <Link 
                                    key={i} 
                                    to={social.href} 
                                    className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-all duration-300"
                                >
                                    <social.icon className="size-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {links.slice(0, 3).map((linkGroup, groupIndex) => (
                            <div key={groupIndex} className="space-y-5">
                                <span className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{linkGroup.group}</span>
                                <ul className="space-y-3">
                                    {linkGroup.items.map((item, itemIndex) => (
                                        <li key={itemIndex}>
                                            <Link
                                                to={item.href}
                                                className="text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-500 text-[15px] transition-colors duration-200"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter Section */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                            <span className="block text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">Newsletter</span>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Subscribe to get exclusive offers and news.</p>
                            <form className="relative group">
                                <input 
                                    type="email" 
                                    placeholder="your@email.com" 
                                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                />
                                <button className="absolute right-1.5 top-1.5 p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-colors">
                                    <Send className="size-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        © {new Date().getFullYear()} CheetahBuy Platform. Built with ❤️ By DTC.
                    </p>
                    <div className="flex items-center gap-8 text-sm">
                        <Link to="/privacy" className="text-zinc-500 hover:text-orange-500 transition-colors">Privacy</Link>
                        <Link to="/terms" className="text-zinc-500 hover:text-orange-500 transition-colors">Terms</Link>
                        <Link to="#" className="text-zinc-500 hover:text-orange-500 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}