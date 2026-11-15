import type { en } from './en';

/** French dictionary. Typed as `typeof en`, so any missing/extra key is a type error. */
type Dictionary = typeof en;

export const fr: Dictionary = {
	localeName: 'Français',
	meta: {
		ogLocale: 'fr_FR',
		intlLocale: 'fr-FR',
		homeTitle: 'TechDova — Votre univers technologique',
		homeDescription:
			'Découvrez les derniers smartphones, ordinateurs et accessoires avec une qualité exceptionnelle et des prix imbattables.',
		shopTitle: 'Boutique | TechDova',
		shopDescription:
			'Parcourez tous nos produits technologiques : smartphones, ordinateurs, audio, montres connectées, gaming et accessoires.',
		aboutTitle: 'À propos | TechDova',
		aboutDescription:
			'Découvrez TechDova, votre univers technologique : des produits originaux, une livraison rapide et un service client à votre écoute.',
		contactTitle: 'Contact | TechDova',
		contactDescription:
			'Contactez l’équipe TechDova pour toute question sur nos produits, vos commandes ou la livraison.',
		cartTitle: 'Panier | TechDova',
		cartDescription:
			'Consultez votre panier TechDova, modifiez les quantités et finalisez votre commande (démo).',
		termsTitle: 'Conditions générales | TechDova',
		termsDescription: 'Conditions générales démo de la boutique TechDova.',
		privacyTitle: 'Politique de confidentialité | TechDova',
		privacyDescription: 'Politique de confidentialité démo de la boutique TechDova.',
		notFoundTitle: 'Page introuvable | TechDova',
		notFoundDescription: 'La page demandée est introuvable.'
	},
	nav: {
		home: 'Accueil',
		shop: 'Boutique',
		categories: 'Catégories',
		about: 'À propos',
		contact: 'Contact',
		main: 'Navigation principale',
		cart: 'Panier',
		account: 'Compte',
		accountDemo: 'Boutique démo : les comptes sont désactivés.',
		searchPlaceholder: 'Rechercher un produit…',
		searchLabel: 'Rechercher un produit',
		menu: 'Ouvrir le menu',
		close: 'Fermer',
		language: 'Langue',
		skipToContent: 'Aller au contenu principal',
		switchTo: 'Passer au {language}'
	},
	live: {
		addedToCart: 'Ajouté au panier : {name}.',
		removedFromCart: 'Retiré du panier : {name}.'
	},
	hero: {
		slides: [
			{
				badge: 'Nouveauté',
				titleA: 'La technologie',
				titleB: 'à portée de main',
				subtitle:
					'Découvrez les derniers smartphones, ordinateurs et accessoires avec une qualité exceptionnelle et des prix imbattables.',
				cta: 'Découvrir la collection',
				imageAlt: 'Smartphone, ordinateur portable, montre connectée et écouteurs sur un podium blanc'
			},
			{
				badge: 'Audio premium',
				titleA: 'Un son',
				titleB: 'qui vous enveloppe',
				subtitle:
					'Casques et écouteurs à réduction de bruit pour une immersion totale, à la maison comme en déplacement.',
				cta: 'Explorer l’audio',
				imageAlt: 'Casque noir et écouteurs blancs sur fond vert dégradé'
			},
			{
				badge: 'Gaming',
				titleA: 'Jouez',
				titleB: 'sans limites',
				subtitle:
					'Manettes, consoles et accessoires gaming pour passer au niveau supérieur.',
				cta: 'Voir le gaming',
				imageAlt: 'Manette de jeu noire et casque gaming sur un podium blanc avec lumière verte'
			}
		],
		previous: 'Diapositive précédente',
		next: 'Diapositive suivante',
		goToSlide: 'Aller à la diapositive {n}',
		carouselLabel: 'Produits à la une',
		slideLabel: 'Diapositive {n} sur {total}',
		trust: [
			{ title: 'Livraison rapide', subtitle: 'En 24/48h' },
			{ title: 'Paiement sécurisé', subtitle: '100% fiable' },
			{ title: 'Service client', subtitle: '7j/7 à votre écoute' }
		]
	},
	categoriesSection: {
		eyebrow: 'Nos catégories',
		heading: 'Parcourir par catégorie',
		viewAll: 'Voir toutes les catégories'
	},
	bestSellers: {
		eyebrow: 'Produits phares',
		heading: 'Les meilleures ventes',
		previous: 'Produits précédents',
		next: 'Produits suivants',
		viewAll: 'Voir tous les produits'
	},
	productCard: {
		addToCart: 'Ajouter au panier',
		addedToCart: 'Ajouté au panier',
		addToWishlist: 'Ajouter aux favoris',
		removeFromWishlist: 'Retirer des favoris',
		outOfStock: 'Rupture de stock',
		reviewsLabel: '{count} avis',
		ratingLabel: 'Note de {rating} sur 5'
	},
	promo: {
		eyebrow: 'Offre spéciale',
		titleA: 'Jusqu’à -20%',
		titleB: 'sur une sélection de produits',
		subtitle: 'Équipez-vous avec les meilleures marques et profitez de nos offres limitées !',
		cta: 'Voir l’offre',
		imageAlt: 'Ordinateur portable, tablette et casque avec une petite plante sur fond vert pâle'
	},
	trust: {
		items: [
			{ title: 'Produits originaux', subtitle: 'Garantie constructeur' },
			{ title: 'Livraison rapide', subtitle: 'En 24/48h' },
			{ title: 'Paiement sécurisé', subtitle: '100% fiable' },
			{ title: 'Support client', subtitle: 'Toujours à votre écoute' }
		]
	},
	footer: {
		tagline: 'Votre univers technologique',
		usefulLinks: 'Liens utiles',
		followUs: 'Suivez-nous',
		newsletterTitle: 'Newsletter',
		newsletterText: 'Recevez nos nouveautés et offres spéciales',
		emailLabel: 'Adresse e-mail',
		emailPlaceholder: 'Votre adresse e-mail',
		subscribe: 'S’abonner',
		subscribeSuccess: 'Merci ! Vous êtes inscrit à notre newsletter (démo).',
		subscribeError: 'Veuillez saisir une adresse e-mail valide.',
		rights: 'Tous droits réservés.',
		terms: 'Conditions générales',
		privacy: 'Politique de confidentialité'
	},
	shop: {
		title: 'Boutique',
		description:
			'Parcourez tous nos produits technologiques. Filtrez par catégorie, recherchez et triez pour trouver votre prochain appareil.',
		searchLabel: 'Rechercher des produits',
		searchPlaceholder: 'Rechercher des produits…',
		allCategories: 'Toutes les catégories',
		sortLabel: 'Trier par',
		sortFeatured: 'En vedette',
		sortPriceAsc: 'Prix : croissant',
		sortPriceDesc: 'Prix : décroissant',
		sortRating: 'Meilleures notes',
		priceLabel: 'Prix maximum',
		priceAny: 'Tous les prix',
		maxPriceLabel: 'Jusqu’à {price}',
		results: '{count} produits',
		resultOne: '1 produit',
		noResults: 'Aucun produit trouvé',
		noResultsHint: 'Essayez une autre recherche ou effacez les filtres.',
		clearFilters: 'Effacer les filtres',
		filtersLabel: 'Filtres'
	},
	product: {
		inStock: 'En stock',
		lowStock: 'Plus que {count} en stock',
		outOfStock: 'Rupture de stock',
		quantity: 'Quantité',
		addToCart: 'Ajouter au panier',
		addedToCart: 'Ajouté au panier',
		description: 'Description',
		specifications: 'Caractéristiques',
		relatedTitle: 'Vous aimerez aussi',
		backToShop: 'Retour à la boutique',
		reviewsLabel: '{count} avis',
		ratingLabel: 'Note de {rating} sur 5',
		freeDelivery: 'Livraison rapide gratuite (24/48h)',
		warranty: 'Garantie constructeur de 2 ans',
		returns: 'Retours sous 30 jours',
		galleryLabel: 'Images du produit',
		saveLabel: 'Économisez {amount}',
		breadcrumbHome: 'Accueil',
		breadcrumbShop: 'Boutique',
		breadcrumbLabel: 'Fil d’Ariane'
	},
	cart: {
		title: 'Votre panier',
		empty: 'Votre panier est vide',
		emptyHint: 'Découvrez nos meilleures ventes et ajoutez vos favoris.',
		continueShopping: 'Continuer vos achats',
		subtotal: 'Sous-total',
		savings: 'Vous économisez',
		shipping: 'Livraison',
		shippingFree: 'Gratuite',
		total: 'Total',
		checkout: 'Commander (démo)',
		remove: 'Retirer {name}',
		quantityLabel: 'Quantité pour {name}',
		clearCart: 'Vider le panier',
		itemsLabel: '{count} articles',
		itemOne: '1 article',
		checkoutSuccessTitle: 'Commande passée — merci !',
		checkoutSuccessText: 'La commande {orderId} est confirmée. Total : {total}.',
		checkoutDemoNote:
			'Commande démo : aucun paiement n’a été effectué et rien n’a été envoyé.',
		checkoutAgain: 'Passer une autre commande',
		orderLabel: 'Commande',
		viewCart: 'Voir le panier'
	},
	cartDrawer: {
		title: 'Votre panier',
		viewCart: 'Voir le panier',
		checkout: 'Commander (démo)',
		empty: 'Votre panier est vide.',
		subtotal: 'Sous-total'
	},
	contact: {
		title: 'Contactez-nous',
		description:
			'Une question sur un produit, une commande ou la livraison ? Envoyez-nous un message — ce formulaire démo est validé localement et rien n’est envoyé.',
		nameLabel: 'Nom complet',
		namePlaceholder: 'Votre nom',
		emailLabel: 'Adresse e-mail',
		emailPlaceholder: 'vous@exemple.com',
		subjectLabel: 'Sujet',
		subjectGeneral: 'Question générale',
		subjectOrder: 'Question sur une commande',
		subjectProduct: 'Question sur un produit',
		subjectOther: 'Autre',
		messageLabel: 'Message',
		messagePlaceholder: 'Comment pouvons-nous vous aider ?',
		send: 'Envoyer le message',
		successTitle: 'Message envoyé — merci !',
		successText:
			'Merci {name}, nous avons bien reçu votre message. Ceci est une démo : rien n’a été envoyé.',
		sendAnother: 'Envoyer un autre message',
		requiredError: 'Ce champ est obligatoire.',
		emailError: 'Veuillez saisir une adresse e-mail valide.',
		messageError: 'Veuillez écrire au moins 10 caractères.',
		errorSummary: 'Veuillez corriger les erreurs suivantes :',
		infoTitle: 'Autres moyens de nous joindre',
		emailTitle: 'E-mail',
		phoneTitle: 'Téléphone',
		hoursTitle: 'Horaires d’ouverture',
		hoursValue: 'Lundi – samedi, 9h00 – 18h00'
	},
	about: {
		title: 'À propos de TechDova',
		description:
			'TechDova, votre univers technologique : des produits originaux, des prix honnêtes et une livraison rapide — une boutique démo entièrement locale.',
		storyEyebrow: 'Notre histoire',
		storyTitle: 'La technologie à portée de main, depuis le premier jour',
		storyText1:
			'TechDova est née d’une idée simple : les dernières technologies doivent être faciles à découvrir, à comparer et dignes de confiance. Chaque produit de notre catalogue est original, couvert par une garantie constructeur et livré rapidement.',
		storyText2:
			'Cette boutique est une démo construite selon les meilleures pratiques du web moderne : des pages statiques rapides, deux langues et une expérience d’achat accessible qui fonctionne entièrement dans votre navigateur, sans backend ni suivi.',
		valuesEyebrow: 'Nos valeurs',
		valuesTitle: 'Pourquoi choisir TechDova',
		values: [
			{
				title: 'Produits originaux',
				text: 'Chaque article est authentique et couvert par sa garantie constructeur.'
			},
			{
				title: 'Prix honnêtes',
				text: 'Des prix clairs, de vraies remises et aucun frais caché — jamais.'
			},
			{
				title: 'Livraison rapide',
				text: 'Les commandes partent en 24/48h, soigneusement emballées et suivies.'
			},
			{
				title: 'Support humain',
				text: 'De vraies personnes, 7j/7, avant et après votre achat.'
			}
		],
		stats: [
			{ value: '12', label: 'Produits au catalogue' },
			{ value: '6', label: 'Catégories à explorer' },
			{ value: '4,8/5', label: 'Note moyenne des clients' },
			{ value: '24–48h', label: 'Délai moyen de livraison' }
		],
		ctaTitle: 'Prêt à explorer ?',
		ctaText: 'Parcourez tout le catalogue et trouvez votre prochain appareil dès aujourd’hui.',
		ctaButton: 'Voir la boutique'
	},
	terms: {
		title: 'Conditions générales',
		description: 'Conditions générales démo de la boutique TechDova.',
		updated: 'Dernière mise à jour : 15 novembre 2026',
		sections: [
			{
				heading: '1. Boutique démo',
				body: 'TechDova est une boutique de démonstration. Aucune commande réelle n’est passée, aucun paiement n’est effectué et aucune donnée personnelle n’est envoyée à un serveur. Tous les produits, prix et avis affichés sont des contenus démo fictifs.'
			},
			{
				heading: '2. Prix et disponibilité',
				body: 'Les prix sont affichés en dinars algériens (DA) et incluent toutes les taxes démo. Les niveaux de stock affichés sont illustratifs et peuvent ne pas refléter une disponibilité réelle.'
			},
			{
				heading: '3. Commandes',
				body: 'Le parcours de commande est une démo locale : il confirme une commande sur votre appareil uniquement et vide votre panier. Aucun e-mail de confirmation n’est envoyé et aucun produit ne sera livré.'
			},
			{
				heading: '4. Contenu',
				body: 'Les noms de produits et les images sont utilisés à des fins de démonstration. Toutes les illustrations de ce site ont été générées pour cette démo.'
			}
		]
	},
	privacy: {
		title: 'Politique de confidentialité',
		description: 'Politique de confidentialité démo de la boutique TechDova.',
		updated: 'Dernière mise à jour : 15 novembre 2026',
		sections: [
			{
				heading: '1. Aucun suivi',
				body: 'TechDova n’utilise ni analyse d’audience, ni traqueurs publicitaires, ni cookies tiers. Le site fonctionne entièrement hors ligne une fois chargé et ne fait aucune requête vers des serveurs externes.'
			},
			{
				heading: '2. Stockage local',
				body: 'Votre panier, vos favoris, votre choix de langue et votre préférence newsletter sont stockés uniquement dans votre navigateur (localStorage). Vous pouvez les effacer à tout moment depuis les paramètres de votre navigateur.'
			},
			{
				heading: '3. Formulaires',
				body: 'Les formulaires de contact et de newsletter sont validés localement dans votre navigateur. Leur contenu n’est jamais transmis.'
			},
			{
				heading: '4. Contact',
				body: 'Pour toute question sur la confidentialité de cette démo, utilisez la page de contact. N’oubliez pas : rien de ce que vous saisissez ne quitte votre appareil.'
			}
		]
	},
	notFound: {
		eyebrow: 'Erreur 404',
		title: 'Page introuvable',
		description: 'Désolé, la page que vous recherchez n’existe pas ou a été déplacée.',
		backHome: 'Retour à l’accueil'
	}
};
