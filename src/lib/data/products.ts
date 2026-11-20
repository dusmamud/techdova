import type { Locale, LocalizedString } from '#lib/i18n/index';
import { localize } from '#lib/i18n/index';
import { getCategory, type CategorySlug } from './categories';
import { getSynonymCategories } from './search-synonyms';

export type ProductSpec = {
	label: LocalizedString;
	value: LocalizedString;
};

/**
 * A purchasable variant of a product (storage size or colour). `priceDelta`
 * is added to the product base price; `stock` caps that variant's cart
 * quantity. `swatch` is a hex colour for colour variants; `image` is the
 * extensionless image base shown when the variant is selected. Variant data
 * below is demo data.
 */
export type ProductVariant = {
	id: string;
	sku?: string;
	kind: 'storage' | 'color';
	label: LocalizedString;
	priceDelta: number;
	stock: number;
	swatch?: string;
	image?: string;
};

/**
 * Single source of truth for the catalogue. Prices are plain DZD numbers
 * (formatted per locale at render time); names, descriptions, specs and alt
 * text are localized. `badge` is the exact discount label shown on cards.
 * `image` is the primary shot used by cards; `images` holds every gallery
 * angle (extensionless bases), starting with the primary shot.
 */
export type Product = {
	slug: string;
	category: CategorySlug;
	brand: string;
	sku: string;
	name: LocalizedString;
	shortDescription: LocalizedString;
	description: LocalizedString;
	price: number;
	oldPrice?: number;
	badge?: string;
	rating: number;
	reviewCount: number;
	stock: number;
	image: string;
	images: string[];
	imageAlt: LocalizedString;
	specs: ProductSpec[];
	variants?: ProductVariant[];
	inTheBox?: LocalizedString[];
	pairsWellWith?: string[];
	featured?: boolean;
	isNew?: boolean;
};

