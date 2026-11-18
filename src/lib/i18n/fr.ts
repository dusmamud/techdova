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
		shopTitle: 'Boutique : tous les produits tech | TechDova',
		shopDescription:
			'Parcourez tous nos produits technologiques : smartphones, ordinateurs, audio, montres connectées, gaming et accessoires.',
		categoryTitle: '{category} : nos produits | TechDova',
		categoryDescription:
			'{category} chez TechDova : des produits originaux, des prix honnêtes et une livraison rapide.',
		searchTitle: 'Rechercher un produit | TechDova',
		searchDescription:
			'Recherchez dans le catalogue TechDova : smartphones, ordinateurs, audio, montres connectées, gaming et accessoires.',
		wishlistTitle: 'Favoris : vos produits enregistrés | TechDova',
		wishlistDescription: 'Vos produits TechDova enregistrés, réunis au même endroit.',
		compareTitle: 'Comparer les produits | TechDova',
		compareDescription:
			'Comparez les produits TechDova côte à côte : prix, notes, disponibilité et caractéristiques.',
		dealsTitle: 'Promotions et offres limitées | TechDova',
		dealsDescription:
			'Économisez sur une sélection de produits TechDova — des offres à durée limitée sur les smartphones, les ordinateurs, l’audio et bien plus.',
		aboutTitle: 'À propos de notre boutique tech | TechDova',
		aboutDescription:
			'Découvrez TechDova, votre univers technologique : des produits originaux, une livraison rapide et un service client à votre écoute.',
		testimonialsTitle: 'Témoignages | TechDova',
		testimonialsDescription:
			'Lisez ce que les clients de TechDova disent de nos produits, de la livraison et du support — des témoignages démo fictifs.',
		blogTitle: 'Blog tech : guides d’achat et conseils | TechDova',
		blogDescription:
			'Guides d’achat et conseils TechDova en langage clair : casques, ordinateurs portables, montres connectées et plus encore.',
		contactTitle: 'Contact : questions et assistance | TechDova',
		contactDescription:
			'Contactez l’équipe TechDova pour toute question sur nos produits, vos commandes ou la livraison.',
		cartTitle: 'Votre panier d’achat | TechDova',
		cartDescription:
			'Consultez votre panier TechDova, modifiez les quantités et finalisez votre commande (démo).',
		checkoutTitle: 'Finaliser votre commande | TechDova',
		checkoutDescription:
			'Finalisez votre commande démo : contact, livraison et paiement — rien n’est envoyé.',
		orderConfirmationTitle: 'Commande confirmée | TechDova',
		orderConfirmationDescription:
			'Votre commande démo est confirmée. Consultez votre numéro de commande et son récapitulatif.',
		trackOrderTitle: 'Suivre votre commande | TechDova',
		trackOrderDescription:
			'Suivez votre commande démo grâce à son code et consultez son statut de livraison.',
		accountTitle: 'Votre compte : commandes et réglages | TechDova',
		accountDescription:
			'Votre compte démo TechDova : connectez-vous localement et consultez vos commandes démo.',
		termsTitle: 'Conditions générales | TechDova',
		termsDescription: 'Conditions générales démo de la boutique TechDova.',
		privacyTitle: 'Politique de confidentialité | TechDova',
		privacyDescription: 'Politique de confidentialité démo de la boutique TechDova.',
		faqTitle: 'Questions fréquentes | TechDova',
		faqDescription:
			'Réponses démo aux questions fréquentes sur la livraison, les retours, le paiement, la garantie et les commandes chez TechDova.',
		shippingTitle: 'Informations de livraison | TechDova',
		shippingDescription:
			'Informations de livraison démo pour TechDova : livraison standard gratuite en 24/48h, régions et suivi.',
		returnsTitle: 'Retours et échanges | TechDova',
		returnsDescription:
			'Politique de retours démo pour TechDova : retours sous 30 jours, retour gratuit et remboursements en 5–7 jours ouvrés.',
		paymentTitle: 'Moyens de paiement | TechDova',
		paymentDescription:
			'Moyens de paiement démo chez TechDova : cartes, paiement à la livraison et versements. Aucun paiement réel n’est traité.',
		accessibilityTitle: 'Déclaration d’accessibilité | TechDova',
		accessibilityDescription:
			'Déclaration d’accessibilité de la boutique démo TechDova : objectif WCAG 2.2 AA, fonctionnalités prises en charge et limites.',
		sitemapTitle: 'Plan du site : toutes les pages | TechDova',
		sitemapDescription:
			'Plan du site lisible de la boutique démo TechDova, en anglais et en français.',
		storesTitle: 'Nos boutiques | TechDova',
		storesDescription:
			'Trouvez les boutiques démo TechDova à Alger, Oran et Constantine — adresses, horaires et itinéraires fictifs.',
		giftCardsTitle: 'Cartes cadeaux | TechDova',
		giftCardsDescription:
			'Offrez une carte cadeau démo TechDova ou consultez un solde démo. Rien n’est débité et rien n’est envoyé.',
		helpTitle: 'Centre d’aide | TechDova',
		helpDescription:
			'Obtenez de l’aide pour votre commande démo TechDova : livraison, retours, paiement, suivi et réponses aux questions populaires.',
		newArrivalsTitle: 'Nouveautés | TechDova',
		newArrivalsDescription:
			'Les dernières technologies arrivées chez TechDova : nouveaux smartphones, audio, montres connectées et gaming.',
		bestSellersTitle: 'Meilleures ventes | TechDova',
		bestSellersDescription:
			'Les produits démo les plus appréciés chez TechDova, notés par des clients fictifs : téléphones, ordinateurs, audio et plus.',
		notFoundTitle: 'Page introuvable | TechDova',
		notFoundDescription: 'La page demandée est introuvable.',
		brandsTitle: 'Acheter par marque | TechDova',
		brandsDescription:
			'Parcourez les produits TechDova par marque : Apple, Samsung, Sony, Dell, PlayStation, Nintendo et TechDova.',
		rewardsTitle: 'Programme de fidélité | TechDova',
		rewardsDescription:
			'Programme de fidélité démo : gagnez des points sur vos commandes démo, gravissez les niveaux et débloquez des avantages fictifs. Rien n’est suivi ni envoyé.',
		tradeInTitle: 'Reprenez votre appareil | TechDova',
		tradeInDescription:
			'Estimateur de reprise démo : estimez le crédit que votre ancien appareil pourrait valoir. Aucun appareil n’est collecté et aucun crédit n’est émis.',
		financingTitle: 'Financement et versements | TechDova',
		financingDescription:
			'Financement démo et calculateur de versements : divisez un achat en paiements mensuels à 0 % d’intérêt démo. Aucun contrat de crédit proposé.',
		warrantyTitle: 'Garantie étendue | TechDova',
		warrantyDescription:
			'Garantie étendue et protection démo : comparez les niveaux de couverture et les prix fictifs. Aucun plan vendu, aucune réclamation possible.',
		cookiesTitle: 'Politique en matière de cookies et de stockage | TechDova',
		cookiesDescription:
			'Aucun cookie de suivi, aucune analyse : TechDova utilise uniquement le stockage local du navigateur pour votre panier, vos favoris, le thème et la langue.'
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
		switchTo: 'Passer au {language}',
		deals: 'Offres',
		wishlist: 'Favoris',
		compare: 'Comparer'
	},
	live: {
		addedToCart: 'Ajouté au panier : {name}.',
		removedFromCart: 'Retiré du panier : {name}.'
	},
	announcementBar: {
		messages: [
			'Livraison gratuite sur toutes les commandes — livré en 24/48h',
			'Produits originaux avec garantie constructeur',
			'Paiement sécurisé et support client, toujours à votre écoute'
		],
		shortMessages: [
			'Livraison gratuite sur toutes les commandes',
			'Produits originaux, garantie incluse',
			'Paiement sécurisé et assistance'
		],
		linkLabel: 'Infos livraison'
	},
	searchAutocomplete: {
		popular: ['iPhone', 'Casque', 'Ordinateur portable', 'Montre connectée'],
		noResults: 'Aucun produit ne correspond à votre recherche',
		viewAllResults: 'Voir tous les résultats',
		suggestionsLabel: 'Produits suggérés'
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
		pause: 'Mettre en pause le défilement automatique',
		play: 'Reprendre le défilement automatique',
		goToSlide: 'Aller à la diapositive {n}',
		carouselLabel: 'Produits à la une',
		slideLabel: 'Diapositive {n} sur {total}',
		dotsLabel: 'Choisir une diapositive',
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
		viewAll: 'Voir tous les produits',
		carouselLabel: 'Carrousel des meilleures ventes'
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
	toast: {
		dismiss: 'Fermer la notification'
	},
	backToTop: {
		label: 'Retour en haut'
	},
	theme: {
		switchToDark: 'Passer en mode sombre',
		switchToLight: 'Passer en mode clair'
	},
	recentlyViewed: {
		heading: 'Récemment consultés'
	},
	countdown: {
		days: 'Jours',
		hours: 'Heures',
		minutes: 'Min',
		seconds: 'Sec',
		expired: 'Cette offre est terminée.'
	},
	checkoutSteps: {
		contact: 'Contact',
		shipping: 'Livraison',
		payment: 'Paiement'
	},
	megaMenu: {
		categoriesHeading: 'Acheter par catégorie',
		featuredHeading: 'Produits vedettes',
		promoTitle: 'Jusqu’à -20 % sur une sélection',
		promoText: 'Découvrez les offres de la semaine sur les téléphones, les ordinateurs et l’audio.',
		promoCta: 'Voir toutes les offres'
	},
	marquee: {
		label: 'Offres en cours et marques',
		offers: [
			'Livraison gratuite sur toutes les commandes',
			'Jusqu’à -20 % sur une sélection',
			'Retours sous 30 jours',
			'Paiement sécurisé',
			'Garantie constructeur'
		],
		brands: ['Apple', 'Samsung', 'Dell', 'Sony', 'PlayStation', 'Nintendo', 'TechDova']
	},
	tabReminder: {
		waiting: 'articles vous attendent dans votre panier'
	},

	testimonialsSection: {
		eyebrow: 'Témoignages',
		heading: 'Ce que disent nos clients',
		aggregate: 'Moyenne de {rating} sur 5 d’après {count} témoignages démo',
		demoNote: 'Ces témoignages sont des contenus démo fictifs, écrits à titre d’illustration.'
	},
	reviews: {
		heading: 'Avis clients',
		demoNote: 'Ces avis sont des contenus démo fictifs, écrits à titre d’illustration.',
		writeTitle: 'Écrire un avis (démo)',
		nameLabel: 'Votre nom',
		ratingLabel: 'Note',
		titleLabel: 'Titre de l’avis',
		textLabel: 'Votre avis',
		submit: 'Envoyer l’avis',
		successNote: 'Merci ! Votre avis démo apparaît ci-dessus pour cette session uniquement.',
		helpful: 'Utile ({count})',
		helpfulVoted: 'Utile — merci pour votre vote ({count})',
		basedOn: 'Basé sur {count} avis',
		breakdownLabel: 'Répartition des notes',
		nameError: 'Veuillez saisir votre nom.',
		titleError: 'Veuillez saisir un titre d’avis.',
		textError: 'Veuillez écrire au moins 10 caractères.',
		ratingOption: '{n} étoiles sur 5',
		sampleNote:
			'Échantillon de 3 avis affiché, dont un avis critique. Les moyennes reflètent l’ensemble des {count} avis.'
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
	brandsSection: {
		eyebrow: 'Nos marques',
		heading: 'Acheter par marque',
		oneProduct: '1 produit',
		manyProducts: '{count} produits'
	},
	bentoSection: {
		eyebrow: 'À découvrir',
		heading: 'Plus de façons d’explorer',
		explore: 'Découvrir',
		spotlightTitle: 'Gaming, prêt à jouer',
		spotlightText: 'Manettes, consoles et accessoires pour tous les joueurs.',
		dealsTitle: 'Économisez sur une sélection tech',
		dealsText: 'Téléphones, ordinateurs, audio et plus encore à prix réduits.',
		newTitle: 'Les derniers arrivages',
		newText: 'Les derniers téléphones, casques et consoles, tout juste arrivés.',
		giftTitle: 'Cartes cadeaux',
		giftText: 'Laissez-les choisir — une carte cadeau TechDova pour toutes les occasions.'
	},
	newArrivals: {
		eyebrow: 'Derniers arrivages',
		heading: 'Nouveautés',
		viewAll: 'Voir tous les produits'
	},
	dealOfDay: {
		eyebrow: 'Offre à durée limitée',
		heading: 'Offre du jour',
		viewAll: 'Voir toutes les offres',
		endsLabel: 'Cette offre se termine dans'
	},
	brandStory: {
		eyebrow: 'Notre histoire',
		heading: 'La technologie à portée de main',
		text: 'TechDova est née d’une idée simple : les dernières technologies doivent être faciles à découvrir, à comparer et dignes de confiance. Chaque produit est original, couvert par une garantie constructeur et livré rapidement.',
		cta: 'En savoir plus sur nous',
		imageAlt: 'Smartphone, ordinateur portable, montre connectée et écouteurs sur un podium blanc'
	},
	newsletterBand: {
		title: 'Restez informé',
		text: 'Recevez nos nouveautés, nos derniers arrivages et nos offres spéciales — sans spam, désinscription à tout moment (démo).'
	},
	quickView: {
		label: 'Aperçu rapide',
		viewDetails: 'Voir la fiche complète'
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
		privacy: 'Politique de confidentialité',
		shopTitle: 'Boutique',
		helpTitle: 'Aide',
		companyTitle: 'Entreprise',
		accountTitle: 'Compte',
		deals: 'Offres',
		shipping: 'Livraison',
		returns: 'Retours',
		payment: 'Modes de paiement',
		faq: 'FAQ',
		trackOrder: 'Suivre ma commande',
		testimonials: 'Témoignages',
		blog: 'Blog',
		sitemap: 'Plan du site',
		accessibility: 'Accessibilité',
		account: 'Compte',
		wishlist: 'Favoris',
		compare: 'Comparer',
		stores: 'Nos boutiques',
		giftCards: 'Cartes cadeaux',
		help: 'Centre d’aide',
		newArrivals: 'Nouveautés',
		bestSellers: 'Meilleures ventes',
		brands: 'Marques',
		rewards: 'Fidélité',
		tradeIn: 'Reprise',
		financing: 'Financement',
		warranty: 'Garantie',
		cookies: 'Politique relative aux cookies',
		cookieSettings: 'Paramètres des cookies'
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
	filters: {
		filters: 'Filtres',
		apply: 'Appliquer les filtres',
		showResults: 'Afficher {count} résultats',
		clearAll: 'Tout effacer',
		activeFilters: 'Filtres actifs',
		removeFilter: 'Retirer le filtre : {label}',
		sortBy: 'Trier par',
		results: '{count} résultats',
		resultOne: '1 résultat',
		activeCount: '{count} actifs',
		brandsLabel: 'Marques',
		allBrands: 'Toutes les marques',
		ratingLabel: 'Note minimale',
		ratingAny: 'Toutes les notes',
		ratingFourPlus: '4 étoiles et plus',
		ratingThreePlus: '3 étoiles et plus',
		inStockOnly: 'En stock uniquement',
		onSaleOnly: 'En promotion uniquement',
		showingOf: 'Affichage de {shown} produits sur {total}',
		showingOfOne: 'Affichage de 1 produit sur {total}',
		facetsHeading: 'Affiner les résultats'
	},
	categoryPage: {
		breadcrumbLabel: 'Fil d’Ariane',
		results: '{count} produits',
		resultOne: '1 produit',
		backToShop: 'Retour à la boutique'
	},
	searchPage: {
		title: 'Recherche',
		hint: 'Recherchez dans tout le catalogue par nom de produit, catégorie ou caractéristique.',
		searchLabel: 'Rechercher des produits',
		searchPlaceholder: 'Rechercher des produits…',
		popularLabel: 'Recherches populaires',
		popularSearches: ['iPhone', 'casque', 'ordinateur portable', 'montre connectée'],
		results: '{count} résultats pour « {query} »',
		resultOne: '1 résultat pour « {query} »',
		noResults: 'Aucun résultat pour « {query} »',
		noResultsHint: 'Vérifiez l’orthographe ou essayez un mot plus général.',
		noResultsTips: [
			'Vérifiez l’orthographe de votre recherche.',
			'Essayez moins de mots, ou un terme plus général.',
			'Parcourez les catégories de la boutique pour découvrir des produits similaires.'
		],
		suggestionsLabel: 'Essayez l’une de ces recherches populaires',
		browseShop: 'Voir la boutique',
		categoryFilterLabel: 'Filtrer par catégorie',
		allCategories: 'Toutes les catégories',
		synonymsNote:
			'Les termes associés sont aussi reconnus : « ordinateur », « téléphone » et les mots similaires trouvent leur catégorie.'
	},
	wishlistPage: {
		title: 'Vos favoris',
		description: 'Vos produits enregistrés, réunis au même endroit.',
		savedHeading: 'Produits enregistrés',
		count: '{count} produits enregistrés',
		countOne: '1 produit enregistré',
		empty: 'Votre liste de favoris est vide',
		emptyHint: 'Touchez le cœur d’un produit pour l’enregistrer ici.',
		browseShop: 'Voir la boutique',
		moveToCart: 'Déplacer vers le panier',
		moveToCartLabel: 'Déplacer {name} vers le panier',
		remove: 'Retirer {name}'
	},
	comparePage: {
		title: 'Comparer les produits',
		description: 'Comparez jusqu’à 4 produits côte à côte.',
		empty: 'Rien à comparer pour le moment',
		emptyHint:
			'Ajoutez jusqu’à 4 produits pour comparer leurs prix, leurs notes et leurs caractéristiques.',
		browseShop: 'Voir la boutique',
		clearAll: 'Tout effacer',
		highlightDifferences: 'Mettre en évidence les différences',
		comparing: 'Comparaison de {count} produits',
		tableLabel: 'Comparaison des produits',
		rowProduct: 'Produit',
		rowPrice: 'Prix',
		rowRating: 'Note',
		rowCategory: 'Catégorie',
		rowStock: 'Disponibilité',
		rowActions: 'Actions',
		remove: 'Retirer {name}',
		trayAriaLabel: 'Barre de comparaison',
		trayCount: '{count} produits à comparer',
		trayOne: '1 produit à comparer',
		trayCompareNow: 'Comparer maintenant',
		trayClear: 'Effacer la comparaison'
	},
	dealsPage: {
		title: 'Promotions',
		description: 'Économisez sur une sélection de produits — pour une durée limitée.',
		endsIn: 'L’offre se termine dans',
		results: '{count} promotions',
		resultOne: '1 promotion',
		empty: 'Aucune promotion pour le moment',
		emptyHint: 'Revenez bientôt pour découvrir nos prochaines offres.',
		browseShop: 'Voir la boutique'
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
		breadcrumbLabel: 'Fil d’Ariane',
		reviewsLink: 'Lire les avis',
		deliveryTitle: 'Livraison et retours',
		deliveryEstimate: 'Livraison estimée en 24/48h',
		notifyLabel: 'Me prévenir quand il sera disponible (démo)',
		notifySuccess:
			'Merci ! Nous vous préviendrons quand ce produit sera de nouveau en stock. Ceci est une démo : aucune notification ne sera envoyée.',
		shareLabel: 'Partager ce produit',
		copyLink: 'Copier le lien',
		copiedToast: 'Lien copié dans le presse-papiers.',
		shareViaLabel: 'Partager',
		pairsTitle: 'Va bien avec',
		zoomLabel: 'Agrandir l’image du produit',
		compareAdd: 'Ajouter à la comparaison',
		compareRemove: 'Retirer de la comparaison',
		compareFull: 'La comparaison est pleine — vous pouvez comparer jusqu’à 4 produits.',
		skuLabel: 'Référence',
		variantStorageLabel: 'Stockage',
		variantColorLabel: 'Couleur',
		variantSelected: 'Sélection : {label}',
		variantOutOfStockSuffix: '(en rupture de stock)',
		galleryPrevious: 'Image précédente',
		galleryNext: 'Image suivante',
		galleryImageLabel: 'Image {current} sur {total} du produit',
		galleryThumbnailLabel: 'Voir l’image {n}',
		magnifierHint: 'Survolez pour agrandir',
		deliveryCountdown: 'Commandez dans les {time} pour une livraison le {date}',
		deliveryCountdownTime: '{hours} h {minutes} min',
		deliveryCountdownMinutes: '{minutes} min',
		deliveryDemoNote: 'Estimation démo — les dates de livraison sont indicatives.',
		estimatedCost: 'Total estimé : {total}',
		returnPolicyLink: 'Politique de retour',
		inTheBoxTitle: 'Contenu de la boîte',
		qaTitle: 'Questions-réponses',
		qaDemoNote: 'Questions et réponses démo, rédigées à titre d’illustration.',
		bundleTitle: 'Fréquemment achetés ensemble',
		bundleTotal: 'Total pour {count} articles : {total}',
		bundleAddAll: 'Tout ajouter au panier ({count})',
		bundleAdded: 'Ensemble ajouté au panier',
		variantsNote: 'Disponible en {count} variantes, dès {price}',
		variantsLabel: 'Variantes',
		scrollProgressLabel: 'Progression de la page'
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
		viewCart: 'Voir le panier',
		promoLabel: 'Code promo',
		promoPlaceholder: 'Saisissez un code, ex. TECHDOVA10',
		promoApply: 'Appliquer',
		promoError: 'Ce code n’est pas reconnu. Essayez TECHDOVA10.',
		promoHint: 'Codes démo : TECHDOVA10 (−10 %), WELCOME15 (−15 %), SAVE20 (−20 %).',
		promoApplied: 'Code {code} appliqué : {label}',
		promoRemove: 'Retirer le code promo {code}',
		promoDiscount: 'Remise promo ({code})',
		returnNudgeTitle: 'Bon retour',
		returnNudgeText: 'Votre panier vous attend — {count} articles y sont toujours.',
		returnNudgeTextOne: 'Votre panier vous attend — 1 article y est toujours.',
		returnNudgeDismiss: 'Ignorer'
	},
	cartDrawer: {
		title: 'Votre panier',
		viewCart: 'Voir le panier',
		checkout: 'Commander (démo)',
		empty: 'Votre panier est vide.',
		subtotal: 'Sous-total'
	},
	checkout: {
		title: 'Commander',
		guestNote:
			'Commande en tant qu’invité — aucun compte n’est requis. La connexion est facultative et reste sur cet appareil.',
		demoNote: 'Commande démo : aucun paiement n’est effectué et rien n’est envoyé.',
		nameLabel: 'Nom complet',
		namePlaceholder: 'Votre nom',
		emailLabel: 'Adresse e-mail',
		emailPlaceholder: 'vous@exemple.com',
		addressLabel: 'Adresse',
		addressPlaceholder: 'Rue et numéro',
		cityLabel: 'Ville',
		cityPlaceholder: 'Votre ville',
		postalLabel: 'Code postal',
		postalPlaceholder: '16000',
		countryLabel: 'Pays',
		countryAlgeria: 'Algérie',
		countryFrance: 'France',
		countryTunisia: 'Tunisie',
		countryMorocco: 'Maroc',
		deliveryLegend: 'Mode de livraison',
		deliveryStandard: 'Livraison standard',
		deliveryStandardHint: 'Livré en 24/48h — gratuit',
		deliveryExpress: 'Livraison express',
		deliveryExpressHint: 'Livré en 24h — gratuit',
		paymentLegend: 'Moyen de paiement',
		paymentCard: 'Carte bancaire (démo)',
		paymentCardHint: 'Démo uniquement — utilisez des données de test. Rien n’est débité.',
		paymentCod: 'Paiement à la livraison',
		paymentCodHint: 'Payez à la réception de votre commande démo.',
		paymentBnpl: 'Paiement en plusieurs fois (démo)',
		paymentBnplHint: 'Divisez votre paiement démo en plusieurs fois. Rien n’est débité.',
		cardNumberLabel: 'Numéro de carte (démo)',
		cardNumberPlaceholder: '4242 4242 4242 4242',
		expiryLabel: 'Date d’expiration (démo)',
		expiryPlaceholder: 'MM/AA',
		cvcLabel: 'CVC (démo)',
		cvcPlaceholder: '123',
		cardDemoNote:
			'Champs de carte démo : saisissez des données de test. Elles ne sont jamais envoyées ni stockées.',
		back: 'Retour',
		continue: 'Continuer',
		placeOrder: 'Passer la commande (démo)',
		requiredError: 'Ce champ est obligatoire.',
		emailError: 'Veuillez saisir une adresse e-mail valide.',
		cardNumberError: 'Veuillez saisir un numéro de carte démo (au moins 12 chiffres).',
		expiryError: 'Veuillez saisir une date d’expiration au format MM/AA.',
		cvcError: 'Veuillez saisir un CVC démo de 3 ou 4 chiffres.',
		errorSummary: 'Veuillez corriger les erreurs suivantes :',
		summaryTitle: 'Récapitulatif de la commande',
		lineQty: '× {qty}'
	},
	orderConfirmation: {
		itemsTitle: 'Vos articles',
		placedOn: 'Passée le {date}',
		statusLabel: 'Statut de livraison',
		trackOrderLink: 'Suivre votre commande',
		emptyTitle: 'Aucune commande récente trouvée',
		emptyText:
			'Aucune commande démo n’a été trouvée sur cet appareil. Passez une commande depuis votre panier pour voir sa confirmation ici.',
		lineQty: '× {qty}'
	},
	trackOrder: {
		title: 'Suivre votre commande',
		description:
			'Saisissez votre code de commande démo pour voir son statut de livraison. Ceci est une démo : les statuts sont illustratifs et calculés sur votre appareil.',
		orderCodeLabel: 'Code de commande',
		orderCodePlaceholder: 'TD-XXXXXX',
		codeHint: 'Votre code de commande commence par TD- et figure sur la page de confirmation.',
		emailLabel: 'Adresse e-mail (facultatif)',
		emailPlaceholder: 'vous@exemple.com',
		submit: 'Suivre la commande',
		requiredError: 'Veuillez saisir votre code de commande.',
		emailError: 'Veuillez saisir une adresse e-mail valide.',
		orderHeading: 'Commande {orderId}',
		placedOn: 'Passée le {date}',
		statusLabel: 'Statut de livraison',
		statusOrdered: 'Commandée',
		statusShipped: 'Expédiée',
		statusOutForDelivery: 'En cours de livraison',
		statusDelivered: 'Livrée',
		timelineLabel: 'Chronologie de livraison',
		stepCompleted: 'Terminé',
		stepCurrent: 'Étape actuelle',
		stepUpcoming: 'À venir',
		itemsTitle: 'Articles de la commande',
		lineQty: '× {qty}',
		demoNote:
			'Suivi démo : cette chronologie est illustrative. Aucune commande n’a été trouvée pour ce code sur cet appareil, un statut d’exemple est donc affiché.',
		trackAnother: 'Suivre une autre commande'
	},
	account: {
		title: 'Votre compte',
		description:
			'Compte démo : connectez-vous avec un nom et un e-mail uniquement. Aucun mot de passe n’est jamais demandé, et rien ne quitte votre appareil.',
		demoNote: 'Compte démo : votre profil est stocké uniquement dans ce navigateur.',
		signInTitle: 'Se connecter (démo)',
		nameLabel: 'Nom complet',
		namePlaceholder: 'Votre nom',
		emailLabel: 'Adresse e-mail',
		emailPlaceholder: 'vous@exemple.com',
		signInButton: 'Se connecter (démo)',
		requiredError: 'Ce champ est obligatoire.',
		emailError: 'Veuillez saisir une adresse e-mail valide.',
		errorSummary: 'Veuillez corriger les erreurs suivantes :',
		greeting: 'Bonjour, {name}',
		signedInAs: 'Connecté en tant que {email}',
		signOut: 'Se déconnecter',
		ordersTitle: 'Vos commandes démo',
		ordersEmpty: 'Aucune commande démo pour le moment.',
		ordersEmptyHint: 'Les commandes que vous passez dans cette démo apparaîtront ici.',
		placedOn: 'Passée le {date}',
		trackLink: 'Suivre la commande',
		shortcutsTitle: 'Raccourcis',
		cartShortcut: 'Votre panier',
		wishlistShortcut: 'Vos favoris',
		wishlistCount: '{count} articles enregistrés',
		wishlistEmpty: 'Aucun article enregistré pour le moment.',
		browseShop: 'Voir les produits',
		editTitle: 'Modifier votre profil',
		editButton: 'Modifier le profil',
		editDescription:
			'Modifiez le nom et l’e-mail enregistrés pour ce compte démo. Rien ne quitte votre appareil.',
		saveButton: 'Enregistrer le profil',
		cancelButton: 'Annuler',
		savedMessage: 'Profil enregistré.',
		notificationsTitle: 'Préférences de notification',
		notificationsDescription:
			'Choisissez les notifications démo que vous souhaitez recevoir. Ces réglages sont stockés uniquement dans ce navigateur et aucun message n’est jamais envoyé.',
		ordersLabel: 'Mises à jour des commandes',
		ordersHint: 'Mises à jour démo quand une commande démo est expédiée ou livrée.',
		offersLabel: 'Offres et promotions',
		offersHint: 'Messages démo sur les offres et les nouveautés.',
		newsletterLabel: 'Newsletter',
		newsletterHint: 'La même newsletter démo que le formulaire du pied de page — rien n’est envoyé.'
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
	testimonialsPage: {
		title: 'Ce que disent nos clients',
		description:
			'Des clients ordinaires parlent des produits achetés, de la livraison reçue et du support obtenu.',
		cta: 'Voir la boutique'
	},
	blogPage: {
		title: 'Le blog TechDova',
		description:
			'Guides d’achat et conseils en langage clair pour vous aider à choisir la bonne technologie — sans jargon ni pression.',
		readMore: 'Lire la suite',
		readingTime: '{minutes} min de lecture',
		backToBlog: 'Retour au blog',
		prevPost: 'Article précédent',
		nextPost: 'Article suivant',
		breadcrumbBlog: 'Blog',
		filterLabel: 'Filtrer les articles par catégorie',
		allCategories: 'Toutes les catégories',
		results: '{count} articles',
		resultOne: '1 article',
		noResults: 'Aucun article dans cette catégorie pour le moment.',
		relatedTitle: 'Articles liés',
		progressLabel: 'Progression de la lecture'
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
	faq: {
		title: 'Questions fréquentes',
		description: 'Réponses démo aux questions fréquentes sur les achats chez TechDova.',
		intro: 'Trouvez des réponses rapides ci-dessous. Tout ce qui figure sur cette page décrit la boutique démo : aucune commande, aucun paiement ni aucune livraison réelle n’a lieu.',
		items: [
			{
				question: 'Combien coûte la livraison, et quelle est sa rapidité ?',
				answer:
					'La livraison est gratuite pour toutes les commandes démo, avec une arrivée estimée en 24/48h. Ce sont des estimations démo : aucune marchandise n’est réellement expédiée.'
			},
			{
				question: 'Comment retourner un produit ?',
				answer:
					'Vous disposez de 30 jours à compter de la date de livraison démo pour retourner un produit. Lancez un retour depuis la page de contact et conservez l’article inutilisé dans son emballage d’origine. Dans cette démo, les retours sont purement illustratifs : rien n’est collecté et aucun remboursement n’est traité.'
			},
			{
				question: 'Quels moyens de paiement acceptez-vous ?',
				answer:
					'La commande démo propose les paiements par carte, le paiement à la livraison et les versements de type BNPL. Aucun paiement réel n’est traité et aucune donnée bancaire ne quitte votre appareil.'
			},
			{
				question: 'Les produits sont-ils couverts par une garantie ?',
				answer:
					'Chaque produit du catalogue démo est couvert par une garantie constructeur de 2 ans. Comme il s’agit d’une démonstration, aucune réclamation de garantie ne peut réellement être déposée.'
			},
			{
				question: 'Comment suivre ma commande ?',
				answer:
					'Utilisez la page de suivi de commande avec votre numéro de commande démo. L’historique des commandes est stocké uniquement dans votre navigateur : le suivi fonctionne donc sur l’appareil où la commande a été passée.'
			},
			{
				question: 'Faut-il un compte pour commander ?',
				answer:
					'Non. Vous pouvez parcourir la boutique et commander sans compte. Les fonctions de compte démo stockent leurs données uniquement dans votre navigateur (localStorage) et rien n’est envoyé à un serveur.'
			},
			{
				question: 'Puis-je modifier ou annuler ma commande ?',
				answer:
					'Dans cette démo, les commandes sont confirmées localement sur votre appareil et aucune commande réelle n’existe à modifier. Pour toute question sur une commande démo, utilisez la page de contact.'
			},
			{
				question: 'Où livrez-vous ?',
				answer:
					'Les régions de livraison démo incluent Alger, Oran, Constantine, Sétif, Annaba et Blida. Consultez la page d’informations de livraison pour la liste démo complète et les estimations.'
			},
			{
				question: 'Est-il sûr de saisir mes données bancaires ?',
				answer:
					'Ceci est une démo : aucun paiement réel n’est traité et tout ce que vous saisissez reste sur votre appareil. Ne saisissez jamais de vraies données bancaires sur un site démo.'
			}
		],
		contactPrompt: 'Vous avez encore une question ?',
		contactLink: 'Contactez-nous'
	},
	shipping: {
		title: 'Informations de livraison',
		description: 'Informations de livraison démo pour la boutique TechDova.',
		updated: 'Dernière mise à jour : 15 novembre 2026',
		sections: [
			{
				heading: '1. Livraison standard gratuite',
				body: 'La livraison standard est gratuite pour toutes les commandes démo, avec une arrivée estimée en 24/48h. Il n’y a ni frais de livraison ni montant minimum de commande. Ces estimations sont illustratives : aucune marchandise n’est réellement expédiée.'
			},
			{
				heading: '2. Régions de livraison',
				body: 'Le réseau de livraison démo couvre les régions suivantes. Les délais de livraison sont des estimations présentées à titre d’illustration uniquement.'
			},
			{
				heading: '3. Suivre votre commande',
				body: 'Chaque commande démo reçoit un numéro de suivi que vous pouvez suivre sur la page de suivi de commande. Les mises à jour de suivi sont générées localement dans votre navigateur et ne reflètent pas un envoi réel.'
			},
			{
				heading: '4. Emballage',
				body: 'Les commandes démo sont décrites comme soigneusement emballées dans un emballage protecteur et recyclable. Comme il s’agit d’une démonstration, aucun colis n’est préparé ni envoyé.'
			}
		],
		regions: ['Alger', 'Oran', 'Constantine', 'Sétif', 'Annaba', 'Blida'],
		trackOrderLink: 'Suivre votre commande'
	},
	returns: {
		title: 'Retours et échanges',
		description: 'Politique de retours démo pour la boutique TechDova.',
		updated: 'Dernière mise à jour : 15 novembre 2026',
		sections: [
			{
				heading: '1. Délai de 30 jours',
				body: 'Vous disposez de 30 jours à compter de la date de livraison démo pour retourner ou échanger un produit. Les articles doivent être inutilisés, dans leur emballage d’origine et avec tous les accessoires inclus.'
			},
			{
				heading: '2. Retour gratuit',
				body: 'Les frais de retour sont gratuits dans cette démo. Aucune étiquette de retour n’est réellement émise et aucun colis n’est collecté : le processus ci-dessous est purement illustratif.'
			},
			{
				heading: '3. Remboursements',
				body: 'Les remboursements démo approuvés sont décrits comme émis vers le moyen de paiement d’origine sous 5–7 jours ouvrés. Aucun paiement réel n’est traité, donc aucun remboursement réel n’a lieu. Les échanges suivent le même délai de 30 jours.'
			}
		],
		stepsHeading: 'Comment lancer un retour (démo)',
		steps: [
			'Allez sur la page de contact et choisissez le sujet « question sur une commande ».',
			'Indiquez votre numéro de commande démo et le produit que vous souhaitez retourner.',
			'Conservez le produit inutilisé et dans son emballage d’origine.',
			'Dans une vraie boutique, vous recevriez ensuite une étiquette de retour — dans cette démo, il ne se passe rien de plus.'
		],
		contactLink: 'Contactez-nous pour lancer un retour'
	},
	payment: {
		title: 'Moyens de paiement',
		description: 'Moyens de paiement démo pour la boutique TechDova.',
		updated: 'Dernière mise à jour : 15 novembre 2026',
		sections: [
			{
				heading: '1. Cartes (démo)',
				body: 'Les paiements par carte démo sont simulés localement : vous pouvez saisir n’importe quelles données de test à la commande et aucun débit n’est jamais effectué. Ne saisissez jamais de vraies données bancaires sur ce site démo.'
			},
			{
				heading: '2. Paiement à la livraison',
				body: 'Le paiement à la livraison est proposé comme option démo : dans une vraie boutique, vous paieriez le livreur à la réception de votre commande. Aucune livraison n’a lieu dans cette démo.'
			},
			{
				heading: '3. Paiement en plusieurs fois (démo)',
				body: 'Les versements de type BNPL sont présentés comme une option démo qui diviserait un achat en paiements mensuels. Aucun contrat de crédit n’est proposé et aucun plan de versements n’est créé.'
			},
			{
				heading: '4. Sécurité',
				body: 'Aucun paiement réel n’est traité sur ce site et aucune donnée bancaire ne quitte votre appareil : tout ce que vous saisissez reste dans votre navigateur. Le parcours de commande est une démonstration locale, sans backend ni prestataire de paiement.'
			}
		],
		demoNote: 'Démo uniquement : aucun paiement réel n’est traité et aucune donnée bancaire ne quitte votre appareil.'
	},
	accessibility: {
		title: 'Déclaration d’accessibilité',
		description: 'Déclaration d’accessibilité de la boutique démo TechDova.',
		updated: 'Dernière mise à jour : 15 novembre 2026',
		sections: [
			{
				heading: '1. Notre objectif',
				body: 'TechDova vise la conformité WCAG 2.2 niveau AA. La boutique utilise des pages pré-rendues avec un HTML sémantique, une prise en charge du clavier et des alternatives textuelles pour les images.'
			},
			{
				heading: '2. Limites',
				body: 'Il s’agit d’un site de démonstration : certains contenus ont donc des limites honnêtes — les illustrations des produits sont des images générées avec un texte alternatif descriptif, et certaines démos interactives (comme le carrousel) sont simplifiées. N’hésitez pas à nous signaler tout obstacle que vous rencontreriez.'
			},
			{
				heading: '3. Commentaires',
				body: 'Si vous constatez un problème d’accessibilité, signalez-le-nous via la page de contact en décrivant la page et le problème. Nous ferons de notre mieux pour corriger les problèmes démo dans une prochaine mise à jour.'
			}
		],
		featuresHeading: 'Fonctionnalités prises en charge',
		features: [
			'Navigation complète au clavier avec un indicateur de focus visible',
			'Prise en charge de la réduction des animations : les animations sont désactivées lorsque votre système le demande',
			'Annonces pour lecteurs d’écran lors des changements de panier, via une zone live',
			'Texte alternatif descriptif sur les images des produits et des catégories',
			'Cibles tactiles d’au moins 44 par 44 pixels',
			'Contraste du texte conforme à WCAG 2.2 AA sur tout le contenu principal'
		],
		contactLink: 'Signaler un problème d’accessibilité'
	},
	sitemapPage: {
		title: 'Plan du site',
		description: 'Toutes les pages de la boutique démo TechDova, en anglais et en français.',
		shopHeading: 'Boutique',
		helpHeading: 'Aide',
		companyHeading: 'Entreprise',
		accountHeading: 'Compte',
		categoriesLabel: 'Catégories',
		productsLabel: 'Produits',
		postsLabel: 'Articles de blog',
		labels: {
			home: 'Accueil',
			shop: 'Boutique',
			deals: 'Promotions',
			search: 'Recherche',
			wishlist: 'Favoris',
			compare: 'Comparateur',
			cart: 'Panier',
			checkout: 'Commande',
			trackOrder: 'Suivi de commande',
			account: 'Compte',
			testimonials: 'Témoignages',
			blog: 'Blog',
			faq: 'Questions fréquentes',
			shipping: 'Informations de livraison',
			returns: 'Retours et échanges',
			payment: 'Moyens de paiement',
			about: 'À propos',
			contact: 'Contact',
			terms: 'Conditions générales',
			privacy: 'Politique de confidentialité',
			accessibility: 'Déclaration d’accessibilité',
			sitemap: 'Plan du site',
			stores: 'Nos boutiques',
			giftCards: 'Cartes cadeaux',
			help: 'Centre d’aide',
			newArrivals: 'Nouveautés',
			bestSellers: 'Meilleures ventes'
		}
	},
	storesPage: {
		title: 'Nos boutiques',
		description: 'Visitez l’une de nos boutiques démo — ou parcourez tout le catalogue en ligne.',
		demoNote:
			'Contenu démo : ces boutiques sont fictives. Les adresses, horaires et numéros de téléphone sont des exemples et aucune vraie boutique n’existe à ces adresses.',
		filterLabel: 'Filtrer par ville',
		allCities: 'Toutes les villes',
		hoursLabel: 'Horaires d’ouverture',
		phoneLabel: 'Téléphone',
		directions: 'Itinéraire',
		directionsLabel: 'Itinéraire vers {name} (s’ouvre dans un nouvel onglet)',
		results: '{count} boutiques',
		resultOne: '1 boutique',
		noResults: 'Aucune boutique dans cette ville pour le moment',
		shopOnline: 'Acheter en ligne'
	},
	giftCardsPage: {
		title: 'Cartes cadeaux',
		description:
			'Offrez la technologie en cadeau. Choisissez un montant, ajoutez un message et prévisualisez votre carte cadeau démo.',
		demoNote:
			'Démo uniquement : aucune carte cadeau n’est créée, aucun e-mail n’est envoyé et rien n’est débité. L’aperçu ci-dessous reste sur cet appareil.',
		amountLabel: 'Choisissez un montant',
		customAmountLabel: 'Ou saisissez un montant personnalisé (DA)',
		customAmountPlaceholder: 'ex. 2500',
		recipientNameLabel: 'Nom du destinataire',
		recipientNamePlaceholder: 'ex. Amira Benali',
		recipientEmailLabel: 'E-mail du destinataire',
		recipientEmailPlaceholder: 'ex. amira@example.com',
		senderNameLabel: 'Votre nom',
		senderNamePlaceholder: 'ex. Yacine',
		messageLabel: 'Message personnel (facultatif)',
		messagePlaceholder: 'Joyeux anniversaire ! Choisis bien ta nouvelle technologie…',
		requiredError: 'Ce champ est obligatoire.',
		emailError: 'Veuillez saisir une adresse e-mail valide.',
		amountError: 'Veuillez choisir un montant entre 500 DA et 50 000 DA.',
		errorSummary: 'Veuillez corriger les erreurs suivantes :',
		previewButton: 'Prévisualiser la carte cadeau',
		previewTitle: 'Aperçu de votre carte cadeau',
		previewText: 'Voici à quoi ressemblerait la carte cadeau démo. Rien n’a été envoyé.',
		previewTo: 'Pour {name}',
		previewFrom: 'De la part de {name}',
		previewCodeHint: 'Astuce démo : essayez le code {code} dans la vérification du solde ci-dessous.',
		sendAnother: 'Créer une autre carte cadeau',
		balanceTitle: 'Consulter le solde d’une carte cadeau',
		balanceDescription:
			'Saisissez un code de carte cadeau démo pour voir son solde fictif. Essayez DEMO-1000, DEMO-2500 ou DEMO-5000.',
		balanceCodeLabel: 'Code de la carte cadeau',
		balanceCodePlaceholder: 'ex. DEMO-1000',
		balanceButton: 'Vérifier le solde',
		balanceCodeError: 'Veuillez saisir un code de carte cadeau.',
		balanceFound: 'Solde démo pour {code} : {amount}. Ce solde est fictif et ne peut pas être dépensé.',
		balanceNotFound:
			'Aucune carte démo trouvée avec le code « {code} ». Essayez DEMO-1000, DEMO-2500 ou DEMO-5000.',
		howTitle: 'Comment fonctionnent les cartes cadeaux démo',
		howSteps: [
			'Choisissez un montant et ajoutez un message personnel, puis prévisualisez la carte cadeau.',
			'En démo, aucun e-mail n’est envoyé et aucun paiement n’est effectué : l’aperçu reste dans votre navigateur.',
			'Vérifiez un solde fictif avec un code DEMO-… ci-dessus : il sert uniquement à illustrer le fonctionnement.'
		]
	},
	helpPage: {
		title: 'Centre d’aide',
		description:
			'Trouvez des réponses sur la livraison, les retours, les paiements et les commandes — ou contactez-nous.',
		demoNote:
			'Tout ce qui figure ici décrit la boutique démo : aucune commande, aucun paiement ni aucune livraison réelle n’a lieu.',
		topicsTitle: 'Parcourir les rubriques d’aide',
		topics: [
			{
				title: 'Questions fréquentes',
				description:
					'Réponses rapides sur la livraison, les retours, le paiement, la garantie et les commandes.'
			},
			{
				title: 'Livraison',
				description: 'Livraison démo gratuite en 24/48h, régions couvertes et suivi.'
			},
			{
				title: 'Retours et échanges',
				description: 'Retours démo sous 30 jours, retour gratuit et délais de remboursement.'
			},
			{
				title: 'Moyens de paiement',
				description:
					'Cartes, paiement à la livraison et versements — aucun paiement réel n’est effectué.'
			},
			{
				title: 'Suivi de commande',
				description: 'Consultez le statut d’une commande démo avec son code de commande.'
			},
			{
				title: 'Contactez-nous',
				description:
					'Envoyez un message à l’équipe d’assistance démo sur tout sujet lié à la boutique.'
			}
		],
		topicLink: 'En savoir plus',
		popularTitle: 'Questions populaires',
		popularIntro:
			'Des réponses courtes aux questions les plus posées par les acheteurs. Consultez la page FAQ pour la liste complète.',
		popular: [
			{
				question: 'Combien coûte la livraison ?',
				answer:
					'La livraison est gratuite sur toutes les commandes démo, avec une arrivée estimée en 24/48h. Rien n’est réellement expédié.'
			},
			{
				question: 'Combien de temps ai-je pour retourner un produit ?',
				answer:
					'Vous avez 30 jours à compter de la date de livraison démo. Les retours sont uniquement illustratifs dans cette démo.'
			},
			{
				question: 'Quels moyens de paiement puis-je utiliser ?',
				answer:
					'La commande démo propose les cartes, le paiement à la livraison et les versements. Aucun paiement réel n’est jamais effectué.'
			},
			{
				question: 'Comment suivre ma commande ?',
				answer:
					'Utilisez la page de suivi de commande avec votre numéro de commande démo. L’historique des commandes reste uniquement dans votre navigateur.'
			}
		],
		faqLink: 'Voir toutes les questions fréquentes',
		contactTitle: 'Besoin d’aide supplémentaire ?',
		contactText:
			'Notre équipe d’assistance démo se fera un plaisir de répondre à toute question sur la boutique.',
		contactLink: 'Contactez-nous'
	},
	newArrivalsPage: {
		title: 'Nouveautés',
		description:
			'Les dernières technologies arrivées chez TechDova : téléphones, audio, montres connectées et gaming.',
		empty: 'Aucune nouveauté ne correspond à vos filtres',
		emptyHint: 'Essayez d’effacer les filtres ou parcourez toute la boutique.',
		browseShop: 'Parcourir la boutique',
		categoryLabel: 'Catégorie',
		allCategories: 'Toutes les catégories',
		maxPriceLabel: 'Prix maximum',
		priceAny: 'Tous les prix',
		maxPriceValue: 'Jusqu’à {price}'
	},
	bestSellersPage: {
		title: 'Meilleures ventes',
		description:
			'Nos produits les plus appréciés, notés par les clients — la technologie que les acheteurs reviennent chercher.',
		empty: 'Aucune meilleure vente ne correspond à vos filtres',
		emptyHint: 'Essayez d’effacer les filtres ou parcourez toute la boutique.',
		browseShop: 'Parcourir la boutique',
		categoryLabel: 'Catégorie',
		allCategories: 'Toutes les catégories',
		maxPriceLabel: 'Prix maximum',
		priceAny: 'Tous les prix',
		maxPriceValue: 'Jusqu’à {price}'
	},
	addresses: {
		title: 'Adresses enregistrées',
		description: 'Adresses de livraison enregistrées dans ce navigateur pour la commande démo.',
		demoNote:
			'Démo uniquement : les adresses sont stockées uniquement dans ce navigateur et ne sont jamais envoyées. Cette démo ne demande jamais de coordonnées de paiement.',
		empty: 'Aucune adresse enregistrée pour le moment',
		emptyHint: 'Ajoutez une adresse pour la réutiliser lors de la commande démo.',
		addButton: 'Ajouter une adresse',
		editButton: 'Modifier',
		editLabel: 'Modifier l’adresse de {name}',
		deleteButton: 'Supprimer',
		deleteLabel: 'Supprimer l’adresse de {name}',
		formTitleAdd: 'Ajouter une adresse',
		formTitleEdit: 'Modifier l’adresse',
		nameLabel: 'Nom complet',
		namePlaceholder: 'ex. Amira Benali',
		streetLabel: 'Adresse',
		streetPlaceholder: 'ex. 12 rue Didouche Mourad',
		cityLabel: 'Ville',
		cityPlaceholder: 'ex. Alger',
		postalLabel: 'Code postal',
		postalPlaceholder: 'ex. 16000',
		phoneLabel: 'Téléphone (facultatif)',
		phonePlaceholder: 'ex. +213 21 00 00 00',
		requiredError: 'Ce champ est obligatoire.',
		errorSummary: 'Veuillez corriger les erreurs suivantes :',
		saveButton: 'Enregistrer l’adresse',
		cancelButton: 'Annuler'
	},
	cookieConsent: {
		bannerTitle: 'Votre vie privée, en toute honnêteté',
		bannerText:
			'TechDova n’utilise aucun cookie de suivi ni aucun outil d’analyse. Les seules données stockées sur votre appareil sont votre panier, vos favoris, le thème et la langue, conservés dans votre navigateur.',
		accept: 'Accepter',
		decline: 'Refuser',
		customize: 'Personnaliser',
		learnMore: 'En savoir plus',
		learnMoreLabel: 'En savoir plus sur notre politique de cookies',
		learnMoreSuffix: 'sur notre politique de cookies',
		modalTitle: 'Paramètres des cookies et du stockage',
		modalIntro:
			'Cette boutique démo ne définit aucun cookie — ni de suivi ni d’aucune autre sorte. Tout ce qui suit est stocké uniquement dans votre propre navigateur, via le stockage local, et n’est jamais envoyé à un serveur.',
		storageTitle: 'Ce qui est stocké sur votre appareil',
		storageText:
			'Votre panier, vos favoris, votre liste de comparaison, vos commandes démo, votre profil de compte démo, vos adresses enregistrées, vos produits récemment consultés, vos votes sur les avis, votre langue et votre thème. Chaque élément existe uniquement pour que la démo fonctionne d’une visite à l’autre.',
		trackersTitle: 'Ce qui n’est jamais stocké',
		trackersText:
			'Aucun cookie de suivi, aucune analyse, aucun identifiant publicitaire et aucune requête tierce. Il n’y a rien à refuser, car rien ne vous observe ici.',
		declineNote:
			'Refuser ne change rien : il n’y a aucun outil de suivi à désactiver, et le site fonctionne exactement de la même façon dans tous les cas. Votre choix est mémorisé uniquement sur cet appareil.',
		clearData: 'Effacer mes données stockées',
		clearDataDone:
			'Données stockées effacées. Votre panier, vos favoris, votre thème, votre langue et vos autres données démo ont été supprimés de ce navigateur.',
		close: 'Fermer les paramètres',
		choiceSaved: 'Votre choix a été enregistré sur cet appareil.'
	},
	chatWidget: {
		buttonLabel: 'Ouvrir le chat en direct (démo)',
		closeLabel: 'Fermer le chat',
		title: 'Chat TechDova',
		subtitle: 'Assistant démo — réponses prédéfinies instantanées',
		demoNote:
			'Chat démo : un petit ensemble de réponses prédéfinies, fonctionnant entièrement dans votre navigateur. Aucun message n’est envoyé et personne ne les lit.',
		greeting:
			'Bonjour ! Je suis l’assistant démo de TechDova. Posez une question sur la livraison, les retours, le suivi, le paiement ou la garantie — ou touchez une suggestion ci-dessous.',
		inputLabel: 'Votre message',
		placeholder: 'Écrivez une question…',
		sendLabel: 'Envoyer le message',
		typingLabel: 'L’assistant écrit…',
		quickLabel: 'Questions rapides',
		quickShipping: 'Quelle est la rapidité de livraison ?',
		quickReturns: 'Comment fonctionnent les retours ?',
		quickTracking: 'Comment suivre ma commande ?',
		quickContact: 'Comment contacter une personne ?',
		answerGreeting:
			'Bonjour ! Je suis ravi de vous aider. Essayez de poser une question sur la livraison, les retours, le suivi de commande, le paiement ou la garantie.',
		answerShipping:
			'La livraison est gratuite sur toutes les commandes démo, avec une arrivée estimée en 24/48h. Rien n’est réellement expédié — consultez la page d’informations de livraison pour les régions démo.',
		answerReturns:
			'Vous avez 30 jours à compter de la date de livraison démo pour retourner un produit, avec retour gratuit dans cette démo. Les retours sont uniquement illustratifs : rien n’est collecté et aucun remboursement n’est effectué. Consultez la page des retours pour les étapes.',
		answerTracking:
			'Utilisez la page de suivi de commande avec votre numéro de commande démo. L’historique des commandes est stocké uniquement dans ce navigateur : le suivi fonctionne donc sur l’appareil où la commande a été passée.',
		answerPayment:
			'La commande démo propose les cartes, le paiement à la livraison et les versements. Aucun paiement réel n’est effectué et aucune donnée de carte ne quitte votre appareil — ne saisissez jamais de vraies coordonnées bancaires sur un site démo.',
		answerWarranty:
			'Chaque produit démo comprend une garantie constructeur de 2 ans, et des plans étendus démo sont présentés sur la page de garantie. Aucun plan n’est vendu et aucune réclamation ne peut réellement être déposée.',
		answerContact:
			'Vous pouvez joindre l’équipe d’assistance démo via la page de contact — le formulaire est validé localement et rien n’est envoyé.',
		fallback:
			'Je ne connais que quelques sujets démo : la livraison, les retours, le suivi de commande, le paiement, la garantie et le contact. Pourriez-vous essayer l’un de ceux-ci ?'
	},
	brandsPage: {
		title: 'Acheter par marque',
		description:
			'Parcourez le catalogue TechDova par marque, des téléphones et ordinateurs au gaming et aux accessoires.',
		demoNote:
			'Catalogue démo : 12 produits et 7 marques. Les noms de marques sont utilisés uniquement à des fins de démonstration.',
		productsCount: '{count} produits',
		productOne: '1 produit',
		shopBrand: 'Voir tout {brand}',
		previewLabel: 'Produits {brand}',
		browseShop: 'Parcourir toute la boutique'
	},
	rewardsPage: {
		title: 'TechDova Rewards',
		description:
			'Gagnez des points sur vos commandes démo, gravissez les niveaux et débloquez des avantages fictifs. Un programme de fidélité de démonstration — rien n’est suivi et rien n’est envoyé.',
		demoNote:
			'Programme démo : les points, niveaux et avantages sont fictifs. L’inscription ne stocke rien et n’envoie rien.',
		howTitle: 'Comment ça marche',
		howSteps: [
			'Gagnez 1 point pour chaque tranche de 10 DA dépensée dans une commande démo.',
			'Accumulez des points pour passer de Bronze à Argent puis à Or.',
			'Échangez 100 points contre 100 DA de réduction sur une commande démo — un crédit fictif, jamais débité.'
		],
		tiersTitle: 'Niveaux de membre',
		tiers: [
			{
				name: 'Bronze',
				threshold: 'Dès 0 point',
				description: 'Tout le monde commence ici.',
				perks: ['1 point par tranche de 10 DA dépensée', 'Attention démo d’anniversaire', 'Accès anticipé aux offres démo']
			},
			{
				name: 'Argent',
				threshold: 'Dès 500 points',
				description: 'Pour les acheteurs démo fidèles.',
				perks: ['Tout Bronze', 'Week-ends à points doublés (démo)', 'Emballage cadeau démo gratuit']
			},
			{
				name: 'Or',
				threshold: 'Dès 1 500 points',
				description: 'Nos membres démo les plus fidèles.',
				perks: ['Tout Argent', 'Support démo prioritaire', 'Offres démo exclusives Or']
			}
		],
		joinTitle: 'Rejoindre Rewards (démo)',
		joinText: 'Saisissez un nom et un e-mail pour voir l’écran de bienvenue démo. Rien n’est stocké ni envoyé.',
		nameLabel: 'Nom complet',
		namePlaceholder: 'Votre nom',
		emailLabel: 'Adresse e-mail',
		emailPlaceholder: 'vous@exemple.com',
		joinButton: 'Rejoindre Rewards',
		requiredError: 'Ce champ est obligatoire.',
		emailError: 'Veuillez saisir une adresse e-mail valide.',
		errorSummary: 'Veuillez corriger les erreurs suivantes :',
		successTitle: 'Bienvenue dans TechDova Rewards !',
		successText:
			'Merci {name} — vous êtes membre démo Bronze. Il s’agit uniquement d’un écran de confirmation local : aucun compte n’a été créé et rien n’a été envoyé.',
		joinAnother: 'S’inscrire avec d’autres coordonnées'
	},
	tradeInPage: {
		title: 'Reprenez votre appareil',
		description:
			'Estimez ce que votre ancien appareil pourrait valoir en crédit de reprise démo pour votre prochaine technologie.',
		demoNote:
			'Estimateur démo : aucun appareil n’est collecté, aucun crédit n’est émis et rien n’est envoyé.',
		categoryLabel: 'Type d’appareil',
		deviceTypes: ['Smartphone', 'Ordinateur portable', 'Tablette', 'Montre connectée', 'Casque audio', 'Console de jeux'],
		conditionLabel: 'État',
		conditions: ['Comme neuf', 'Bon', 'Correct', 'Mauvais'],
		conditionHints: [
			'Aucune rayure, fonctionne parfaitement',
			'Légère usure, fonctionne parfaitement',
			'Usure visible, fonctionne bien',
			'Dommages ou pannes, s’allume encore'
		],
		ageLabel: 'Âge de l’appareil',
		ages: ['Moins d’1 an', '1–2 ans', '2–3 ans', 'Plus de 3 ans'],
		estimateTitle: 'Votre crédit démo estimé',
		estimateText: 'Crédit estimé : {amount}',
		estimateHint:
			'Cette estimation est uniquement illustrative, basée sur les valeurs démo ci-dessous. Une vraie reprise nécessiterait une inspection en personne.',
		howTitle: 'Comment fonctionne l’estimation démo',
		howText:
			'Chaque type d’appareil part d’une valeur de base démo, ajustée selon l’état et l’âge. Le calcul s’effectue entièrement dans votre navigateur.',
		disclaimer:
			'Démo uniquement : TechDova ne collecte pas d’appareils et n’émet pas de crédit de reprise. N’envoyez aucun appareil.',
		ctaTitle: 'Des questions sur la reprise ?',
		ctaText: 'Demandez à l’équipe d’assistance démo — le formulaire de contact est local et rien n’est envoyé.',
		ctaLink: 'Contactez-nous'
	},
	financingPage: {
		title: 'Financement et versements',
		description:
			'Divisez un achat en paiements mensuels grâce au calculateur de versements démo — 0 % d’intérêt, aucuns frais, aucune vérification de crédit.',
		demoNote:
			'Démo uniquement : aucun contrat de financement n’est proposé, aucune vérification de crédit n’a lieu et aucun plan de versements n’est créé.',
		calculatorTitle: 'Calculateur de versements',
		priceLabel: 'Prix d’achat',
		monthsLabel: 'Payer sur',
		months: ['3 mois', '6 mois', '12 mois', '24 mois'],
		monthlyLabel: 'Paiement mensuel',
		monthlyText: '{amount} par mois',
		totalLabel: 'Total à payer',
		totalText: '{amount} — 0 % d’intérêt démo, aucuns frais',
		calculatorNote:
			'Le calculateur fonctionne entièrement dans votre navigateur. Modifier le prix ou la durée met à jour le résultat instantanément.',
		bnplTitle: 'Achetez maintenant, payez plus tard (démo)',
		bnplText:
			'Les versements de type BNPL diviseraient un achat en paiements mensuels égaux sans intérêt dans cette démo. Dans une vraie boutique, des conditions d’éligibilité, des frais et des pénalités de retard s’appliqueraient — ici, rien de tout cela n’existe.',
		stepsTitle: 'Comment fonctionneraient les versements démo',
		steps: [
			'Choisissez un produit et sélectionnez les versements lors de la commande démo.',
			'Choisissez une durée : 3, 6, 12 ou 24 paiements mensuels.',
			'Payez le même montant chaque mois — 0 % d’intérêt dans cette démo.',
			'Dans cette démo, aucun plan n’est créé et aucun paiement n’est effectué.'
		],
		disclaimer:
			'Explication démo uniquement : TechDova ne propose aucun crédit. Ne partagez jamais vos coordonnées bancaires ou de carte sur un site démo.'
	},
	warrantyPage: {
		title: 'Garantie étendue',
		description:
			'Comparez les plans de protection démo qui étendent votre couverture au-delà de la garantie constructeur incluse.',
		demoNote:
			'Plans démo : aucune garantie n’est vendue, aucune réclamation ne peut être déposée et rien n’est débité. Les prix sont fictifs.',
		includedTitle: 'Inclus avec chaque produit',
		includedText:
			'Chaque produit du catalogue démo comprend une garantie constructeur de 2 ans couvrant les défauts de fabrication. Les plans étendus ci-dessous ajouteraient une couverture des dommages accidentels et un support démo plus rapide.',
		plansTitle: 'Plans de protection',
		plans: [
			{
				name: 'Standard',
				duration: '2 ans inclus',
				description: 'La garantie constructeur, déjà incluse.',
				features: ['Défauts de fabrication couverts', 'Support démo par e-mail', 'Délai de réparation standard']
			},
			{
				name: 'Plus',
				duration: '3 ans au total',
				description: 'Une année supplémentaire, plus la couverture accident.',
				features: [
					'Tout Standard',
					'Couverture des dommages accidentels (démo)',
					'Une année de couverture supplémentaire',
					'Support démo prioritaire'
				]
			},
			{
				name: 'Premium',
				duration: '4 ans au total',
				description: 'La couverture démo la plus complète que nous présentons.',
				features: [
					'Tout Plus',
					'Deux années de couverture supplémentaires',
					'Remplacement express démo',
					'Remplacement de la batterie (démo)'
				]
			}
		],
		perYear: 'par an',
		includedLabel: 'Inclus gratuitement',
		planNote: 'Prix démo affichés par année de couverture, par appareil. Rien n’est débité.',
		notCoveredTitle: 'Ce qui n’est jamais couvert',
		notCovered: [
			'Perte ou vol',
			'Dommage délibéré',
			'Usure normale, comme les écrans rayés par une utilisation quotidienne',
			'Problèmes logiciels ou perte de données'
		],
		ctaTitle: 'Des questions sur la couverture ?',
		ctaText: 'Consultez le centre d’aide ou demandez à l’équipe d’assistance démo — rien de ce que vous envoyez ne quitte votre appareil.',
		helpLink: 'Visiter le centre d’aide',
		contactLink: 'Contactez-nous'
	},
	cookiesPage: {
		title: 'Politique en matière de cookies et de stockage',
		description:
			'Un compte rendu honnête de ce que TechDova stocke dans votre navigateur : aucun cookie, aucun outil de suivi, uniquement des données démo locales.',
		updated: 'Dernière mise à jour : 17 novembre 2026',
		intro:
			'TechDova est une boutique démo entièrement statique. Elle ne définit aucun cookie — ni pour le suivi, l’analyse, la publicité ou quoi que ce soit d’autre. Cette page énumère tout ce que le site stocke dans votre navigateur, et pourquoi.',
		noCookiesTitle: 'Aucun cookie, aucun outil de suivi',
		noCookiesText:
			'Comme il n’y a aucun outil de suivi, il n’y a rien à refuser : accepter ou refuser la bannière des cookies ne change rien au suivi. Aucun cookie de première ou de tierce partie n’est défini, aucun script d’analyse ne s’exécute et aucune requête n’est adressée à un serveur externe à des fins de suivi. Le site fonctionne entièrement hors ligne une fois chargé.',
		storageTitle: 'Ce qui est stocké dans votre navigateur',
		storageIntro:
			'Le site utilise le stockage local (localStorage) de votre navigateur, ainsi qu’une entrée en stockage de session (sessionStorage), pour que la démo se souvienne de vos choix d’une visite à l’autre. Tout reste sur votre appareil et peut être effacé ci-dessous ou depuis les paramètres de votre navigateur.',
		storageRows: [
			{ key: 'techdova-cart', purpose: 'Le contenu de votre panier, pour que les articles y restent d’une visite à l’autre.' },
			{ key: 'techdova-promo', purpose: 'Le code promo appliqué à votre panier, pour que la réduction survive aux rechargements.' },
			{ key: 'techdova-wishlist', purpose: 'Les produits enregistrés dans vos favoris.' },
			{ key: 'techdova-compare', purpose: 'Les produits de votre liste de comparaison.' },
			{
				key: 'techdova-orders',
				purpose: 'Les commandes démo passées dans ce navigateur, affichées sur les pages de compte et de suivi.'
			},
			{ key: 'techdova-account', purpose: 'Le nom et l’e-mail de votre compte démo (aucun mot de passe n’est jamais stocké).' },
			{ key: 'techdova-addresses', purpose: 'Les adresses de livraison enregistrées pour la commande démo.' },
			{ key: 'techdova-recently-viewed', purpose: 'Les produits récemment consultés, pour la bande des produits consultés.' },
			{
				key: 'techdova-review-votes',
				purpose: 'Les avis démo que vous avez marqués comme utiles, pour éviter de voter deux fois.'
			},
			{
				key: 'techdova-locale',
				purpose: 'Votre choix de langue (anglais ou français), pour que la page d’accueil puisse en tenir compte.'
			},
			{ key: 'techdova-theme', purpose: 'Votre choix de thème clair/sombre.' },
			{ key: 'techdova-cookie-consent', purpose: 'Votre choix sur la bannière des cookies, pour ne pas la redemander.' },
			{
				key: 'techdova-checkout',
				purpose: 'Un brouillon de commande conservé en stockage de session (effacé à la fermeture de l’onglet). Les coordonnées de carte ne sont jamais stockées.'
			}
		],
		choicesTitle: 'Vos choix',
		choicesText:
			'Vous pouvez rouvrir les paramètres des cookies à tout moment grâce au lien « Paramètres des cookies » dans le pied de page. Effacer vos données stockées ci-dessous supprime tout ce qui est énuméré ci-dessus de ce navigateur.',
		clearData: 'Effacer mes données stockées',
		clearDataDone:
			'Données stockées effacées. Votre panier, vos favoris, votre thème, votre langue et vos autres données démo ont été supprimés de ce navigateur.',
		browserText:
			'Vous pouvez également effacer ces données depuis les paramètres de votre navigateur à tout moment : recherchez « données du site » ou « stockage » pour ce site.'
	},
	notFound: {
		eyebrow: 'Erreur 404',
		title: 'Page introuvable',
		description: 'Désolé, la page que vous recherchez n’existe pas ou a été déplacée.',
		backHome: 'Retour à l’accueil',
		searchLabel: 'Rechercher dans le catalogue',
		searchPlaceholder: 'Rechercher des produits…',
		searchButton: 'Rechercher',
		bestSellersTitle: 'Nos meilleures ventes',
		popularTitle: 'Pages populaires'
	}
};
