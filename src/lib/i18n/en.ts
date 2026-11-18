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
		shopTitle: 'Shop all tech products | TechDova',
		shopDescription:
			'Browse all our tech products: smartphones, computers, audio, smartwatches, gaming and accessories.',
		categoryTitle: 'Shop {category} | TechDova',
		categoryDescription:
			'{category} at TechDova: original products, honest prices and fast delivery.',
		searchTitle: 'Search products | TechDova',
		searchDescription:
			'Search the TechDova catalogue: smartphones, computers, audio, smartwatches, gaming and accessories.',
		wishlistTitle: 'Wishlist: your saved products | TechDova',
		wishlistDescription: 'Your saved TechDova products, all in one place.',
		compareTitle: 'Compare products | TechDova',
		compareDescription:
			'Compare TechDova products side by side: prices, ratings, availability and specifications.',
		dealsTitle: 'Deals and limited-time offers | TechDova',
		dealsDescription:
			'Save on a selection of TechDova products — limited-time offers on smartphones, computers, audio and more.',
		aboutTitle: 'About our tech store | TechDova',
		aboutDescription:
			'Discover TechDova, your tech universe: original products, fast delivery and customer service that listens.',
		testimonialsTitle: 'Testimonials | TechDova',
		testimonialsDescription:
			'Read what TechDova customers say about our products, delivery and support — fictional demo testimonials.',
		blogTitle: 'Tech blog: buying guides and advice | TechDova',
		blogDescription:
			'TechDova buying guides and plain-language advice: headphones, laptops, smartwatches and more.',
		contactTitle: 'Contact us: questions and support | TechDova',
		contactDescription:
			'Contact the TechDova team with any question about our products, your orders or delivery.',
		cartTitle: 'Your shopping cart | TechDova',
		cartDescription:
			'Review your TechDova cart, change quantities and check out (demo).',
		checkoutTitle: 'Checkout: complete your order | TechDova',
		checkoutDescription:
			'Complete your demo order: contact, delivery and payment — nothing is sent anywhere.',
		orderConfirmationTitle: 'Order confirmed | TechDova',
		orderConfirmationDescription:
			'Your demo order is confirmed. View your order number and summary.',
		trackOrderTitle: 'Track your order | TechDova',
		trackOrderDescription:
			'Track your demo order with its order code and see its delivery status.',
		accountTitle: 'Your account: orders and settings | TechDova',
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
		sitemapTitle: 'Sitemap: all pages | TechDova',
		sitemapDescription:
			'Human-readable sitemap of the TechDova demo storefront, in English and French.',
		storesTitle: 'Our stores | TechDova',
		storesDescription:
			'Find the TechDova demo stores in Algiers, Oran and Constantine — fictional addresses, hours and directions.',
		giftCardsTitle: 'Gift cards | TechDova',
		giftCardsDescription:
			'Send a demo TechDova gift card or check a demo gift-card balance. Nothing is charged and nothing is sent.',
		helpTitle: 'Help centre | TechDova',
		helpDescription:
			'Get help with your demo TechDova order: delivery, returns, payment, tracking and answers to popular questions.',
		newArrivalsTitle: 'New arrivals | TechDova',
		newArrivalsDescription:
			'The latest tech to land at TechDova: new smartphones, audio, smartwatches and gaming gear.',
		bestSellersTitle: 'Best sellers | TechDova',
		bestSellersDescription:
			'TechDova’s most-loved demo products, rated by fictional customers: phones, laptops, audio and more.',
		notFoundTitle: 'Page not found | TechDova',
		notFoundDescription: 'The requested page could not be found.',
		brandsTitle: 'Shop by brand | TechDova',
		brandsDescription:
			'Browse TechDova products by brand: Apple, Samsung, Sony, Dell, PlayStation, Nintendo and TechDova.',
		rewardsTitle: 'Rewards programme | TechDova',
		rewardsDescription:
			'Demo rewards programme: earn points on demo orders, climb tiers and unlock fictional perks. Nothing is tracked or sent anywhere.',
		tradeInTitle: 'Trade in your device | TechDova',
		tradeInDescription:
			'Demo trade-in estimator: estimate the credit your old device could be worth. No device is collected and no credit is issued.',
		financingTitle: 'Financing and instalments | TechDova',
		financingDescription:
			'Demo financing explainer and instalment calculator: split a purchase into monthly payments at 0% demo interest. No credit agreement is offered.',
		warrantyTitle: 'Extended warranty | TechDova',
		warrantyDescription:
			'Demo extended warranty and protection plans: compare cover levels and fictional prices. No plan is sold and no claim can be filed.',
		cookiesTitle: 'Cookie and storage policy | TechDova',
		cookiesDescription:
			'How TechDova stores data honestly: no tracking cookies, no analytics — only local browser storage for your cart, wishlist, theme and language.'
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
		messages: [
			'Free delivery on all orders — delivered within 24/48h',
			'Original products with manufacturer warranty',
			'Secure payment and customer support, always here to help'
		],
		shortMessages: [
			'Free delivery on all orders',
			'Original products, warranty included',
			'Secure payment and support'
		],
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
		pause: 'Pause automatic slide rotation',
		play: 'Resume automatic slide rotation',
		goToSlide: 'Go to slide {n}',
		carouselLabel: 'Featured products',
		slideLabel: 'Slide {n} of {total}',
		dotsLabel: 'Choose a slide',
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
		viewAll: 'View all products',
		carouselLabel: 'Best sellers carousel'
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
	theme: {
		switchToDark: 'Switch to dark mode',
		switchToLight: 'Switch to light mode'
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
	megaMenu: {
		categoriesHeading: 'Shop by category',
		featuredHeading: 'Featured products',
		promoTitle: 'Up to -20% on a selection',
		promoText: 'Discover this week’s deals on phones, laptops and audio.',
		promoCta: 'View all deals'
	},
	marquee: {
		label: 'Current offers and brands',
		offers: [
			'Free delivery on all orders',
			'Up to 20% off selected products',
			'30-day returns',
			'Secure payment',
			'Manufacturer warranty'
		],
		brands: ['Apple', 'Samsung', 'Dell', 'Sony', 'PlayStation', 'Nintendo', 'TechDova']
	},
	tabReminder: {
		waiting: 'items waiting in your cart'
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
		ratingOption: '{n} out of 5 stars',
		sampleNote:
			'Showing a 3-review sample, including one critical review. Averages reflect all {count} reviews.'
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
	brandsSection: {
		eyebrow: 'Our brands',
		heading: 'Shop by brand',
		oneProduct: '1 product',
		manyProducts: '{count} products'
	},
	bentoSection: {
		eyebrow: 'Discover more',
		heading: 'More ways to explore',
		explore: 'Explore',
		spotlightTitle: 'Gaming, ready to play',
		spotlightText: 'Controllers, consoles and accessories for every player.',
		dealsTitle: 'Save on selected tech',
		dealsText: 'Discounted phones, laptops, audio and more.',
		newTitle: 'Fresh arrivals',
		newText: 'The latest phones, headphones and consoles, just landed.',
		giftTitle: 'Gift cards',
		giftText: 'Let them choose — a TechDova gift card for any occasion.'
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
		compare: 'Compare',
		stores: 'Our stores',
		giftCards: 'Gift cards',
		help: 'Help centre',
		newArrivals: 'New arrivals',
		bestSellers: 'Best sellers',
		brands: 'Brands',
		rewards: 'Rewards',
		tradeIn: 'Trade-in',
		financing: 'Financing',
		warranty: 'Warranty',
		cookies: 'Cookie policy',
		cookieSettings: 'Cookie settings'
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
	filters: {
		filters: 'Filters',
		apply: 'Apply filters',
		showResults: 'Show {count} results',
		clearAll: 'Clear all',
		activeFilters: 'Active filters',
		removeFilter: 'Remove filter: {label}',
		sortBy: 'Sort by',
		results: '{count} results',
		resultOne: '1 result',
		activeCount: '{count} active',
		brandsLabel: 'Brands',
		allBrands: 'All brands',
		ratingLabel: 'Minimum rating',
		ratingAny: 'Any rating',
		ratingFourPlus: '4 stars & up',
		ratingThreePlus: '3 stars & up',
		inStockOnly: 'In stock only',
		onSaleOnly: 'On sale only',
		showingOf: 'Showing {shown} of {total} products',
		showingOfOne: 'Showing 1 of {total} products',
		facetsHeading: 'Refine results'
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
		noResultsTips: [
			'Check the spelling of your search terms.',
			'Try fewer words, or a more general term.',
			'Browse the shop categories to discover similar products.'
		],
		suggestionsLabel: 'Try one of these popular searches',
		browseShop: 'Browse the shop',
		categoryFilterLabel: 'Filter by category',
		allCategories: 'All categories',
		synonymsNote:
			'Related terms are matched too: “laptop”, “phone” and similar words find their categories.'
	},
	wishlistPage: {
		title: 'Your wishlist',
		description: 'Your saved products, all in one place.',
		savedHeading: 'Saved products',
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
		highlightDifferences: 'Highlight differences',
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
		compareFull: 'Compare is full — you can compare up to 4 products.',
		skuLabel: 'SKU',
		variantStorageLabel: 'Storage',
		variantColorLabel: 'Colour',
		variantSelected: 'Selected: {label}',
		variantOutOfStockSuffix: '(out of stock)',
		galleryPrevious: 'Previous image',
		galleryNext: 'Next image',
		galleryImageLabel: 'Product image {current} of {total}',
		galleryThumbnailLabel: 'View image {n}',
		magnifierHint: 'Hover to magnify',
		deliveryCountdown: 'Order within {time} for delivery by {date}',
		deliveryCountdownTime: '{hours}h {minutes}m',
		deliveryCountdownMinutes: '{minutes}m',
		deliveryDemoNote: 'Demo estimate — delivery dates are illustrative.',
		estimatedCost: 'Estimated total: {total}',
		returnPolicyLink: 'Returns policy',
		inTheBoxTitle: 'What’s in the box',
		qaTitle: 'Questions & answers',
		qaDemoNote: 'Demo questions and answers, written for illustration.',
		bundleTitle: 'Frequently bought together',
		bundleTotal: 'Total for {count} items: {total}',
		bundleAddAll: 'Add all {count} to cart',
		bundleAdded: 'Bundle added to cart',
		variantsNote: 'Available in {count} variants, from {price}',
		variantsLabel: 'Variants',
		scrollProgressLabel: 'Page progress'
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
		viewCart: 'View cart',
		promoLabel: 'Promo code',
		promoPlaceholder: 'Enter a code, e.g. TECHDOVA10',
		promoApply: 'Apply',
		promoError: 'That code is not recognised. Try TECHDOVA10.',
		promoHint: 'Demo codes: TECHDOVA10 (−10%), WELCOME15 (−15%), SAVE20 (−20%).',
		promoApplied: 'Code {code} applied: {label}',
		promoRemove: 'Remove promo code {code}',
		promoDiscount: 'Promo discount ({code})',
		returnNudgeTitle: 'Welcome back',
		returnNudgeText: 'Your cart is waiting — {count} items are still there.',
		returnNudgeTextOne: 'Your cart is waiting — 1 item is still there.',
		returnNudgeDismiss: 'Dismiss'
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
		browseShop: 'Browse products',
		editTitle: 'Edit your profile',
		editButton: 'Edit profile',
		editDescription:
			'Change the name and email stored for this demo account. Nothing leaves your device.',
		saveButton: 'Save profile',
		cancelButton: 'Cancel',
		savedMessage: 'Profile saved.',
		notificationsTitle: 'Notification preferences',
		notificationsDescription:
			'Choose which demo notifications you would like. These toggles are stored only in this browser and no message is ever sent.',
		ordersLabel: 'Order updates',
		ordersHint: 'Demo updates when a demo order ships or arrives.',
		offersLabel: 'Offers and deals',
		offersHint: 'Demo messages about deals and new arrivals.',
		newsletterLabel: 'Newsletter',
		newsletterHint: 'The same demo newsletter as the footer form — nothing is sent.'
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
		breadcrumbBlog: 'Blog',
		filterLabel: 'Filter articles by category',
		allCategories: 'All categories',
		results: '{count} articles',
		resultOne: '1 article',
		noResults: 'No articles in this category yet.',
		relatedTitle: 'Related articles',
		progressLabel: 'Reading progress'
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
			sitemap: 'Sitemap',
			stores: 'Our stores',
			giftCards: 'Gift cards',
			help: 'Help centre',
			newArrivals: 'New arrivals',
			bestSellers: 'Best sellers'
		}
	},
	storesPage: {
		title: 'Our stores',
		description: 'Visit one of our demo stores — or browse the full catalogue online.',
		demoNote:
			'Demo content: these stores are fictional. The addresses, hours and phone numbers are placeholders, and no real shop exists at these locations.',
		filterLabel: 'Filter by city',
		allCities: 'All cities',
		hoursLabel: 'Opening hours',
		phoneLabel: 'Phone',
		directions: 'Get directions',
		directionsLabel: 'Get directions to {name} (opens in a new tab)',
		results: '{count} stores',
		resultOne: '1 store',
		noResults: 'No stores in this city yet',
		shopOnline: 'Shop online instead'
	},
	giftCardsPage: {
		title: 'Gift cards',
		description:
			'Give the gift of tech. Choose an amount, add a message, and preview your demo gift card.',
		demoNote:
			'Demo only: no gift card is created, no email is sent and nothing is charged. The preview below stays on this device.',
		amountLabel: 'Choose an amount',
		customAmountLabel: 'Or enter a custom amount (DA)',
		customAmountPlaceholder: 'e.g. 2500',
		recipientNameLabel: 'Recipient name',
		recipientNamePlaceholder: 'e.g. Amira Benali',
		recipientEmailLabel: 'Recipient email',
		recipientEmailPlaceholder: 'e.g. amira@example.com',
		senderNameLabel: 'Your name',
		senderNamePlaceholder: 'e.g. Yacine',
		messageLabel: 'Personal message (optional)',
		messagePlaceholder: 'Happy birthday! Enjoy picking your new tech…',
		requiredError: 'This field is required.',
		emailError: 'Please enter a valid email address.',
		amountError: 'Please choose an amount between 500 DA and 50,000 DA.',
		errorSummary: 'Please fix the following errors:',
		previewButton: 'Preview gift card',
		previewTitle: 'Your gift card preview',
		previewText: 'This is how the demo gift card would look. Nothing has been sent.',
		previewTo: 'To {name}',
		previewFrom: 'From {name}',
		previewCodeHint: 'Demo tip: try the code {code} in the balance check below.',
		sendAnother: 'Create another gift card',
		balanceTitle: 'Check a gift-card balance',
		balanceDescription:
			'Enter a demo gift-card code to see its fictional balance. Try DEMO-1000, DEMO-2500 or DEMO-5000.',
		balanceCodeLabel: 'Gift-card code',
		balanceCodePlaceholder: 'e.g. DEMO-1000',
		balanceButton: 'Check balance',
		balanceCodeError: 'Please enter a gift-card code.',
		balanceFound: 'Demo balance for {code}: {amount}. This balance is fictional and cannot be spent.',
		balanceNotFound:
			'We could not find a demo card with the code “{code}”. Try DEMO-1000, DEMO-2500 or DEMO-5000.',
		howTitle: 'How demo gift cards work',
		howSteps: [
			'Choose an amount and add a personal message, then preview the gift card.',
			'In this demo, no email is sent and no payment is taken: the preview stays in your browser.',
			'Check a fictional balance with a DEMO-… code above: it only illustrates how the flow works.'
		]
	},
	helpPage: {
		title: 'Help centre',
		description:
			'Find answers about delivery, returns, payments and orders — or get in touch.',
		demoNote:
			'Everything here describes the demo storefront: no real orders, payments or deliveries take place.',
		topicsTitle: 'Browse help topics',
		topics: [
			{
				title: 'Frequently asked questions',
				description: 'Quick answers about delivery, returns, payment, warranty and orders.'
			},
			{
				title: 'Shipping & delivery',
				description: 'Free demo delivery within 24/48h, regions covered and tracking.'
			},
			{
				title: 'Returns & exchanges',
				description: '30-day demo returns, free return shipping and refund timings.'
			},
			{
				title: 'Payment methods',
				description: 'Cards, cash on delivery and instalments — no real payment is processed.'
			},
			{
				title: 'Track your order',
				description: 'Check the status of a demo order with its order code.'
			},
			{
				title: 'Contact us',
				description: 'Send the demo support team a message about anything on the storefront.'
			}
		],
		topicLink: 'Learn more',
		popularTitle: 'Popular questions',
		popularIntro:
			'Short answers to the questions shoppers ask most. See the FAQ page for the full list.',
		popular: [
			{
				question: 'How much does delivery cost?',
				answer:
					'Delivery is free on all demo orders, arriving within an estimated 24/48h. Nothing is actually shipped.'
			},
			{
				question: 'How long do I have to return a product?',
				answer:
					'You have 30 days from the demo delivery date. Returns are illustrative only in this demo.'
			},
			{
				question: 'Which payment methods can I use?',
				answer:
					'The demo checkout lists cards, cash on delivery and instalments. No real payment is ever processed.'
			},
			{
				question: 'How do I track my order?',
				answer:
					'Use the track-order page with your demo order number. Order history lives only in your browser.'
			}
		],
		faqLink: 'See all frequently asked questions',
		contactTitle: 'Still need help?',
		contactText: 'Our demo support team is happy to help with any question about the storefront.',
		contactLink: 'Contact us'
	},
	newArrivalsPage: {
		title: 'New arrivals',
		description:
			'The latest tech to land at TechDova — fresh phones, audio, wearables and gaming gear.',
		empty: 'No new arrivals match your filters',
		emptyHint: 'Try clearing the filters or browse the full shop.',
		browseShop: 'Browse the shop',
		categoryLabel: 'Category',
		allCategories: 'All categories',
		maxPriceLabel: 'Maximum price',
		priceAny: 'Any price',
		maxPriceValue: 'Up to {price}'
	},
	bestSellersPage: {
		title: 'Best sellers',
		description:
			'Our most-loved products, rated by customers — the tech shoppers keep coming back for.',
		empty: 'No best sellers match your filters',
		emptyHint: 'Try clearing the filters or browse the full shop.',
		browseShop: 'Browse the shop',
		categoryLabel: 'Category',
		allCategories: 'All categories',
		maxPriceLabel: 'Maximum price',
		priceAny: 'Any price',
		maxPriceValue: 'Up to {price}'
	},
	addresses: {
		title: 'Saved addresses',
		description: 'Delivery addresses saved in this browser for the demo checkout.',
		demoNote:
			'Demo only: addresses are stored only in this browser and are never sent anywhere. This demo never asks for payment details.',
		empty: 'No saved addresses yet',
		emptyHint: 'Add an address to reuse it at demo checkout.',
		addButton: 'Add address',
		editButton: 'Edit',
		editLabel: 'Edit address for {name}',
		deleteButton: 'Delete',
		deleteLabel: 'Delete address for {name}',
		formTitleAdd: 'Add an address',
		formTitleEdit: 'Edit address',
		nameLabel: 'Full name',
		namePlaceholder: 'e.g. Amira Benali',
		streetLabel: 'Street address',
		streetPlaceholder: 'e.g. 12 Rue Didouche Mourad',
		cityLabel: 'City',
		cityPlaceholder: 'e.g. Algiers',
		postalLabel: 'Postal code',
		postalPlaceholder: 'e.g. 16000',
		phoneLabel: 'Phone (optional)',
		phonePlaceholder: 'e.g. +213 21 00 00 00',
		requiredError: 'This field is required.',
		errorSummary: 'Please fix the following errors:',
		saveButton: 'Save address',
		cancelButton: 'Cancel'
	},
	cookieConsent: {
		bannerTitle: 'Your privacy, honestly',
		bannerText:
			'TechDova uses no tracking cookies and no analytics. The only things stored on your device are your cart, wishlist, theme and language choices, kept in your browser.',
		accept: 'Accept',
		decline: 'Decline',
		customize: 'Customise',
		learnMore: 'Learn more',
		learnMoreLabel: 'Learn more about our cookie policy',
		learnMoreSuffix: 'about our cookie policy',
		modalTitle: 'Cookie and storage settings',
		modalIntro:
			'This demo storefront sets no cookies at all — tracking or otherwise. Everything below is stored only in your own browser, using localStorage, and nothing is ever sent to a server.',
		storageTitle: 'What is stored on your device',
		storageText:
			'Your cart, wishlist, compare list, demo orders, demo account profile, saved addresses, recently viewed products, review votes, language and theme choices. Each item exists only so the demo works across page visits.',
		trackersTitle: 'What is never stored',
		trackersText:
			'No tracking cookies, no analytics, no advertising identifiers and no third-party requests. There is nothing to opt out of, because nothing watches you here.',
		declineNote:
			'Declining changes nothing: there are no trackers to turn off, and the site works exactly the same either way. Your choice is remembered on this device only.',
		clearData: 'Clear my stored data',
		clearDataDone:
			'Stored data cleared. Your cart, wishlist, theme, language and other demo data were removed from this browser.',
		close: 'Close settings',
		choiceSaved: 'Your choice has been saved on this device.'
	},
	chatWidget: {
		buttonLabel: 'Open live chat (demo)',
		closeLabel: 'Close chat',
		title: 'TechDova chat',
		subtitle: 'Demo assistant — instant canned answers',
		demoNote:
			'Demo chat: a small set of canned answers, running entirely in your browser. No messages are sent and no human reads them.',
		greeting:
			'Hello! I am the TechDova demo assistant. Ask about delivery, returns, tracking, payment or warranty — or tap a suggestion below.',
		inputLabel: 'Your message',
		placeholder: 'Type a question…',
		sendLabel: 'Send message',
		typingLabel: 'Assistant is typing…',
		quickLabel: 'Quick questions',
		quickShipping: 'How fast is delivery?',
		quickReturns: 'How do returns work?',
		quickTracking: 'How do I track my order?',
		quickContact: 'How do I contact a human?',
		answerGreeting:
			'Hello! Happy to help. Try asking about delivery, returns, order tracking, payment or warranty.',
		answerShipping:
			'Delivery is free on all demo orders, arriving within an estimated 24/48h. Nothing is actually shipped — see the delivery information page for the demo regions.',
		answerReturns:
			'You have 30 days from the demo delivery date to return a product, with free return shipping in this demo. Returns are illustrative only: nothing is collected and no refund is processed. See the returns page for the steps.',
		answerTracking:
			'Use the track-order page with your demo order number. Order history is stored only in this browser, so tracking works on the device where the order was placed.',
		answerPayment:
			'The demo checkout lists cards, cash on delivery and instalments. No real payment is processed and no card data leaves your device — never enter real card details on a demo site.',
		answerWarranty:
			'Every demo product includes a 2-year manufacturer warranty, and demo extended plans are shown on the warranty page. No plan is sold and no claim can actually be filed.',
		answerContact:
			'You can reach the demo support team through the contact page — the form is validated locally and nothing is sent anywhere.',
		fallback:
			'I only know a few demo topics: delivery, returns, order tracking, payment, warranty and contact. Could you try one of those?'
	},
	brandsPage: {
		title: 'Shop by brand',
		description:
			'Browse the TechDova catalogue by brand, from phones and laptops to gaming and accessories.',
		demoNote:
			'Demo catalogue: 12 products across 7 brands. Brand names are used for demonstration only.',
		productsCount: '{count} products',
		productOne: '1 product',
		shopBrand: 'Shop all {brand}',
		previewLabel: '{brand} products',
		browseShop: 'Browse the full shop'
	},
	rewardsPage: {
		title: 'TechDova Rewards',
		description:
			'Earn points on demo orders, climb tiers and unlock fictional perks. A demonstration loyalty programme — nothing is tracked and nothing is sent anywhere.',
		demoNote:
			'Demo programme: points, tiers and perks are fictional. Joining stores nothing and sends nothing.',
		howTitle: 'How it works',
		howSteps: [
			'Earn 1 point for every 10 DA you spend in a demo order.',
			'Collect points to climb from Bronze to Silver to Gold.',
			'Redeem 100 points for 100 DA off a demo order — fictional credit, never charged.'
		],
		tiersTitle: 'Membership tiers',
		tiers: [
			{
				name: 'Bronze',
				threshold: '0+ points',
				description: 'Everyone starts here.',
				perks: ['1 point per 10 DA spent', 'Birthday demo treat', 'Early access to demo deals']
			},
			{
				name: 'Silver',
				threshold: '500+ points',
				description: 'For returning demo shoppers.',
				perks: ['Everything in Bronze', 'Double points weekends (demo)', 'Free demo gift wrapping']
			},
			{
				name: 'Gold',
				threshold: '1,500+ points',
				description: 'Our most loyal demo members.',
				perks: ['Everything in Silver', 'Priority demo support', 'Exclusive Gold demo offers']
			}
		],
		joinTitle: 'Join Rewards (demo)',
		joinText: 'Enter a name and email to see the demo welcome state. Nothing is stored or sent.',
		nameLabel: 'Full name',
		namePlaceholder: 'Your name',
		emailLabel: 'Email address',
		emailPlaceholder: 'you@example.com',
		joinButton: 'Join Rewards',
		requiredError: 'This field is required.',
		emailError: 'Please enter a valid email address.',
		errorSummary: 'Please correct the following errors:',
		successTitle: 'Welcome to TechDova Rewards!',
		successText:
			'Thanks {name} — you are a demo Bronze member. This is only a local success state: no account was created and nothing was sent.',
		joinAnother: 'Join with different details'
	},
	tradeInPage: {
		title: 'Trade in your device',
		description:
			'Estimate what your old device could be worth as demo trade-in credit towards your next tech.',
		demoNote:
			'Demo estimator: no device is collected, no credit is issued and nothing is sent anywhere.',
		categoryLabel: 'Device type',
		deviceTypes: ['Smartphone', 'Laptop', 'Tablet', 'Smartwatch', 'Headphones', 'Games console'],
		conditionLabel: 'Condition',
		conditions: ['Like new', 'Good', 'Fair', 'Poor'],
		conditionHints: [
			'No scratches, works perfectly',
			'Light wear, works perfectly',
			'Visible wear, works well',
			'Damage or faults, still powers on'
		],
		ageLabel: 'Age of the device',
		ages: ['Less than 1 year', '1–2 years', '2–3 years', 'More than 3 years'],
		estimateTitle: 'Your estimated demo credit',
		estimateText: 'Estimated credit: {amount}',
		estimateHint:
			'This estimate is illustrative only, based on the demo values below. A real trade-in would need an in-person inspection.',
		howTitle: 'How the demo estimate works',
		howText:
			'Each device type starts from a demo base value, adjusted by condition and age. The calculation runs entirely in your browser.',
		disclaimer:
			'Demo only: TechDova does not collect devices or issue trade-in credit. Do not send any device anywhere.',
		ctaTitle: 'Questions about trade-in?',
		ctaText: 'Ask the demo support team — the contact form is local-only and nothing is sent.',
		ctaLink: 'Contact us'
	},
	financingPage: {
		title: 'Financing and instalments',
		description:
			'Split a purchase into monthly payments with the demo instalment calculator — 0% interest, no fees, no credit check.',
		demoNote:
			'Demo only: no financing agreement is offered, no credit check happens and no instalment plan is created.',
		calculatorTitle: 'Instalment calculator',
		priceLabel: 'Purchase price',
		monthsLabel: 'Pay over',
		months: ['3 months', '6 months', '12 months', '24 months'],
		monthlyLabel: 'Monthly payment',
		monthlyText: '{amount} per month',
		totalLabel: 'Total to pay',
		totalText: '{amount} — 0% demo interest, no fees',
		calculatorNote:
			'The calculator runs entirely in your browser. Changing the price or the term updates the result instantly.',
		bnplTitle: 'Buy now, pay later (demo)',
		bnplText:
			'BNPL-style instalments would split a purchase into equal monthly payments with no interest in this demo. In a real store, eligibility, fees and late-payment terms would apply — here, none of that exists.',
		stepsTitle: 'How demo instalments would work',
		steps: [
			'Choose a product and pick instalments at demo checkout.',
			'Pick a term: 3, 6, 12 or 24 monthly payments.',
			'Pay the same amount each month — 0% interest in this demo.',
			'In this demo, no plan is created and no payment is taken.'
		],
		disclaimer:
			'Demo explainer only: TechDova offers no credit. Never share bank or card details on a demo site.'
	},
	warrantyPage: {
		title: 'Extended warranty',
		description:
			'Compare demo protection plans that extend your cover beyond the included manufacturer warranty.',
		demoNote:
			'Demo plans: no warranty is sold, no claim can be filed and nothing is charged. Prices are fictional.',
		includedTitle: 'Included with every product',
		includedText:
			'Every product in the demo catalogue includes a 2-year manufacturer warranty covering manufacturing defects. Extended plans below would add accidental-damage cover and faster demo support.',
		plansTitle: 'Protection plans',
		plans: [
			{
				name: 'Standard',
				duration: '2 years included',
				description: 'The manufacturer warranty, already included.',
				features: ['Manufacturing defects covered', 'Demo support by email', 'Standard repair time']
			},
			{
				name: 'Plus',
				duration: '3 years total',
				description: 'One extra year, plus accident cover.',
				features: [
					'Everything in Standard',
					'Accidental damage cover (demo)',
					'One extra year of cover',
					'Priority demo support'
				]
			},
			{
				name: 'Premium',
				duration: '4 years total',
				description: 'The fullest demo cover we illustrate.',
				features: [
					'Everything in Plus',
					'Two extra years of cover',
					'Express demo replacement',
					'Battery replacement (demo)'
				]
			}
		],
		perYear: 'per year',
		includedLabel: 'Included free',
		planNote: 'Demo prices shown per year of cover, per device. Nothing is charged.',
		notCoveredTitle: 'What is never covered',
		notCovered: [
			'Loss or theft',
			'Deliberate damage',
			'Wear from normal use, such as scratched screens from everyday handling',
			'Software issues or data loss'
		],
		ctaTitle: 'Questions about cover?',
		ctaText: 'Read the help centre or ask the demo support team — nothing you send leaves your device.',
		helpLink: 'Visit the help centre',
		contactLink: 'Contact us'
	},
	cookiesPage: {
		title: 'Cookie and storage policy',
		description:
			'An honest account of what TechDova stores in your browser: no cookies, no trackers, only local demo data.',
		updated: 'Last updated: 17 November 2026',
		intro:
			'TechDova is a fully static demo storefront. It sets no cookies — not for tracking, analytics, advertising or anything else. This page lists everything the site stores in your browser, and why.',
		noCookiesTitle: 'No cookies, no trackers',
		noCookiesText:
			'No first-party or third-party cookies are set, no analytics script runs and no request is made to any external server for tracking. The site works fully offline once loaded. Because there are no trackers, there is nothing to opt out of: accepting or declining the cookie banner changes nothing about tracking.',
		storageTitle: 'What is stored in your browser',
		storageIntro:
			'The site uses your browser’s localStorage (and one sessionStorage entry) so the demo remembers your choices between visits. All of it stays on your device and can be cleared below or from your browser settings.',
		storageRows: [
			{ key: 'techdova-cart', purpose: 'Your cart contents, so items stay in your cart between visits.' },
			{ key: 'techdova-promo', purpose: 'The promo code applied to your cart, so the discount survives reloads.' },
			{ key: 'techdova-wishlist', purpose: 'Products you saved to your wishlist.' },
			{ key: 'techdova-compare', purpose: 'Products on your compare list.' },
			{
				key: 'techdova-orders',
				purpose: 'Demo orders placed in this browser, shown on the account and track-order pages.'
			},
			{ key: 'techdova-account', purpose: 'Your demo account name and email (no password is ever stored).' },
			{ key: 'techdova-addresses', purpose: 'Delivery addresses you saved for the demo checkout.' },
			{ key: 'techdova-recently-viewed', purpose: 'Products you recently viewed, for the recently-viewed strip.' },
			{
				key: 'techdova-review-votes',
				purpose: 'Which demo reviews you marked as helpful, so a vote cannot be repeated.'
			},
			{
				key: 'techdova-locale',
				purpose: 'Your language choice (English or French), so the landing page can honour it.'
			},
			{ key: 'techdova-theme', purpose: 'Your light/dark theme choice.' },
			{ key: 'techdova-cookie-consent', purpose: 'Your cookie-banner choice, so the banner does not ask again.' },
			{
				key: 'techdova-checkout',
				purpose: 'A checkout draft kept in sessionStorage (cleared when the tab closes). Card details are never stored.'
			}
		],
		choicesTitle: 'Your choices',
		choicesText:
			'You can re-open the cookie settings at any time from the “Cookie settings” link in the footer. Clearing your stored data below removes everything listed above from this browser.',
		clearData: 'Clear my stored data',
		clearDataDone:
			'Stored data cleared. Your cart, wishlist, theme, language and other demo data were removed from this browser.',
		browserText:
			'You can also clear this data from your browser settings at any time: look for “site data” or “storage” for this site.'
	},
	notFound: {
		eyebrow: 'Error 404',
		title: 'Page not found',
		description: 'Sorry, the page you are looking for does not exist or has moved.',
		backHome: 'Back to home',
		searchLabel: 'Search the catalogue',
		searchPlaceholder: 'Search products…',
		searchButton: 'Search',
		bestSellersTitle: 'Our best sellers',
		popularTitle: 'Popular pages'
	}
};