export const products: Product[] = [
	{
		slug: 'iphone-15-pro',
		category: 'smartphones',
		brand: 'Apple',
		sku: 'TD-IP15P-256',
		name: { en: 'iPhone 15 Pro', fr: 'iPhone 15 Pro' },
		shortDescription: {
			en: 'Titanium design, A17 Pro chip and a pro camera system.',
			fr: 'Design en titane, puce A17 Pro et appareil photo professionnel.'
		},
		description: {
			en: 'The iPhone 15 Pro pairs a lightweight titanium design with the A17 Pro chip for console-class gaming and a 48MP main camera for stunning detail. The Action Button and USB-C make everyday use faster than ever.',
			fr: 'L’iPhone 15 Pro associe un design léger en titane à la puce A17 Pro pour des jeux de qualité console et un appareil photo principal de 48 Mpx d’une netteté saisissante. Le bouton Action et l’USB-C rendent le quotidien plus rapide que jamais.'
		},
		price: 999,
		oldPrice: 1169,
		badge: '-15%',
		rating: 4.8,
		reviewCount: 124,
		stock: 12,
		image: '/images/product-iphone-15-pro',
		images: ['/images/product-iphone-15-pro', '/images/product-iphone-15-pro-2', '/images/product-iphone-15-pro-3'],
		variants: [
			{ id: 'storage-128', sku: 'TD-IP15P-128', kind: 'storage', label: { en: '128 GB', fr: '128 Go' }, priceDelta: -100, stock: 8 },
			{ id: 'storage-256', sku: 'TD-IP15P-256', kind: 'storage', label: { en: '256 GB', fr: '256 Go' }, priceDelta: 0, stock: 12 },
			{ id: 'storage-512', sku: 'TD-IP15P-512', kind: 'storage', label: { en: '512 GB', fr: '512 Go' }, priceDelta: 200, stock: 5 },
		],
		inTheBox: [
			{ en: 'iPhone 15 Pro', fr: 'iPhone 15 Pro' },
			{ en: 'USB-C cable', fr: 'Câble USB-C' },
			{ en: 'SIM ejector tool', fr: 'Outil d’éjection de la carte SIM' },
			{ en: 'Quick start guide', fr: 'Guide de démarrage rapide' },
		],
		pairsWellWith: ['magsafe-charger', 'airpods-pro'],
		imageAlt: {
			en: 'iPhone 15 Pro smartphone in dark titanium showing the triple camera',
			fr: 'Smartphone iPhone 15 Pro en titane sombre montrant le triple appareil photo'
		},
		specs: [
			{ label: { en: 'Display', fr: 'Écran' }, value: { en: '6.1" Super Retina XDR', fr: '6,1" Super Retina XDR' } },
			{ label: { en: 'Chip', fr: 'Puce' }, value: { en: 'A17 Pro', fr: 'A17 Pro' } },
			{ label: { en: 'Storage', fr: 'Stockage' }, value: { en: '256 GB', fr: '256 Go' } },
			{ label: { en: 'Battery', fr: 'Batterie' }, value: { en: 'Up to 23 hours of video', fr: 'Jusqu’à 23 heures de vidéo' } }
		],
		featured: true
	},
	{
		slug: 'galaxy-s24',
		category: 'smartphones',
		brand: 'Samsung',
		sku: 'TD-GS24-256',
		name: { en: 'Samsung Galaxy S24', fr: 'Samsung Galaxy S24' },
		shortDescription: {
			en: 'Galaxy AI, a brilliant 120Hz display and a versatile triple camera.',
			fr: 'Galaxy AI, un superbe écran 120 Hz et un triple appareil photo polyvalent.'
		},
		description: {
			en: 'The Galaxy S24 brings Galaxy AI features, a bright 6.2-inch 120Hz display and a 50MP camera that shines day and night. All-day battery keeps up with everything you do.',
			fr: 'Le Galaxy S24 apporte les fonctions Galaxy AI, un lumineux écran 120 Hz de 6,2 pouces et un appareil photo de 50 Mpx performant de jour comme de nuit. Sa batterie tient toute la journée.'
		},
		price: 899,
		oldPrice: 1049,
		badge: '-14%',
		rating: 4.7,
		reviewCount: 86,
		stock: 14,
		image: '/images/product-galaxy-s24',
		images: ['/images/product-galaxy-s24', '/images/product-galaxy-s24-2', '/images/product-galaxy-s24-3'],
		variants: [
			{ id: 'storage-128', sku: 'TD-GS24-128', kind: 'storage', label: { en: '128 GB', fr: '128 Go' }, priceDelta: -100, stock: 10 },
			{ id: 'storage-256', sku: 'TD-GS24-256', kind: 'storage', label: { en: '256 GB', fr: '256 Go' }, priceDelta: 0, stock: 14 },
			{ id: 'storage-512', sku: 'TD-GS24-512', kind: 'storage', label: { en: '512 GB', fr: '512 Go' }, priceDelta: 180, stock: 6 },
		],
		inTheBox: [
			{ en: 'Samsung Galaxy S24', fr: 'Samsung Galaxy S24' },
			{ en: 'USB-C cable', fr: 'Câble USB-C' },
			{ en: 'SIM ejector tool', fr: 'Outil d’éjection de la carte SIM' },
			{ en: 'Quick start guide', fr: 'Guide de démarrage rapide' },
		],
		pairsWellWith: ['galaxy-watch-6', 'sony-wh1000xm5'],
		imageAlt: {
			en: 'Samsung Galaxy S24 smartphone, front view with green gradient wallpaper',
			fr: 'Smartphone Samsung Galaxy S24, vue de face avec fond vert dégradé'
		},
		specs: [
			{ label: { en: 'Display', fr: 'Écran' }, value: { en: '6.2" Dynamic AMOLED 2X', fr: '6,2" Dynamic AMOLED 2X' } },
			{ label: { en: 'Chip', fr: 'Puce' }, value: { en: 'Snapdragon 8 Gen 3', fr: 'Snapdragon 8 Gen 3' } },
			{ label: { en: 'Storage', fr: 'Stockage' }, value: { en: '256 GB', fr: '256 Go' } },
			{ label: { en: 'Battery', fr: 'Batterie' }, value: { en: '4000 mAh', fr: '4 000 mAh' } }
		],
		isNew: true
	},
	{
		slug: 'macbook-air-m2',
		category: 'computers',
		brand: 'Apple',
		sku: 'TD-MBA-M2-256',
		name: { en: 'MacBook Air M2', fr: 'MacBook Air M2' },
		shortDescription: {
			en: 'Feather-light laptop with the M2 chip and up to 18 hours of battery.',
			fr: 'Ordinateur portable ultraléger avec puce M2 et jusqu’à 18 heures d’autonomie.'
		},
		description: {
			en: 'MacBook Air with M2 is strikingly thin and light, yet powerful enough for work, study and creativity. The Liquid Retina display, silent fanless design and all-day battery make it the perfect everyday laptop.',
			fr: 'Le MacBook Air avec puce M2 est remarquablement fin et léger, tout en étant assez puissant pour le travail, les études et la création. Son écran Liquid Retina, son design silencieux sans ventilateur et sa batterie toute la journée en font le portable idéal au quotidien.'
		},
		price: 1299,
		oldPrice: 1449,
		badge: '-10%',
		rating: 4.9,
		reviewCount: 98,
		stock: 9,
		image: '/images/product-macbook-air-m2',
		images: ['/images/product-macbook-air-m2', '/images/product-macbook-air-m2-2', '/images/product-macbook-air-m2-3'],
		variants: [
			{ id: 'storage-256', sku: 'TD-MBA-M2-256', kind: 'storage', label: { en: '256 GB', fr: '256 Go' }, priceDelta: 0, stock: 9 },
			{ id: 'storage-512', sku: 'TD-MBA-M2-512', kind: 'storage', label: { en: '512 GB', fr: '512 Go' }, priceDelta: 200, stock: 6 },
			{ id: 'storage-1tb', sku: 'TD-MBA-M2-1TB', kind: 'storage', label: { en: '1 TB', fr: '1 To' }, priceDelta: 400, stock: 3 },
		],
		inTheBox: [
			{ en: 'MacBook Air M2', fr: 'MacBook Air M2' },
			{ en: '30W USB-C power adapter', fr: 'Adaptateur secteur USB-C 30 W' },
			{ en: 'USB-C to MagSafe 3 cable', fr: 'Câble USB-C vers MagSafe 3' },
			{ en: 'Quick start guide', fr: 'Guide de démarrage rapide' },
		],
		pairsWellWith: ['usb-c-hub', 'sony-wh1000xm5'],
		imageAlt: {
			en: 'Silver MacBook Air M2 laptop open showing a green wave wallpaper',
			fr: 'Ordinateur portable argenté MacBook Air M2 ouvert affichant un fond vert ondulé'
		},
		specs: [
			{ label: { en: 'Display', fr: 'Écran' }, value: { en: '13.6" Liquid Retina', fr: '13,6" Liquid Retina' } },
			{ label: { en: 'Chip', fr: 'Puce' }, value: { en: 'Apple M2', fr: 'Apple M2' } },
			{ label: { en: 'Memory', fr: 'Mémoire' }, value: { en: '8 GB unified', fr: '8 Go unifiée' } },
			{ label: { en: 'Storage', fr: 'Stockage' }, value: { en: '256 GB SSD', fr: '256 Go SSD' } }
		],
		featured: true
	},
	{
		slug: 'dell-xps-13',
		category: 'computers',
		brand: 'Dell',
		sku: 'TD-XPS13-I7',
		name: { en: 'Dell XPS 13', fr: 'Dell XPS 13' },
		shortDescription: {
			en: 'Premium ultrabook with an edge-to-edge display and Intel Core power.',
			fr: 'Ultraportable premium avec écran bord à bord et puissance Intel Core.'
		},
		description: {
			en: 'The XPS 13 combines a compact aluminium chassis with a stunning edge-to-edge display and the latest Intel Core processor. Ideal for professionals who want power without the weight.',
			fr: 'Le XPS 13 combine un châssis aluminium compact avec un superbe écran bord à bord et le dernier processeur Intel Core. Idéal pour les professionnels qui veulent de la puissance sans le poids.'
		},
		price: 1499,
		oldPrice: 1699,
		badge: '-12%',
		rating: 4.8,
		reviewCount: 54,
		stock: 3,
		image: '/images/product-dell-xps-13',
		images: ['/images/product-dell-xps-13', '/images/product-dell-xps-13-2', '/images/product-dell-xps-13-3'],
		variants: [
			{ id: 'storage-512', kind: 'storage', label: { en: '512 GB', fr: '512 Go' }, priceDelta: 0, stock: 3 },
			{ id: 'storage-1tb', kind: 'storage', label: { en: '1 TB', fr: '1 To' }, priceDelta: 200, stock: 2 },
		],
		inTheBox: [
			{ en: 'Dell XPS 13', fr: 'Dell XPS 13' },
			{ en: '60W USB-C power adapter', fr: 'Adaptateur secteur USB-C 60 W' },
			{ en: 'USB-C cable', fr: 'Câble USB-C' },
			{ en: 'Quick start guide', fr: 'Guide de démarrage rapide' },
		],
		pairsWellWith: ['usb-c-hub', 'sony-wh1000xm5'],
		imageAlt: {
			en: 'Dark grey Dell XPS 13 laptop open, front view',
			fr: 'Ordinateur portable gris foncé Dell XPS 13 ouvert, vue de face'
		},
		specs: [
			{ label: { en: 'Display', fr: 'Écran' }, value: { en: '13.4" Full HD+', fr: '13,4" Full HD+' } },
			{ label: { en: 'Processor', fr: 'Processeur' }, value: { en: 'Intel Core i7', fr: 'Intel Core i7' } },
			{ label: { en: 'Memory', fr: 'Mémoire' }, value: { en: '16 GB', fr: '16 Go' } },
			{ label: { en: 'Storage', fr: 'Stockage' }, value: { en: '512 GB SSD', fr: '512 Go SSD' } }
		]
	},
	{
		slug: 'airpods-pro',
		category: 'audio',
		brand: 'Apple',
		sku: 'TD-APP-USBC',
		name: { en: 'AirPods Pro', fr: 'AirPods Pro' },
		shortDescription: {
			en: 'Active noise cancellation and personalised spatial audio.',
			fr: 'Réduction active du bruit et audio spatial personnalisé.'
		},
		description: {
			en: 'AirPods Pro deliver up to twice the noise cancellation, adaptive transparency and rich, detailed sound. The MagSafe charging case keeps them ready for up to 30 hours of listening.',
			fr: 'Les AirPods Pro offrent jusqu’à deux fois plus de réduction du bruit, un mode transparence adaptatif et un son riche et détaillé. Le boîtier de charge MagSafe les garde prêts pour jusqu’à 30 heures d’écoute.'
		},
		price: 649,
		oldPrice: 819,
		badge: '-20%',
		rating: 4.7,
		reviewCount: 76,
		stock: 20,
		image: '/images/product-airpods-pro',
		images: ['/images/product-airpods-pro', '/images/product-airpods-pro-2', '/images/product-airpods-pro-3'],
		variants: [
			{ id: 'color-white', kind: 'color', label: { en: 'White', fr: 'Blanc' }, priceDelta: 0, stock: 20, swatch: '#f5f5f4' },
			{ id: 'color-black', kind: 'color', label: { en: 'Black', fr: 'Noir' }, priceDelta: 0, stock: 9, swatch: '#1c1c1e' },
		],
		inTheBox: [
			{ en: 'AirPods Pro', fr: 'AirPods Pro' },
			{ en: 'MagSafe charging case', fr: 'Boîtier de charge MagSafe' },
			{ en: 'Silicone ear tips in four sizes', fr: 'Embouts en silicone en quatre tailles' },
			{ en: 'USB-C cable', fr: 'Câble USB-C' },
			{ en: 'Quick start guide', fr: 'Guide de démarrage rapide' },
		],
		pairsWellWith: ['magsafe-charger', 'iphone-15-pro'],
		imageAlt: {
			en: 'White AirPods Pro earbuds beside their open charging case',
			fr: 'Écouteurs blancs AirPods Pro à côté de leur boîtier de charge ouvert'
		},
		specs: [
			{ label: { en: 'Noise cancellation', fr: 'Réduction du bruit' }, value: { en: 'Active, up to 2x', fr: 'Active, jusqu’à 2x' } },
			{ label: { en: 'Battery', fr: 'Batterie' }, value: { en: 'Up to 6 hours (30 with case)', fr: 'Jusqu’à 6 heures (30 avec le boîtier)' } },
			{ label: { en: 'Charging', fr: 'Charge' }, value: { en: 'MagSafe + USB-C', fr: 'MagSafe + USB-C' } },
			{ label: { en: 'Water resistance', fr: 'Résistance à l’eau' }, value: { en: 'IP54', fr: 'IP54' } }
		],
		featured: true
	},
	{
		slug: 'sony-wh1000xm5',
		category: 'audio',
		brand: 'Sony',
		sku: 'TD-WH1000XM5',
		name: { en: 'Sony WH-1000XM5', fr: 'Sony WH-1000XM5' },
		shortDescription: {
			en: 'Industry-leading noise cancelling with 30-hour battery life.',
			fr: 'Réduction de bruit de référence avec 30 heures d’autonomie.'
		},
		description: {
			en: 'The WH-1000XM5 sets the standard for wireless headphones: best-in-class noise cancelling, crystal-clear calls and 30 hours of battery. Plush earcups make long listening sessions effortless.',
			fr: 'Le WH-1000XM5 établit la référence des casques sans fil : réduction de bruit de premier ordre, appels cristallins et 30 heures de batterie. Ses coussinets moelleux rendent les longues écoutes confortables.'
		},
		price: 749,
		oldPrice: 899,
		badge: '-17%',
		rating: 4.9,
		reviewCount: 112,
		stock: 11,
		image: '/images/product-sony-wh1000xm5',
		images: ['/images/product-sony-wh1000xm5', '/images/product-sony-wh1000xm5-2', '/images/product-sony-wh1000xm5-3'],
		variants: [
			{ id: 'color-black', kind: 'color', label: { en: 'Black', fr: 'Noir' }, priceDelta: 0, stock: 11, swatch: '#111111' },
			{ id: 'color-silver', kind: 'color', label: { en: 'Silver', fr: 'Argent' }, priceDelta: 0, stock: 0, swatch: '#c0c0c0' },
			{ id: 'color-midnight-blue', kind: 'color', label: { en: 'Midnight Blue', fr: 'Bleu nuit' }, priceDelta: 20, stock: 6, swatch: '#1f2a44' },
		],
		inTheBox: [
			{ en: 'Sony WH-1000XM5', fr: 'Sony WH-1000XM5' },
			{ en: 'Carrying case', fr: 'Étui de transport' },
			{ en: 'Headphone cable', fr: 'Câble pour casque' },
			{ en: 'USB-C cable', fr: 'Câble USB-C' },
			{ en: 'Quick start guide', fr: 'Guide de démarrage rapide' },
		],
		pairsWellWith: ['iphone-15-pro', 'macbook-air-m2'],
		imageAlt: {
			en: 'Black Sony WH-1000XM5 over-ear headphones',
			fr: 'Casque noir Sony WH-1000XM5'
		},
		specs: [
			{ label: { en: 'Battery', fr: 'Batterie' }, value: { en: '30 hours', fr: '30 heures' } },
			{ label: { en: 'Drivers', fr: 'Transducteurs' }, value: { en: '30 mm', fr: '30 mm' } },
			{ label: { en: 'Bluetooth', fr: 'Bluetooth' }, value: { en: '5.2', fr: '5.2' } },
			{ label: { en: 'Weight', fr: 'Poids' }, value: { en: '250 g', fr: '250 g' } }
		],
		isNew: true
	},
	{
		slug: 'galaxy-watch-6',
		category: 'smartwatches',
		brand: 'Samsung',
		sku: 'TD-GWATCH6',
		name: { en: 'Samsung Galaxy Watch 6', fr: 'Samsung Galaxy Watch 6' },
		shortDescription: {
			en: 'Advanced health tracking on a bright, larger display.',
			fr: 'Suivi de santé avancé sur un écran plus grand et lumineux.'
		},
		description: {
			en: 'Galaxy Watch 6 tracks sleep, fitness and heart health with advanced sensors, on a 20% larger display. Stay connected, pay and navigate right from your wrist.',
			fr: 'La Galaxy Watch 6 suit le sommeil, la forme et la santé cardiaque grâce à des capteurs avancés, sur un écran 20 % plus grand. Restez connecté, payez et naviguez depuis votre poignet.'
		},
		price: 699,
		oldPrice: 790,
		badge: '-12%',
		rating: 4.6,
		reviewCount: 63,
		stock: 15,
		image: '/images/product-galaxy-watch-6',
		images: ['/images/product-galaxy-watch-6', '/images/product-galaxy-watch-6-2', '/images/product-galaxy-watch-6-3'],
		variants: [
			{ id: 'color-graphite', kind: 'color', label: { en: 'Graphite', fr: 'Graphite' }, priceDelta: 0, stock: 15, swatch: '#2b2b2e' },
			{ id: 'color-silver', kind: 'color', label: { en: 'Silver', fr: 'Argent' }, priceDelta: 0, stock: 7, swatch: '#d8d8d8' },
			{ id: 'color-gold', kind: 'color', label: { en: 'Gold', fr: 'Or' }, priceDelta: 30, stock: 4, swatch: '#d4af7a' },
		],
		inTheBox: [
			{ en: 'Samsung Galaxy Watch 6', fr: 'Samsung Galaxy Watch 6' },
			{ en: 'Sport band', fr: 'Bracelet sport' },
			{ en: 'Wireless charger', fr: 'Chargeur sans fil' },
			{ en: 'Quick start guide', fr: 'Guide de démarrage rapide' },
		],
		pairsWellWith: ['galaxy-s24', 'sony-wh1000xm5'],
		imageAlt: {
			en: 'Black Samsung Galaxy Watch 6 with a dark green watch face',
			fr: 'Montre connectée noire Samsung Galaxy Watch 6 avec cadran vert foncé'
		},
		specs: [
			{ label: { en: 'Display', fr: 'Écran' }, value: { en: '1.5" Super AMOLED', fr: '1,5" Super AMOLED' } },
			{ label: { en: 'Battery', fr: 'Batterie' }, value: { en: 'Up to 40 hours', fr: 'Jusqu’à 40 heures' } },
			{ label: { en: 'Water resistance', fr: 'Résistance à l’eau' }, value: { en: '5 ATM', fr: '5 ATM' } },
			{ label: { en: 'Sensors', fr: 'Capteurs' }, value: { en: 'Heart rate, sleep, GPS', fr: 'Fréquence cardiaque, sommeil, GPS' } }
		],
		featured: true
	},
	{
		slug: 'apple-watch-9',
		category: 'smartwatches',
		brand: 'Apple',
		sku: 'TD-AW9',
		name: { en: 'Apple Watch Series 9', fr: 'Apple Watch Series 9' },
		shortDescription: {
			en: 'Brighter display, Double Tap gesture and powerful health features.',
			fr: 'Écran plus lumineux, geste Double Tap et puissantes fonctions santé.'
		},
		description: {
			en: 'Apple Watch Series 9 introduces the Double Tap gesture, a brighter display and the S9 chip for faster performance. Track workouts, sleep and heart health with precision.',
			fr: 'L’Apple Watch Series 9 introduit le geste Double Tap, un écran plus lumineux et la puce S9 pour des performances plus rapides. Suivez vos entraînements, votre sommeil et votre santé cardiaque avec précision.'
		},
		price: 799,
		oldPrice: 949,
		badge: '-16%',
		rating: 4.8,
		reviewCount: 91,
		stock: 8,
		image: '/images/product-apple-watch-9',
		images: ['/images/product-apple-watch-9', '/images/product-apple-watch-9-2', '/images/product-apple-watch-9-3'],
		variants: [
			{ id: 'color-midnight', kind: 'color', label: { en: 'Midnight', fr: 'Minuit' }, priceDelta: 0, stock: 8, swatch: '#1c1e24' },
			{ id: 'color-starlight', kind: 'color', label: { en: 'Starlight', fr: 'Lumière stellaire' }, priceDelta: 0, stock: 6, swatch: '#e8ddd0' },
			{ id: 'color-red', kind: 'color', label: { en: '(PRODUCT)RED', fr: '(PRODUCT)RED' }, priceDelta: 0, stock: 3, swatch: '#b91c1c' },
		],
		inTheBox: [
			{ en: 'Apple Watch Series 9', fr: 'Apple Watch Series 9' },
			{ en: 'Sport band', fr: 'Bracelet sport' },
			{ en: 'Magnetic fast charger to USB-C cable', fr: 'Câble de charge rapide magnétique vers USB-C' },
			{ en: 'Quick start guide', fr: 'Guide de démarrage rapide' },
		],
		pairsWellWith: ['iphone-15-pro', 'airpods-pro'],
		imageAlt: {
			en: 'Smartwatch with a light band and bright gradient watch face',
			fr: 'Montre connectée avec bracelet clair et cadran dégradé lumineux'
		},
		specs: [
			{ label: { en: 'Display', fr: 'Écran' }, value: { en: '1.9" Retina, 2000 nits', fr: '1,9" Retina, 2000 nits' } },
			{ label: { en: 'Chip', fr: 'Puce' }, value: { en: 'S9 SiP', fr: 'S9 SiP' } },
			{ label: { en: 'Battery', fr: 'Batterie' }, value: { en: 'Up to 18 hours', fr: 'Jusqu’à 18 heures' } },
			{ label: { en: 'Water resistance', fr: 'Résistance à l’eau' }, value: { en: '50 m', fr: '50 m' } }
		],
		isNew: true
	},
	{
		slug: 'dualsense-controller',
		category: 'gaming',
		brand: 'PlayStation',
		sku: 'TD-DUALSENSE',
		name: { en: 'DualSense Controller', fr: 'Manette DualSense' },
		shortDescription: {
			en: 'Haptic feedback and adaptive triggers for deeper immersion.',
			fr: 'Retour haptique et gâchettes adaptatives pour une immersion totale.'
		},
		description: {
			en: 'The DualSense controller brings haptic feedback, adaptive triggers and a built-in microphone to your games. Feel every recoil, impact and surface under your fingers.',
			fr: 'La manette DualSense apporte le retour haptique, les gâchettes adaptatives et un microphone intégré à vos jeux. Ressentez chaque recul, impact et surface sous vos doigts.'
		},
		price: 189,
		oldPrice: 229,
		badge: '-17%',
		rating: 4.8,
		reviewCount: 203,
		stock: 25,
		image: '/images/product-dualsense-controller',
		images: ['/images/product-dualsense-controller', '/images/product-dualsense-controller-2', '/images/product-dualsense-controller-3'],
		variants: [
			{ id: 'color-white', kind: 'color', label: { en: 'White', fr: 'Blanc' }, priceDelta: 0, stock: 25, swatch: '#f2f2f2' },
			{ id: 'color-midnight-black', kind: 'color', label: { en: 'Midnight Black', fr: 'Noir minuit' }, priceDelta: 0, stock: 12, swatch: '#17171a' },
			{ id: 'color-cosmic-red', kind: 'color', label: { en: 'Cosmic Red', fr: 'Rouge cosmique' }, priceDelta: 10, stock: 8, swatch: '#a31621' },
		],
		inTheBox: [
			{ en: 'DualSense controller', fr: 'Manette DualSense' },
			{ en: 'USB-C cable', fr: 'Câble USB-C' },
			{ en: 'Quick start guide', fr: 'Guide de démarrage rapide' },
		],
		pairsWellWith: ['nintendo-switch', 'sony-wh1000xm5'],
		imageAlt: {
			en: 'White and black DualSense game controller',
			fr: 'Manette de jeu DualSense blanche et noire'
		},
		specs: [
			{ label: { en: 'Connectivity', fr: 'Connectivité' }, value: { en: 'Bluetooth + USB-C', fr: 'Bluetooth + USB-C' } },
			{ label: { en: 'Battery', fr: 'Batterie' }, value: { en: 'Up to 12 hours', fr: 'Jusqu’à 12 heures' } },
			{ label: { en: 'Features', fr: 'Fonctions' }, value: { en: 'Haptic feedback, adaptive triggers', fr: 'Retour haptique, gâchettes adaptatives' } },
			{ label: { en: 'Weight', fr: 'Poids' }, value: { en: '280 g', fr: '280 g' } }
		]
	},
	{
		slug: 'nintendo-switch',
		category: 'gaming',
		brand: 'Nintendo',
		sku: 'TD-NSW-32GB',
		name: { en: 'Nintendo Switch', fr: 'Nintendo Switch' },
		shortDescription: {
			en: 'Play at home on TV or on the go — one console, endless fun.',
			fr: 'Jouez à la maison sur TV ou en déplacement — une console, un plaisir sans fin.'
		},
		description: {
			en: 'Nintendo Switch transforms from a home console to a handheld in seconds. With detachable controllers and a huge game library, it is made for solo adventures and family game nights alike.',
			fr: 'La Nintendo Switch passe de console de salon à console portable en quelques secondes. Avec ses manettes détachables et une immense ludothèque, elle est faite pour les aventures en solo comme pour les soirées jeux en famille.'
		},
		price: 1099,
		oldPrice: 1249,
		badge: '-12%',
		rating: 4.9,
		reviewCount: 167,
		stock: 7,
		image: '/images/product-nintendo-switch',
		images: ['/images/product-nintendo-switch', '/images/product-nintendo-switch-2', '/images/product-nintendo-switch-3'],
		variants: [
			{ id: 'color-neon', kind: 'color', label: { en: 'Neon Blue / Neon Red', fr: 'Bleu néon / rouge néon' }, priceDelta: 0, stock: 7, swatch: '#3b82f6' },
			{ id: 'color-grey', kind: 'color', label: { en: 'Grey', fr: 'Gris' }, priceDelta: 0, stock: 5, swatch: '#6b7280' },
		],
		inTheBox: [
			{ en: 'Nintendo Switch console', fr: 'Console Nintendo Switch' },
			{ en: 'Joy-Con controllers', fr: 'Manettes Joy-Con' },
			{ en: 'Nintendo Switch dock', fr: 'Station d’accueil Nintendo Switch' },
			{ en: 'HDMI cable', fr: 'Câble HDMI' },
			{ en: 'AC adapter', fr: 'Adaptateur secteur' },
		],
		pairsWellWith: ['dualsense-controller', 'sony-wh1000xm5'],
		imageAlt: {
			en: 'Handheld Nintendo Switch console with attached controllers',
			fr: 'Console portable Nintendo Switch avec manettes attachées'
		},
		specs: [
			{ label: { en: 'Display', fr: 'Écran' }, value: { en: '6.2" LCD', fr: '6,2" LCD' } },
			{ label: { en: 'Battery', fr: 'Batterie' }, value: { en: '4.5–9 hours', fr: '4,5–9 heures' } },
			{ label: { en: 'Storage', fr: 'Stockage' }, value: { en: '32 GB', fr: '32 Go' } },
			{ label: { en: 'Modes', fr: 'Modes' }, value: { en: 'TV, tabletop, handheld', fr: 'TV, sur table, portable' } }
		],
		isNew: true
	},
	{
		slug: 'magsafe-charger',
		category: 'accessories',
		brand: 'Apple',
		sku: 'TD-MAGSAFE-15W',
		name: { en: 'MagSafe Charger', fr: 'Chargeur MagSafe' },
		shortDescription: {
			en: 'Snap-on magnetic wireless charging at up to 15W.',
			fr: 'Charge sans fil magnétique à clipser, jusqu’à 15 W.'
		},
		description: {
			en: 'The MagSafe charger snaps perfectly into place for fast, efficient wireless charging up to 15W. Its compact design travels anywhere and works with MagSafe cases.',
			fr: 'Le chargeur MagSafe se clipse parfaitement en place pour une charge sans fil rapide et efficace jusqu’à 15 W. Son design compact voyage partout et fonctionne avec les coques MagSafe.'
		},
		price: 99,
		oldPrice: 129,
		badge: '-23%',
		rating: 4.5,
		reviewCount: 78,
		stock: 30,
		image: '/images/product-magsafe-charger',
		images: ['/images/product-magsafe-charger', '/images/product-magsafe-charger-2', '/images/product-magsafe-charger-3'],
		variants: [
			{ id: 'color-white', kind: 'color', label: { en: 'White', fr: 'Blanc' }, priceDelta: 0, stock: 30, swatch: '#f5f5f4' },
			{ id: 'color-midnight', kind: 'color', label: { en: 'Midnight', fr: 'Minuit' }, priceDelta: 10, stock: 12, swatch: '#26262b' },
		],
		inTheBox: [
			{ en: 'MagSafe Charger', fr: 'Chargeur MagSafe' },
			{ en: 'Integrated USB-C cable (1 m)', fr: 'Câble USB-C intégré (1 m)' },
			{ en: 'Quick start guide', fr: 'Guide de démarrage rapide' },
		],
		pairsWellWith: ['iphone-15-pro', 'airpods-pro'],
		imageAlt: {
			en: 'White round MagSafe magnetic charging puck with coiled cable',
			fr: 'Chargeur magnétique rond blanc MagSafe avec câble enroulé'
		},
		specs: [
			{ label: { en: 'Power', fr: 'Puissance' }, value: { en: 'Up to 15W', fr: 'Jusqu’à 15 W' } },
			{ label: { en: 'Cable', fr: 'Câble' }, value: { en: 'USB-C, 1 m', fr: 'USB-C, 1 m' } },
			{ label: { en: 'Compatibility', fr: 'Compatibilité' }, value: { en: 'MagSafe phones and cases', fr: 'Téléphones et coques MagSafe' } },
			{ label: { en: 'Weight', fr: 'Poids' }, value: { en: '45 g', fr: '45 g' } }
		]
	},
	{
		slug: 'usb-c-hub',
		category: 'accessories',
		brand: 'TechDova',
		sku: 'TD-HUB-7IN1',
		name: { en: 'USB-C Hub 7-in-1', fr: 'Concentrateur USB-C 7-en-1' },
		shortDescription: {
			en: 'Seven ports in one slim aluminium hub: HDMI, USB and more.',
			fr: 'Sept ports dans un concentrateur aluminium compact : HDMI, USB et plus.'
		},
		description: {
			en: 'Expand a single USB-C port into seven: 4K HDMI, three USB-A ports, SD/microSD readers and 100W pass-through charging. The slim aluminium hub is built for desks and travel alike.',
			fr: 'Transformez un seul port USB-C en sept : HDMI 4K, trois ports USB-A, lecteurs SD/microSD et charge pass-through 100 W. Le concentrateur aluminium compact est conçu pour le bureau comme pour les déplacements.'
		},
		price: 149,
		oldPrice: 189,
		badge: '-21%',
		rating: 4.6,
		reviewCount: 45,
		stock: 0,
		image: '/images/product-usb-c-hub',
		images: ['/images/product-usb-c-hub', '/images/product-usb-c-hub-2', '/images/product-usb-c-hub-3'],
		variants: [
			{ id: 'color-space-grey', kind: 'color', label: { en: 'Space Grey', fr: 'Gris sidéral' }, priceDelta: 0, stock: 0, swatch: '#4b4b4f' },
			{ id: 'color-silver', kind: 'color', label: { en: 'Silver', fr: 'Argent' }, priceDelta: 0, stock: 0, swatch: '#d1d1d6' },
		],
		inTheBox: [
			{ en: 'USB-C Hub 7-in-1', fr: 'Concentrateur USB-C 7-en-1' },
			{ en: 'Travel pouch', fr: 'Pochette de transport' },
			{ en: 'Quick start guide', fr: 'Guide de démarrage rapide' },
		],
		pairsWellWith: ['macbook-air-m2', 'dell-xps-13'],
		imageAlt: {
			en: 'Dark grey aluminium USB-C hub with ports and short cable',
			fr: 'Concentrateur USB-C aluminium gris foncé avec ports et câble court'
		},
		specs: [
			{ label: { en: 'Ports', fr: 'Ports' }, value: { en: '7-in-1: HDMI, 3x USB-A, SD, microSD, USB-C', fr: '7-en-1 : HDMI, 3x USB-A, SD, microSD, USB-C' } },
			{ label: { en: 'Video', fr: 'Vidéo' }, value: { en: '4K @ 60Hz', fr: '4K @ 60 Hz' } },
			{ label: { en: 'Charging', fr: 'Charge' }, value: { en: '100W pass-through', fr: '100 W pass-through' } },
			{ label: { en: 'Material', fr: 'Matériau' }, value: { en: 'Aluminium', fr: 'Aluminium' } }
		]
	}
];

