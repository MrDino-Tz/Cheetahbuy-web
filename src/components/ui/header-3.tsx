'use client';
import React from 'react';
import { Button } from './button';
import { cn } from "../../lib/utils";
import { MenuToggleIcon } from './menu-toggle-icon';
import { createPortal } from 'react-dom';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from './navigation-menu';
import { LucideIcon } from 'lucide-react';
import {
	ShoppingBag,
	Users,
	BarChart,
	Settings,
	Package,
	Star,
	Shield,
	FileText,
	HelpCircle,
	Leaf,
	Handshake,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type LinkItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	description?: string;
};

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);
	const navigate = useNavigate();

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		navigate('/login');
	};

	return (
		<header
			className={cn('sticky top-0 z-50 w-full border-b border-transparent', {
				'bg-white/95 supports-[backdrop-filter]:bg-white/50 border-zinc-200 backdrop-blur-lg dark:bg-zinc-950/95 dark:border-zinc-800':
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<div className="flex items-center gap-5">
					<Link to="/" className="flex items-center gap-2">
						<img src="/cheetah12post.png" alt="CheetahBuy" className="w-8 h-8 object-contain" />
						<span className="text-xl font-bold text-zinc-900 dark:text-white">CheetahBuy</span>
					</Link>
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent">Services</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-white p-1 pr-1.5 dark:bg-zinc-900">
									<ul className="bg-popover grid w-lg grid-cols-2 gap-2 rounded-md border p-2 shadow dark:border-zinc-800">
										{productLinks.map((item, i) => (
											<li key={i}>
												<ListItem {...item} />
											</li>
										))}
									</ul>
									<div className="p-2">
										<p className="text-muted-foreground text-sm">
											Want to become a vendor?{' '}
											<Link to="/register" className="text-foreground font-medium hover:underline">
												Join now
											</Link>
										</p>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent">Company</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-white p-1 pr-1.5 pb-1.5 dark:bg-zinc-900">
									<div className="grid w-lg grid-cols-2 gap-2">
										<ul className="bg-popover space-y-2 rounded-md border p-2 shadow dark:border-zinc-800">
											{companyLinks.map((item, i) => (
												<li key={i}>
													<ListItem {...item} />
												</li>
											))}
										</ul>
										<ul className="space-y-2 p-3">
											{companyLinks2.map((item, i) => (
												<li key={i}>
													<NavigationMenuLink
														href={item.href}
														className="flex p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex-row rounded-md items-center gap-x-2"
													>
														<item.icon className="text-foreground size-4" />
														<span className="font-medium">{item.title}</span>
													</NavigationMenuLink>
												</li>
											))}
										</ul>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuLink className="px-4" asChild>
								<Link to="/" className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md p-2">
									Pricing
								</Link>
							</NavigationMenuLink>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<Button variant="outline" onClick={() => navigate('/login')}>Sign In</Button>
					<Button onClick={() => navigate('/register')}>Get Started</Button>
				</div>
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>
			<MobileMenu open={open} className="flex flex-col justify-between gap-2 overflow-y-auto">
				<NavigationMenu className="max-w-full">
					<div className="flex w-full flex-col gap-y-2">
						<span className="text-sm font-medium">Services</span>
						{productLinks.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
						<span className="text-sm font-medium">Company</span>
						{companyLinks.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
						{companyLinks2.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
					</div>
				</NavigationMenu>
				<div className="flex flex-col gap-2">
					<Button variant="outline" className="w-full bg-transparent" onClick={() => navigate('/login')}>
						Sign In
					</Button>
					<Button className="w-full" onClick={() => navigate('/register')}>Get Started</Button>
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === 'undefined') return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				'bg-white/95 supports-[backdrop-filter]:bg-white/50 backdrop-blur-lg dark:bg-zinc-950/95',
				'fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden dark:border-zinc-800',
			)}
		>
			<div
				data-slot={open ? 'open' : 'closed'}
				className={cn(
					'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
					'size-full p-4',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}

function ListItem({
	title,
	description,
	icon: Icon,
	className,
	href,
	...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
	return (
		<NavigationMenuLink className={cn('w-full flex flex-row gap-x-2 data-[active=true]:focus:bg-zinc-100 data-[active=true]:hover:bg-zinc-100 data-[active=true]:bg-zinc-50 data-[active=true]:text-accent-foreground hover:bg-zinc-100 hover:text-accent-foreground focus:bg-zinc-100 focus:text-accent-foreground rounded-sm p-2 dark:hover:bg-zinc-800 dark:data-[active=true]:bg-zinc-800', className)} {...props} asChild>
			<a href={href}>
				<div className="bg-zinc-50 dark:bg-zinc-800 flex aspect-square size-12 items-center justify-center rounded-md border shadow-sm dark:border-zinc-700">
					<Icon className="text-foreground size-5" />
				</div>
				<div className="flex flex-col items-start justify-center">
					<span className="font-medium">{title}</span>
					<span className="text-muted-foreground text-xs">{description}</span>
				</div>
			</a>
		</NavigationMenuLink>
	);
}

const productLinks: LinkItem[] = [
	{
		title: 'Food Delivery',
		href: '#',
		description: 'Order from local restaurants',
		icon: ShoppingBag,
	},
	{
		title: 'Grocery Delivery',
		href: '#',
		description: 'Fresh groceries delivered fast',
		icon: Package,
	},
	{
		title: 'Become a Vendor',
		href: '#',
		description: 'Grow your business with us',
		icon: Users,
	},
	{
		title: 'Track Orders',
		href: '#',
		description: 'Real-time delivery tracking',
		icon: BarChart,
	},
	{
		title: 'Partner with Us',
		href: '#',
		description: 'Business collaboration',
		icon: Handshake,
	},
	{
		title: 'Express Delivery',
		href: '#',
		description: 'Ultra-fast delivery option',
		icon: Star,
	},
];

const companyLinks: LinkItem[] = [
	{
		title: 'About Us',
		href: '#',
		description: 'Learn more about our story',
		icon: Users,
	},
	{
		title: 'Success Stories',
		href: '#',
		description: 'See how we’ve helped clients',
		icon: Star,
	},
	{
		title: 'Careers',
		href: '#',
		icon: Leaf,
		description: 'Join our growing team',
	},
];

const companyLinks2: LinkItem[] = [
	{
		title: 'Terms of Service',
		href: '#',
		icon: FileText,
	},
	{
		title: 'Privacy Policy',
		href: '#',
		icon: Shield,
	},
	{
		title: 'Help Center',
		href: '#',
		icon: HelpCircle,
	},
];


function useScroll(threshold: number) {
	const [scrolled, setScrolled] = React.useState(false);

	const onScroll = React.useCallback(() => {
		setScrolled(window.scrollY > threshold);
	}, [threshold]);

	React.useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	React.useEffect(() => {
		onScroll();
	}, [onScroll]);

	return scrolled;
}