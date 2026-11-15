/**
 * English dictionary. This file defines the Dictionary type: every other
 * locale must satisfy `typeof en`, so a missing or mistyped key is a
 * compile-time error. See src/lib/i18n/index.ts for how to add a locale.
 */
export const en = {
	localeName: 'English',
	meta: {
		ogLocale: 'en_US',
		intlLocale: 'en-US',
		homeTitle: 'TechDova — Your tech universe',
		homeDescription:
			'Discover the latest smartphones, computers and accessories with exceptional quality and unbeatable prices.',
		shopTitle: 'Shop | TechDova',
		shopDescription:
			'Browse all our tech products: smartphones, computers, audio, smartwatches, gaming and accessories.',
		aboutTitle: 'About | TechDova',
		aboutDescription:
			'Discover TechDova, your tech universe: original products, fast delivery and customer service that listens.',
		contactTitle: 'Contact | TechDova',
		contactDescription:
			'Contact the TechDova team with any question about our products, your orders or delivery.',
		cartTitle: 'Cart | TechDova',
		cartDescription:
			'Review your TechDova cart, change quantities and check out (demo).',
		termsTitle: 'Terms and conditions | TechDova',
		termsDescription: 'Demo terms and conditions for the TechDova storefront.',
		privacyTitle: 'Privacy policy | TechDova',
		privacyDescription: 'Demo privacy policy for the TechDova storefront.',
		notFoundTitle: 'Page not found | TechDova',
		notFoundDescription: 'The requested page could not be found.'
	},
	nav: {
		home: 'Home',
		shop: 'Shop',
		categories: 'Categories',
		about: 'About',
		contact: 'Contact',
		main: 'Main navigation',
		cart: 'Cart',
		account: 'Account',
		accountDemo: 'Demo store: accounts are disabled.',
		searchPlaceholder: 'Search for a product…',
		searchLabel: 'Search for a product',
		menu: 'Open menu',
		close: 'Close',
		language: 'Language',
		skipToContent: 'Skip to main content',
		switchTo: 'Switch to {language}'
	},
	live: {
		addedToCart: 'Added {name} to your cart.',
		removedFromCart: 'Removed {name} from your cart.'
	},
	hero: {
		slides: [
			{
				badge: 'New',
				titleA: 'Technology',
				titleB: 'within reach',
				subtitle:
					'Discover the latest smartphones, computers and accessories with exceptional quality and unbeatable prices.',
				cta: 'Discover the collection',
				imageAlt: 'Smartphone, laptop, smartwatch and earbuds arranged on a white podium'
			},
			{
				badge: 'Premium audio',
				titleA: 'Sound',
				titleB: 'that surrounds you',
				subtitle:
					'Noise-cancelling headphones and earbuds for total immersion, at home or on the go.',
				cta: 'Explore audio',
				imageAlt: 'Black over-ear headphones and white wireless earbuds on a green gradient background'
			},
			{
				badge: 'Gaming',
				titleA: 'Play',
				titleB: 'without limits',
				subtitle: 'Controllers, consoles and gaming accessories to take you to the next level.',
				cta: 'Shop gaming',
				imageAlt: 'Black game controller and gaming headset on a white podium with green light'
			}
		],
		previous: 'Previous slide',
		next: 'Next slide',
		goToSlide: 'Go to slide {n}',
		carouselLabel: 'Featured products',
		slideLabel: 'Slide {n} of {total}',
		trust: [
			{ title: 'Fast delivery', subtitle: 'Within 24/48h' },
			{ title: 'Secure payment', subtitle: '100% reliable' },
			{ title: 'Customer service', subtitle: 'Here for you 7 days a week' }
		]
	},
	categoriesSection: {
		eyebrow: 'Our categories',
		heading: 'Browse by category',
		viewAll: 'View all categories'
	},
	bestSellers: {
		eyebrow: 'Featured products',
		heading: 'Best sellers',
		previous: 'Previous products',
		next: 'Next products',
		viewAll: 'View all products'
	},
	productCard: {
		addToCart: 'Add to cart',
		addedToCart: 'Added to cart',
		addToWishlist: 'Add to wishlist',
		removeFromWishlist: 'Remove from wishlist',
		outOfStock: 'Out of stock',
		reviewsLabel: '{count} reviews',
		ratingLabel: 'Rated {rating} out of 5'
	},
	promo: {
		eyebrow: 'Special offer',
		titleA: 'Up to -20%',
		titleB: 'on a selection of products',
		subtitle: 'Equip yourself with the best brands and enjoy our limited offers!',
		cta: 'View the offer',
		imageAlt: 'Laptop, tablet and headphones with a small plant on a pale green background'
	},
	trust: {
		items: [
			{ title: 'Original products', subtitle: 'Manufacturer warranty' },
			{ title: 'Fast delivery', subtitle: 'Within 24/48h' },
			{ title: 'Secure payment', subtitle: '100% reliable' },
			{ title: 'Customer support', subtitle: 'Always here to help' }
		]
	},
	footer: {
		tagline: 'Your tech universe',
		usefulLinks: 'Useful links',
		followUs: 'Follow us',
		newsletterTitle: 'Newsletter',
		newsletterText: 'Receive our latest news and special offers',
		emailLabel: 'Email address',
		emailPlaceholder: 'Your email address',
		subscribe: 'Subscribe',
		subscribeSuccess: 'Thank you! You are subscribed to our newsletter (demo).',
		subscribeError: 'Please enter a valid email address.',
		rights: 'All rights reserved.',
		terms: 'Terms and conditions',
		privacy: 'Privacy policy'
	},
	shop: {
		title: 'Shop',
		description:
			'Browse all our tech products. Filter by category, search and sort to find your next device.',
		searchLabel: 'Search products',
		searchPlaceholder: 'Search products…',
		allCategories: 'All categories',
		sortLabel: 'Sort by',
		sortFeatured: 'Featured',
		sortPriceAsc: 'Price: low to high',
		sortPriceDesc: 'Price: high to low',
		sortRating: 'Top rated',
		priceLabel: 'Maximum price',
		priceAny: 'Any price',
		maxPriceLabel: 'Up to {price}',
		results: '{count} products',
		resultOne: '1 product',
		noResults: 'No products found',
		noResultsHint: 'Try a different search or clear the filters.',
		clearFilters: 'Clear filters',
		filtersLabel: 'Filters'
	},
	product: {
		inStock: 'In stock',
		lowStock: 'Only {count} left',
		outOfStock: 'Out of stock',
		quantity: 'Quantity',
		addToCart: 'Add to cart',
		addedToCart: 'Added to cart',
		description: 'Description',
		specifications: 'Specifications',
		relatedTitle: 'You may also like',
		backToShop: 'Back to shop',
		reviewsLabel: '{count} reviews',
		ratingLabel: 'Rated {rating} out of 5',
		freeDelivery: 'Free fast delivery (24/48h)',
		warranty: '2-year manufacturer warranty',
		returns: '30-day returns',
		galleryLabel: 'Product images',
		saveLabel: 'Save {amount}',
		breadcrumbHome: 'Home',
		breadcrumbShop: 'Shop',
		breadcrumbLabel: 'Breadcrumb'
	},
	cart: {
		title: 'Your cart',
		empty: 'Your cart is empty',
		emptyHint: 'Discover our best sellers and add your favourites.',
		continueShopping: 'Continue shopping',
		subtotal: 'Subtotal',
		savings: 'You save',
		shipping: 'Delivery',
		shippingFree: 'Free',
		total: 'Total',
		checkout: 'Checkout (demo)',
		remove: 'Remove {name}',
		quantityLabel: 'Quantity for {name}',
		clearCart: 'Clear cart',
		itemsLabel: '{count} items',
		itemOne: '1 item',
		checkoutSuccessTitle: 'Order placed — thank you!',
		checkoutSuccessText: 'Order {orderId} is confirmed. Total: {total}.',
		checkoutDemoNote: 'Demo checkout: no payment was taken and nothing was sent anywhere.',
		checkoutAgain: 'Place another order',
		orderLabel: 'Order',
		viewCart: 'View cart'
	},
	cartDrawer: {
		title: 'Your cart',
		viewCart: 'View cart',
		checkout: 'Checkout (demo)',
		empty: 'Your cart is empty.',
		subtotal: 'Subtotal'
	},
	contact: {
		title: 'Contact us',
		description:
			'Questions about a product, an order or delivery? Send us a message — this demo form is validated locally and nothing is sent anywhere.',
		nameLabel: 'Full name',
		namePlaceholder: 'Your name',
		emailLabel: 'Email address',
		emailPlaceholder: 'you@example.com',
		subjectLabel: 'Subject',
		subjectGeneral: 'General question',
		subjectOrder: 'Order question',
		subjectProduct: 'Product question',
		subjectOther: 'Other',
		messageLabel: 'Message',
		messagePlaceholder: 'How can we help?',
		send: 'Send message',
		successTitle: 'Message sent — thank you!',
		successText:
			'Thanks {name}, we received your message. This is a demo: nothing was sent anywhere.',
		sendAnother: 'Send another message',
		requiredError: 'This field is required.',
		emailError: 'Please enter a valid email address.',
		messageError: 'Please write at least 10 characters.',
		errorSummary: 'Please correct the following errors:',
		infoTitle: 'Other ways to reach us',
		emailTitle: 'Email',
		phoneTitle: 'Phone',
		hoursTitle: 'Opening hours',
		hoursValue: 'Monday – Saturday, 9:00 – 18:00'
	},
	about: {
		title: 'About TechDova',
		description:
			'TechDova is your tech universe: original products, honest prices and fast delivery — built as a fully local demo storefront.',
		storyEyebrow: 'Our story',
		storyTitle: 'Technology within reach, since day one',
		storyText1:
			'TechDova started with a simple idea: the latest technology should be easy to discover, easy to compare and easy to trust. Every product in our catalogue is original, covered by a manufacturer warranty and delivered fast.',
		storyText2:
			'This storefront is a demo built with modern web best practices — fast static pages, two languages and an accessible shopping experience that works entirely in your browser, with no backend and no tracking.',
		valuesEyebrow: 'What we stand for',
		valuesTitle: 'Why shop with TechDova',
		values: [
			{
				title: 'Original products',
				text: 'Every item is genuine and covered by its manufacturer warranty.'
			},
			{
				title: 'Honest prices',
				text: 'Clear prices, real discounts and no hidden fees — ever.'
			},
			{
				title: 'Fast delivery',
				text: 'Orders ship within 24/48h, carefully packed and tracked.'
			},
			{
				title: 'Human support',
				text: 'Real people, 7 days a week, before and after your purchase.'
			}
		],
		stats: [
			{ value: '12', label: 'Products in the catalogue' },
			{ value: '6', label: 'Categories to explore' },
			{ value: '4.8/5', label: 'Average customer rating' },
			{ value: '24–48h', label: 'Average delivery time' }
		],
		ctaTitle: 'Ready to explore?',
		ctaText: 'Browse the full catalogue and find your next device today.',
		ctaButton: 'Browse the shop'
	},
	terms: {
		title: 'Terms and conditions',
		description: 'Demo terms and conditions for the TechDova storefront.',
		updated: 'Last updated: 15 November 2026',
		sections: [
			{
				heading: '1. Demo store',
				body: 'TechDova is a demonstration storefront. No real orders are placed, no payments are taken and no personal data is sent to any server. All products, prices and reviews shown are fictional demo content.'
			},
			{
				heading: '2. Prices and availability',
				body: 'Prices are shown in Algerian dinars (DA) and include all demo taxes. Stock levels shown are illustrative and may not reflect real availability.'
			},
			{
				heading: '3. Orders',
				body: 'The checkout flow is a local demo: it confirms an order on your device only and clears your cart. No confirmation email is sent and no goods will be delivered.'
			},
			{
				heading: '4. Content',
				body: 'Product names and images are used for demonstration purposes. All artwork on this site was generated for this demo.'
			}
		]
	},
	privacy: {
		title: 'Privacy policy',
		description: 'Demo privacy policy for the TechDova storefront.',
		updated: 'Last updated: 15 November 2026',
		sections: [
			{
				heading: '1. No tracking',
				body: 'TechDova does not use analytics, advertising trackers or third-party cookies. The site works fully offline once loaded and makes no requests to external servers.'
			},
			{
				heading: '2. Local storage',
				body: 'Your cart, wishlist, language choice and newsletter preference are stored only in your browser (localStorage). You can clear them at any time from your browser settings.'
			},
			{
				heading: '3. Forms',
				body: 'Contact and newsletter forms are validated locally in your browser. Their contents are never transmitted anywhere.'
			},
			{
				heading: '4. Contact',
				body: 'For any privacy question about this demo, use the contact page. Remember: nothing you type leaves your device.'
			}
		]
	},
	notFound: {
		eyebrow: 'Error 404',
		title: 'Page not found',
		description: 'Sorry, the page you are looking for does not exist or has moved.',
		backHome: 'Back to home'
	}
};