export function getProduct(slug: string): Product | undefined {
	return products.find((p) => p.slug === slug);
}

/** Find a variant by id, or undefined for the default (no-variant) choice. */
export function getVariant(product: Product, variantId: string | undefined): ProductVariant | undefined {
	if (!variantId) return undefined;
	return (product.variants ?? []).find((v) => v.id === variantId);
}

/** Price of a product with a variant applied: base price + priceDelta. */
export function variantPrice(product: Product, variant: ProductVariant | undefined): number {
	return product.price + (variant?.priceDelta ?? 0);
}

/**
 * The default variant: the one priced at the product base price
 * (priceDelta 0), so PDP and QuickView show the same price as the cards
 * until the shopper picks another option. Falls back to the first variant
 * when no variant is priced at base (no catalogue product does this today).
 */
export function getDefaultVariant(product: Product): ProductVariant | undefined {
	const variants = product.variants ?? [];
	return variants.find((v) => v.priceDelta === 0) ?? variants[0];
}

/** Unique brands in first-seen catalogue order. */
export function getBrands(): string[] {
	return [...new Set(products.map((p) => p.brand))];
}

export function getProductsByBrand(brand: string): Product[] {
	return products.filter((p) => p.brand === brand);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
	return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
	return products.filter((p) => p.featured);
}

