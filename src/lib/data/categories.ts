import type { LocalizedString } from '#lib/i18n/index';

export const categorySlugs = [
	'smartphones',
	'computers',
	'audio',
	'smartwatches',
	'gaming',
	'accessories'
] as const;

export type CategorySlug = (typeof categorySlugs)[number];

export type Category = {
	slug: CategorySlug;
	name: LocalizedString;
	description: LocalizedString;
	image: string;
	imageAlt: LocalizedString;
};

export const categories: Category[] = [
	{
		slug: 'smartphones',
		name: { en: 'Smartphones', fr: 'Smartphones' },
		description: {
			en: 'The latest phones with pro cameras and all-day battery.',
			fr: 'Les derniers téléphones avec appareils photo pro et batterie toute la journée.'
		},
		image: '/images/category-smartphones.png',
		imageAlt: {
			en: 'Modern smartphone with a blue-green gradient wallpaper',
			fr: 'Smartphone moderne avec fond bleu-vert dégradé'
		}
	},
	{
		slug: 'computers',
		name: { en: 'Computers', fr: 'Ordinateurs' },
		description: {
			en: 'Laptops and ultrabooks for work, study and creativity.',
			fr: 'Ordinateurs portables et ultraportables pour le travail, les études et la création.'
		},
		image: '/images/category-computers.png',
		imageAlt: {
			en: 'Slim silver laptop with a green wave wallpaper',
			fr: 'Ordinateur portable argenté avec fond vert ondulé'
		}
	},
	{
		slug: 'audio',
		name: { en: 'Audio', fr: 'Audio' },
		description: {
			en: 'Headphones and earbuds with rich, immersive sound.',
			fr: 'Casques et écouteurs au son riche et immersif.'
		},
		image: '/images/category-audio.png',
		imageAlt: { en: 'Black over-ear headphones', fr: 'Casque noir' }
	},
	{
		slug: 'smartwatches',
		name: { en: 'Smartwatches', fr: 'Montres connectées' },
		description: {
			en: 'Health, fitness and notifications on your wrist.',
			fr: 'Santé, forme et notifications à votre poignet.'
		},
		image: '/images/category-smartwatches.png',
		imageAlt: {
			en: 'Black smartwatch with a green watch face',
			fr: 'Montre connectée noire avec cadran vert'
		}
	},
	{
		slug: 'gaming',
		name: { en: 'Gaming', fr: 'Gaming' },
		description: {
			en: 'Controllers, consoles and accessories for players.',
			fr: 'Manettes, consoles et accessoires pour les joueurs.'
		},
		image: '/images/category-gaming.png',
		imageAlt: { en: 'Matte black game controller', fr: 'Manette de jeu noire mate' }
	},
	{
		slug: 'accessories',
		name: { en: 'Accessories', fr: 'Accessoires' },
		description: {
			en: 'Chargers, hubs and everyday essentials.',
			fr: 'Chargeurs, concentrateurs et essentiels du quotidien.'
		},
		image: '/images/category-accessories.png',
		imageAlt: {
			en: 'USB-C hub with charger and cable',
			fr: 'Concentrateur USB-C avec chargeur et câble'
		}
	}
];

export function isCategorySlug(value: string): value is CategorySlug {
	return (categorySlugs as readonly string[]).includes(value);
}

export function getCategory(slug: CategorySlug): Category {
	const found = categories.find((c) => c.slug === slug);
	if (!found) throw new Error(`Unknown category: ${slug}`);
	return found;
}
