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
		categoryTitle: '{category} | TechDova',
		categoryDescription:
			'{category} at TechDova: original products, honest prices and fast delivery.',
		searchTitle: 'Search | TechDova',
		searchDescription:
			'Search the TechDova catalogue: smartphones, computers, audio, smartwatches, gaming and accessories.',
		wishlistTitle: 'Wishlist | TechDova',
		wishlistDescription: 'Your saved TechDova products, all in one place.',
		compareTitle: 'Compare products | TechDova',
		compareDescription:
			'Compare TechDova products side by side: prices, ratings, availability and specifications.',
		dealsTitle: 'Deals | TechDova',
		dealsDescription:
			'Save on a selection of TechDova products — limited-time offers on smartphones, computers, audio and more.',
		aboutTitle: 'About | TechDova',
		aboutDescription:
			'Discover TechDova, your tech universe: original products, fast delivery and customer service that listens.',
		testimonialsTitle: 'Testimonials | TechDova',
		testimonialsDescription:
			'Read what TechDova customers say about our products, delivery and support — fictional demo testimonials.',
		blogTitle: 'Blog | TechDova',
		blogDescription:
			'TechDova buying guides and plain-language advice: headphones, laptops, smartwatches and more.',
		contactTitle: 'Contact | TechDova',
		contactDescription:
			'Contact the TechDova team with any question about our products, your orders or delivery.',
		cartTitle: 'Cart | TechDova',
		cartDescription:
			'Review your TechDova cart, change quantities and check out (demo).',
		checkoutTitle: 'Checkout | TechDova',
		checkoutDescription:
			'Complete your demo order: contact, delivery and payment — nothing is sent anywhere.',
		orderConfirmationTitle: 'Order confirmed | TechDova',
		orderConfirmationDescription:
			'Your demo order is confirmed. View your order number and summary.',
		trackOrderTitle: 'Track your order | TechDova',
		trackOrderDescription:
			'Track your demo order with its order code and see its delivery status.',
		accountTitle: 'Account | TechDova',
		accountDescription:
			'Your demo TechDova account: sign in locally and view your demo orders.',
		termsTitle: 'Terms and conditions | TechDova',
		termsDescription: 'Demo terms and conditions for the TechDova storefront.',
		privacyTitle: 'Privacy policy | TechDova',
		privacyDescription: 'Demo privacy policy for the TechDova storefront.',
		faqTitle: 'Frequently asked questions | TechDova',
		faqDescription:
			'Demo answers to common questions about delivery, returns, payment, warranty and orders at TechDova.',
		shippingTitle: 'Delivery information | TechDova',
		shippingDescription:
			'Demo delivery information for TechDova: free standard delivery within 24/48h, regions and tracking.',
		returnsTitle: 'Returns and exchanges | TechDova',
		returnsDescription:
			'Demo returns policy for TechDova: 30-day returns, free return shipping and refunds within 5–7 business days.',
		paymentTitle: 'Payment methods | TechDova',
		paymentDescription:
			'Demo payment methods at TechDova: cards, cash on delivery and instalments. No real payment is processed.',
		accessibilityTitle: 'Accessibility statement | TechDova',
		accessibilityDescription:
			'Accessibility statement for the TechDova demo storefront: WCAG 2.2 AA target, supported features and limitations.',
		sitemapTitle: 'Sitemap | TechDova',
		sitemapDescription:
			'Human-readable sitemap of the TechDova demo storefront, in English and French.',
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
		switchTo: 'Switch to {language}',
		deals: 'Deals',
		wishlist: 'Wishlist',
		compare: 'Compare'
	},
	live: {
		addedToCart: 'Added {name} to your cart.',
		removedFromCart: 'Removed {name} from your cart.'
	},
	announcementBar: {
		text: 'Free delivery on all orders — delivered within 24/48h',
		linkLabel: 'Delivery info'
	},
	searchAutocomplete: {
		popular: ['iPhone', 'Headphones', 'Laptop', 'Smartwatch'],
		noResults: 'No products match your search',
		viewAllResults: 'View all results',
		suggestionsLabel: 'Suggested products'
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
	toast: {
		dismiss: 'Dismiss notification'
	},
	backToTop: {
		label: 'Back to top'
	},
	recentlyViewed: {
		heading: 'Recently viewed'
	},
	countdown: {
		days: 'Days',
		hours: 'Hours',
		minutes: 'Min',
		seconds: 'Sec',
		expired: 'This offer has ended.'
	},
	checkoutSteps: {
		contact: 'Contact',
		shipping: 'Delivery',
		payment: 'Payment'
	},
	testimonialsSection: {
		eyebrow: 'Testimonials',
		heading: 'What customers say',
		aggregate: 'Average {rating} out of 5 from {count} demo testimonials',
		demoNote: 'These testimonials are fictional demo content, written for illustration.'
	},
	reviews: {
		heading: 'Customer reviews',
		demoNote: 'These reviews are fictional demo content, written for illustration.',
		writeTitle: 'Write a review (demo)',
		nameLabel: 'Your name',
		ratingLabel: 'Rating',
		titleLabel: 'Review title',
		textLabel: 'Your review',
		submit: 'Submit review',
		successNote: 'Thank you! Your demo review appears above for this session only.',
		helpful: 'Helpful ({count})',
		helpfulVoted: 'Helpful — thanks for your vote ({count})',
		basedOn: 'Based on {count} reviews',
		breakdownLabel: 'Rating breakdown',
		nameError: 'Please enter your name.',
		titleError: 'Please enter a review title.',
		textError: 'Please write at least 10 characters.',
		ratingOption: '{n} out of 5 stars'
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
	newArrivals: {
		eyebrow: 'Just landed',
		heading: 'New arrivals',
		viewAll: 'View all products'
	},
	dealOfDay: {
		eyebrow: 'Limited-time offer',
		heading: 'Deal of the day',
		viewAll: 'View all deals',
		endsLabel: 'This offer ends in'
	},
	brandStory: {
		eyebrow: 'Our story',
		heading: 'Technology within reach',
		text: 'TechDova started with a simple idea: the latest technology should be easy to discover, easy to compare and easy to trust. Every product is original, covered by a manufacturer warranty and delivered fast.',
		cta: 'Learn more about us',
		imageAlt: 'Smartphone, laptop, smartwatch and earbuds arranged on a white podium'
	},
	newsletterBand: {
		title: 'Stay in the loop',
		text: 'Receive our latest news, new arrivals and special offers — no spam, unsubscribe anytime (demo).'
	},
	quickView: {
		label: 'Quick view',
		viewDetails: 'View full details'
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
		privacy: 'Privacy policy',
		shopTitle: 'Shop',
		helpTitle: 'Help',
		companyTitle: 'Company',
		accountTitle: 'Account',
		deals: 'Deals',
		shipping: 'Shipping & delivery',
		returns: 'Returns',
		payment: 'Payment methods',
		faq: 'FAQ',
		trackOrder: 'Track your order',
		testimonials: 'Testimonials',
		blog: 'Blog',
		sitemap: 'Sitemap',
		accessibility: 'Accessibility',
		account: 'Account',
		wishlist: 'Wishlist',
		compare: 'Compare'
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
	categoryPage: {
		breadcrumbLabel: 'Breadcrumb',
		results: '{count} products',
		resultOne: '1 product',
		backToShop: 'Back to shop'
	},
	searchPage: {
		title: 'Search',
		hint: 'Search the whole catalogue by product name, category or feature.',
		searchLabel: 'Search products',
		searchPlaceholder: 'Search products…',
		popularLabel: 'Popular searches',
		popularSearches: ['iPhone', 'headphones', 'laptop', 'smartwatch'],
		results: '{count} results for "{query}"',
		resultOne: '1 result for "{query}"',
		noResults: 'No results for "{query}"',
		noResultsHint: 'Check the spelling or try a more general term.',
		suggestionsLabel: 'Try one of these popular searches',
		browseShop: 'Browse the shop'
	},
	wishlistPage: {
		title: 'Your wishlist',
		description: 'Your saved products, all in one place.',
		count: '{count} saved products',
		countOne: '1 saved product',
		empty: 'Your wishlist is empty',
		emptyHint: 'Tap the heart on any product to save it here.',
		browseShop: 'Browse the shop',
		moveToCart: 'Move to cart',
		moveToCartLabel: 'Move {name} to cart',
		remove: 'Remove {name}'
	},
	comparePage: {
		title: 'Compare products',
		description: 'Compare up to 4 products side by side.',
		empty: 'Nothing to compare yet',
		emptyHint: 'Add up to 4 products to compare their prices, ratings and specifications.',
		browseShop: 'Browse the shop',
		clearAll: 'Clear all',
		comparing: 'Comparing {count} products',
		tableLabel: 'Product comparison',
		rowProduct: 'Product',
		rowPrice: 'Price',
		rowRating: 'Rating',
		rowCategory: 'Category',
		rowStock: 'Availability',
		rowActions: 'Actions',
		remove: 'Remove {name}',
		trayAriaLabel: 'Comparison tray',
		trayCount: '{count} products to compare',
		trayOne: '1 product to compare',
		trayCompareNow: 'Compare now',
		trayClear: 'Clear comparison'
	},
	dealsPage: {
		title: 'Deals',
		description: 'Save on a selection of products — limited time only.',
		endsIn: 'Offer ends in',
		results: '{count} deals',
		resultOne: '1 deal',
		empty: 'No deals right now',
		emptyHint: 'Check back soon for our next offers.',
		browseShop: 'Browse the shop'
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
		breadcrumbLabel: 'Breadcrumb',
		reviewsLink: 'Read reviews',
		deliveryTitle: 'Delivery & returns',
		deliveryEstimate: 'Estimated delivery within 24/48h',
		notifyLabel: 'Notify me when available (demo)',
		notifySuccess:
			'Thank you! We will let you know when this product is back in stock. This is a demo: no notification will be sent.',
		shareLabel: 'Share this product',
		copyLink: 'Copy link',
		copiedToast: 'Link copied to clipboard.',
		shareViaLabel: 'Share',
		pairsTitle: 'Pairs well with',
		zoomLabel: 'Enlarge the product image',
		compareAdd: 'Add to compare',
		compareRemove: 'Remove from compare',
		compareFull: 'Compare is full — you can compare up to 4 products.'
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
	checkout: {
		title: 'Checkout',
		guestNote:
			'Guest checkout — no account needed. Signing in is optional and stays on this device.',
		demoNote: 'Demo checkout: no payment is taken and nothing is sent anywhere.',
		nameLabel: 'Full name',
		namePlaceholder: 'Your name',
		emailLabel: 'Email address',
		emailPlaceholder: 'you@example.com',
		addressLabel: 'Street address',
		addressPlaceholder: 'Street and house number',
		cityLabel: 'City',
		cityPlaceholder: 'Your city',
		postalLabel: 'Postal code',
		postalPlaceholder: '16000',
		countryLabel: 'Country',
		countryAlgeria: 'Algeria',
		countryFrance: 'France',
		countryTunisia: 'Tunisia',
		countryMorocco: 'Morocco',
		deliveryLegend: 'Delivery option',
		deliveryStandard: 'Standard delivery',
		deliveryStandardHint: 'Delivered within 24/48h — free',
		deliveryExpress: 'Express delivery',
		deliveryExpressHint: 'Delivered within 24h — free',
		paymentLegend: 'Payment method',
		paymentCard: 'Card (demo)',
		paymentCardHint: 'Demo only — use any test details. Nothing is charged.',
		paymentCod: 'Cash on delivery',
		paymentCodHint: 'Pay when your demo order arrives.',
		paymentBnpl: 'Pay in instalments (demo)',
		paymentBnplHint: 'Split your demo payment into instalments. Nothing is charged.',
		cardNumberLabel: 'Card number (demo)',
		cardNumberPlaceholder: '4242 4242 4242 4242',
		expiryLabel: 'Expiry date (demo)',
		expiryPlaceholder: 'MM/YY',
		cvcLabel: 'CVC (demo)',
		cvcPlaceholder: '123',
		cardDemoNote: 'Demo card fields: enter any test details. They are never sent or stored.',
		back: 'Back',
		continue: 'Continue',
		placeOrder: 'Place order (demo)',
		requiredError: 'This field is required.',
		emailError: 'Please enter a valid email address.',
		cardNumberError: 'Please enter a demo card number (at least 12 digits).',
		expiryError: 'Please enter an expiry date as MM/YY.',
		cvcError: 'Please enter a 3–4 digit demo CVC.',
		errorSummary: 'Please correct the following errors:',
		summaryTitle: 'Order summary',
		lineQty: '× {qty}'
	},
	orderConfirmation: {
		itemsTitle: 'Your items',
		placedOn: 'Placed on {date}',
		statusLabel: 'Delivery status',
		trackOrderLink: 'Track your order',
		emptyTitle: 'No recent order found',
		emptyText:
			'We could not find a demo order on this device. Place an order from your cart to see its confirmation here.',
		lineQty: '× {qty}'
	},
	trackOrder: {
		title: 'Track your order',
		description:
			'Enter your demo order code to see its delivery status. This is a demo: statuses are illustrative and computed on your device.',
		orderCodeLabel: 'Order code',
		orderCodePlaceholder: 'TD-XXXXXX',
		codeHint: 'Your order code starts with TD- and appears on the confirmation page.',
		emailLabel: 'Email address (optional)',
		emailPlaceholder: 'you@example.com',
		submit: 'Track order',
		requiredError: 'Please enter your order code.',
		emailError: 'Please enter a valid email address.',
		orderHeading: 'Order {orderId}',
		placedOn: 'Placed on {date}',
		statusLabel: 'Delivery status',
		statusOrdered: 'Ordered',
		statusShipped: 'Shipped',
		statusOutForDelivery: 'Out for delivery',
		statusDelivered: 'Delivered',
		timelineLabel: 'Delivery timeline',
		stepCompleted: 'Completed',
		stepCurrent: 'Current step',
		stepUpcoming: 'Upcoming',
		itemsTitle: 'Order items',
		lineQty: '× {qty}',
		demoNote:
			'Demo tracking: this timeline is illustrative. No order was found for this code on this device, so a sample status is shown.',
		trackAnother: 'Track another order'
	},
	account: {
		title: 'Your account',
		description:
			'Demo account: sign in with a name and email only. No password is ever asked for, and nothing leaves your device.',
		demoNote: 'Demo account: your profile is stored only in this browser.',
		signInTitle: 'Sign in (demo)',
		nameLabel: 'Full name',
		namePlaceholder: 'Your name',
		emailLabel: 'Email address',
		emailPlaceholder: 'you@example.com',
		signInButton: 'Sign in (demo)',
		requiredError: 'This field is required.',
		emailError: 'Please enter a valid email address.',
		errorSummary: 'Please correct the following errors:',
		greeting: 'Hello, {name}',
		signedInAs: 'Signed in as {email}',
		signOut: 'Sign out',
		ordersTitle: 'Your demo orders',
		ordersEmpty: 'No demo orders yet.',
		ordersEmptyHint: 'Orders you place in this demo will appear here.',
		placedOn: 'Placed on {date}',
		trackLink: 'Track order',
		shortcutsTitle: 'Shortcuts',
		cartShortcut: 'Your cart',
		wishlistShortcut: 'Your wishlist',
		wishlistCount: '{count} saved items',
		wishlistEmpty: 'No saved items yet.',
		browseShop: 'Browse products'
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
	testimonialsPage: {
		title: 'What customers say',
		description:
			'Everyday customers on the products they bought, the delivery they received and the support they got.',
		cta: 'Browse the shop'
	},
	blogPage: {
		title: 'TechDova blog',
		description:
			'Buying guides and plain-language advice to help you choose the right tech — no jargon, no pressure.',
		readMore: 'Read more',
		readingTime: '{minutes} min read',
		backToBlog: 'Back to blog',
		prevPost: 'Previous article',
		nextPost: 'Next article',
		breadcrumbBlog: 'Blog'
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
	faq: {
		title: 'Frequently asked questions',
		description: 'Demo answers to common questions about shopping at TechDova.',
		intro: 'Find quick answers below. Everything on this page describes the demo storefront: no real orders, payments or deliveries take place.',
		items: [
			{
				question: 'How much does delivery cost, and how fast is it?',
				answer:
					'Delivery is free on all demo orders, with an estimated arrival within 24/48h. These are demo estimates: no goods are actually shipped.'
			},
			{
				question: 'How do I return a product?',
				answer:
					'You have 30 days from the demo delivery date to return a product. Start a return from the contact page and keep the item unused in its original packaging. In this demo, returns are illustrative only: nothing is collected and no refund is processed.'
			},
			{
				question: 'Which payment methods do you accept?',
				answer:
					'The demo checkout lists card payments, cash on delivery and BNPL-style instalments. No real payment is processed and no card data leaves your device.'
			},
			{
				question: 'Are products covered by a warranty?',
				answer:
					'Every product in the demo catalogue is covered by a 2-year manufacturer warranty. Since this is a demonstration, no warranty claim can actually be filed.'
			},
			{
				question: 'How can I track my order?',
				answer:
					'Use the track-order page with your demo order number. Order history is stored only in your browser, so tracking works on the device where the order was placed.'
			},
			{
				question: 'Do I need an account to shop?',
				answer:
					'No. You can browse and check out without an account. Demo account features store their data only in your browser (localStorage) and nothing is sent to a server.'
			},
			{
				question: 'Can I change or cancel my order?',
				answer:
					'In this demo, orders are confirmed locally on your device and no real order exists to change. For questions about a demo order, use the contact page.'
			},
			{
				question: 'Where do you deliver?',
				answer:
					'Demo delivery regions include Algiers, Oran, Constantine, Sétif, Annaba and Blida. See the delivery information page for the full demo list and estimates.'
			},
			{
				question: 'Is it safe to enter my card details?',
				answer:
					'This is a demo: no real payment is processed and anything you type stays on your device. Never enter real card details on a demo site.'
			}
		],
		contactPrompt: 'Still have a question?',
		contactLink: 'Contact us'
	},
	shipping: {
		title: 'Delivery information',
		description: 'Demo delivery information for the TechDova storefront.',
		updated: 'Last updated: 15 November 2026',
		sections: [
			{
				heading: '1. Free standard delivery',
				body: 'Standard delivery is free on every demo order, with an estimated arrival within 24/48h. There are no delivery fees and no minimum order amount. These estimates are illustrative: no goods are actually shipped.'
			},
			{
				heading: '2. Delivery regions',
				body: 'The demo delivery network covers the following regions. Delivery times are estimates shown for illustration only.'
			},
			{
				heading: '3. Tracking your order',
				body: 'Every demo order receives a tracking number you can follow on the track-order page. Tracking updates are generated locally in your browser and do not reflect a real shipment.'
			},
			{
				heading: '4. Packaging',
				body: 'Demo orders are described as carefully packed in protective, recyclable packaging. Since this is a demonstration, no parcel is prepared or sent.'
			}
		],
		regions: ['Algiers', 'Oran', 'Constantine', 'Sétif', 'Annaba', 'Blida'],
		trackOrderLink: 'Track your order'
	},
	returns: {
		title: 'Returns and exchanges',
		description: 'Demo returns policy for the TechDova storefront.',
		updated: 'Last updated: 15 November 2026',
		sections: [
			{
				heading: '1. 30-day window',
				body: 'You have 30 days from the demo delivery date to return or exchange a product. Items must be unused, in their original packaging and with all accessories included.'
			},
			{
				heading: '2. Free return shipping',
				body: 'Return shipping is free in this demo. No return label is actually issued and no parcel is collected: the process below is illustrative only.'
			},
			{
				heading: '3. Refunds',
				body: 'Approved demo refunds are described as issued to the original payment method within 5–7 business days. No real payment is processed, so no real refund takes place. Exchanges follow the same 30-day window.'
			}
		],
		stepsHeading: 'How to start a return (demo)',
		steps: [
			'Go to the contact page and choose the order question subject.',
			'Include your demo order number and the product you wish to return.',
			'Keep the product unused and in its original packaging.',
			'In a real store, you would then receive a return label — in this demo, nothing further happens.'
		],
		contactLink: 'Contact us to start a return'
	},
	payment: {
		title: 'Payment methods',
		description: 'Demo payment methods for the TechDova storefront.',
		updated: 'Last updated: 15 November 2026',
		sections: [
			{
				heading: '1. Cards (demo)',
				body: 'Demo card payments are simulated locally: you can enter any test details at checkout and no charge is ever made. Never enter real card details on this demo site.'
			},
			{
				heading: '2. Cash on delivery',
				body: 'Cash on delivery is listed as a demo option: in a real store you would pay the courier when your order arrives. No delivery takes place in this demo.'
			},
			{
				heading: '3. Pay in instalments (demo)',
				body: 'BNPL-style instalments are shown as a demo option that would split a purchase into monthly payments. No credit agreement is offered and no instalment plan is created.'
			},
			{
				heading: '4. Security',
				body: 'No real payment is processed on this site and no card data leaves your device: everything you type stays in your browser. The checkout flow is a local demonstration with no backend and no payment provider.'
			}
		],
		demoNote: 'Demo only: no real payment is processed and no card data leaves your device.'
	},
	accessibility: {
		title: 'Accessibility statement',
		description: 'Accessibility statement for the TechDova demo storefront.',
		updated: 'Last updated: 15 November 2026',
		sections: [
			{
				heading: '1. Our target',
				body: 'TechDova aims to meet WCAG 2.2 level AA. The storefront uses prerendered pages with semantic HTML, keyboard support and text alternatives for images.'
			},
			{
				heading: '2. Limitations',
				body: 'This is a demonstration site, so some content has honest limits: product artwork is generated imagery with descriptive alt text, and some interactive demos (such as the carousel) are simplified. We are happy to hear about any barrier you find.'
			},
			{
				heading: '3. Feedback',
				body: 'If you find an accessibility issue, please tell us through the contact page, describing the page and the problem. We will do our best to address demo issues in a future update.'
			}
		],
		featuresHeading: 'Supported features',
		features: [
			'Full keyboard navigation with a visible focus indicator',
			'Reduced-motion support: animations are disabled when your system requests it',
			'Screen-reader announcements for cart changes via a live region',
			'Descriptive alt text on product and category images',
			'Touch targets of at least 44 by 44 pixels',
			'Text contrast meeting WCAG 2.2 AA on all main content'
		],
		contactLink: 'Report an accessibility issue'
	},
	sitemapPage: {
		title: 'Sitemap',
		description: 'Every page on the TechDova demo storefront, in English and French.',
		shopHeading: 'Shop',
		helpHeading: 'Help',
		companyHeading: 'Company',
		accountHeading: 'Account',
		categoriesLabel: 'Categories',
		productsLabel: 'Products',
		postsLabel: 'Blog posts',
		labels: {
			home: 'Home',
			shop: 'Shop',
			deals: 'Deals',
			search: 'Search',
			wishlist: 'Wishlist',
			compare: 'Compare',
			cart: 'Cart',
			checkout: 'Checkout',
			trackOrder: 'Track order',
			account: 'Account',
			testimonials: 'Testimonials',
			blog: 'Blog',
			faq: 'Frequently asked questions',
			shipping: 'Delivery information',
			returns: 'Returns and exchanges',
			payment: 'Payment methods',
			about: 'About',
			contact: 'Contact',
			terms: 'Terms and conditions',
			privacy: 'Privacy policy',
			accessibility: 'Accessibility statement',
			sitemap: 'Sitemap'
		}
	},
	notFound: {
		eyebrow: 'Error 404',
		title: 'Page not found',
		description: 'Sorry, the page you are looking for does not exist or has moved.',
		backHome: 'Back to home'
	}
};