export function getNewProducts(): Product[] {
	return products.filter((p) => p.isNew);
}

function discountPercent(product: Product): number {
	if (!product.badge || !product.oldPrice) return 0;
	return ((product.oldPrice - product.price) / product.oldPrice) * 100;
}

/** Discounted products (badge + oldPrice), largest discount first. */
export function getDiscountedProducts(): Product[] {
	return products
		.filter((p) => p.badge && p.oldPrice)
		.sort((a, b) => discountPercent(b) - discountPercent(a));
}

/** Complementary categories for "pairs well with" suggestions. */
const pairsWellWithMap: Record<CategorySlug, CategorySlug[]> = {
	smartphones: ['accessories', 'audio'],
	computers: ['accessories'],
	audio: ['smartphones'],
	smartwatches: ['smartphones'],
	gaming: ['audio'],
	accessories: ['computers']
};

/** Complementary-category products first, then the rest, never the product itself. */
export function getPairsWellWith(product: Product, count = 3): Product[] {
	const complements = pairsWellWithMap[product.category] ?? [];
	const paired = products.filter(
		(p) => p.slug !== product.slug && complements.includes(p.category)
	);
	const others = products.filter(
		(p) => p.slug !== product.slug && !complements.includes(p.category)
	);
	return [...paired, ...others].slice(0, count);
}

