import type { LocalizedString } from '#lib/i18n/index';

/**
 * Fictional demo testimonials from everyday customers. No photos: the
 * component renders CSS initials-circle avatars.
 */
export type Testimonial = {
	name: LocalizedString;
	role: LocalizedString;
	city: LocalizedString;
	rating: number;
	quote: LocalizedString;
};

export const testimonials: Testimonial[] = [
	{
		name: { en: 'Amira Benali', fr: 'Amira Benali' },
		role: { en: 'Teacher', fr: 'Enseignante' },
		city: { en: 'Algiers', fr: 'Alger' },
		rating: 5,
		quote: {
			en: 'I ordered a laptop for my classes and it arrived in two days, carefully packed. The product was exactly as described — I will definitely shop here again.',
			fr: 'J’ai commandé un ordinateur portable pour mes cours et il est arrivé en deux jours, soigneusement emballé. Le produit était exactement comme décrit — je commanderai à nouveau ici sans hésiter.'
		}
	},
	{
		name: { en: 'Yacine Kaci', fr: 'Yacine Kaci' },
		role: { en: 'University student', fr: 'Étudiant à l’université' },
		city: { en: 'Oran', fr: 'Oran' },
		rating: 5,
		quote: {
			en: 'As a student I compare prices everywhere, and TechDova had the best deal on my earbuds. Clear prices, no surprises, and the delivery tracking actually worked.',
			fr: 'En tant qu’étudiant, je compare les prix partout, et TechDova proposait la meilleure offre pour mes écouteurs. Des prix clairs, sans surprises, et le suivi de livraison fonctionnait vraiment.'
		}
	},
	{
		name: { en: 'Lina Mansouri', fr: 'Lina Mansouri' },
		role: { en: 'Graphic designer', fr: 'Graphiste' },
		city: { en: 'Constantine', fr: 'Constantine' },
		rating: 4,
		quote: {
			en: 'The headphones I bought sound wonderful and the return policy gave me confidence to try them. Support answered my question the same day, in French.',
			fr: 'Le casque que j’ai acheté offre un son merveilleux et la politique de retour m’a donné confiance pour l’essayer. Le support a répondu à ma question le jour même, en français.'
		}
	},
	{
		name: { en: 'Sofiane Haddad', fr: 'Sofiane Haddad' },
		role: { en: 'Software engineer', fr: 'Ingénieur logiciel' },
		city: { en: 'Sétif', fr: 'Sétif' },
		rating: 5,
		quote: {
			en: 'I bought a smartwatch and a charger in one order. Both were genuine, sealed products with proper warranties. The site itself is fast and easy to use.',
			fr: 'J’ai acheté une montre connectée et un chargeur en une seule commande. Les deux étaient des produits authentiques, scellés, avec de vraies garanties. Le site lui-même est rapide et facile à utiliser.'
		}
	}
];