/** Same-category products first, then the rest, never the product itself. */
export function getRelatedProducts(product: Product, count = 4): Product[] {
	const sameCategory = products.filter(
		(p) => p.slug !== product.slug && p.category === product.category
	);
	const others = products.filter((p) => p.slug !== product.slug && p.category !== product.category);
	return [...sameCategory, ...others].slice(0, count);
}

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export type FilterOptions = {
	query?: string;
	category?: CategorySlug | null;
	maxPrice?: number | null;
	brands?: string[];
	minRating?: number | null;
	inStockOnly?: boolean;
	onSaleOnly?: boolean;
};

export function filterProducts(items: Product[], options: FilterOptions, locale: Locale): Product[] {
	const query = (options.query ?? '').trim().toLowerCase();
	return items.filter((product) => {
		if (options.category && product.category !== options.category) return false;
		if (options.maxPrice != null && product.price > options.maxPrice) return false;
		if (options.brands?.length && !options.brands.includes(product.brand)) return false;
		if (options.minRating != null && product.rating < options.minRating) return false;
		if (options.inStockOnly && product.stock <= 0) return false;
		if (options.onSaleOnly && !(product.oldPrice && product.oldPrice > product.price)) return false;
		if (!query) return true;
		const haystack = [
			localize(product.name, locale),
			localize(product.shortDescription, locale),
			localize(product.description, locale),
			localize(getCategory(product.category).name, locale)
		]
			.join(' ')
			.toLowerCase();
		// Each word matches literally or via a category synonym (see
		// search-synonyms.ts); every word must match (AND semantics).
		return query
			.split(/\s+/)
			.every(
				(word) => haystack.includes(word) || getSynonymCategories(word).includes(product.category)
			);
	});
}

export function sortProducts(items: Product[], sort: SortKey): Product[] {
	const copy = [...items];
	switch (sort) {
		case 'price-asc':
			return copy.sort((a, b) => a.price - b.price);
		case 'price-desc':
			return copy.sort((a, b) => b.price - a.price);
		case 'rating':
			return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
		default:
			return copy;
	}
}

export const MAX_PRODUCT_PRICE = Math.max(...products.map((p) => p.price));
