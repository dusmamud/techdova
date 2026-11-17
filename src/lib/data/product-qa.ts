import type { LocalizedString } from '#lib/i18n/index';

/**
 * Demo product Q&As shown on product pages. All questions and answers are
 * illustrative demo content (the section is labelled as such in the UI);
 * answers only state facts already present in the catalogue data (specs,
 * box contents, demo policies) so nothing here invents product claims.
 */
export type ProductQA = {
	question: LocalizedString;
	answer: LocalizedString;
};

const qa: Record<string, ProductQA[]> = {
	'iphone-15-pro': [
		{
			question: { en: 'Does it come with a charger in the box?', fr: 'Un chargeur est-il fourni dans la boîte ?' },
			answer: {
				en: 'No — the box includes the phone, a USB-C cable, a SIM ejector tool and a quick start guide. Any USB-C charger works, including the MagSafe Charger.',
				fr: 'Non — la boîte contient le téléphone, un câble USB-C, un outil d’éjection de la carte SIM et un guide de démarrage rapide. Tout chargeur USB-C convient, y compris le chargeur MagSafe.'
			}
		},
		{
			question: { en: 'What is the difference between the storage options?', fr: 'Quelle est la différence entre les options de stockage ?' },
			answer: {
				en: 'Only the storage capacity changes (128 GB, 256 GB or 512 GB). The chip, cameras, display and battery are identical across all three.',
				fr: 'Seule la capacité de stockage change (128 Go, 256 Go ou 512 Go). La puce, les appareils photo, l’écran et la batterie sont identiques sur les trois modèles.'
			}
		},
		{
			question: { en: 'Is the battery really up to 23 hours of video?', fr: 'La batterie tient-elle vraiment jusqu’à 23 heures de vidéo ?' },
			answer: {
				en: 'That is the figure in the product specifications for video playback. Real-world battery life depends on brightness, network and how you use the phone.',
				fr: 'C’est le chiffre indiqué dans les caractéristiques du produit pour la lecture vidéo. L’autonomie réelle dépend de la luminosité, du réseau et de votre usage du téléphone.'
			}
		}
	],
	'galaxy-s24': [
		{
			question: { en: 'Does Galaxy AI work without an internet connection?', fr: 'Galaxy AI fonctionne-t-il sans connexion Internet ?' },
			answer: {
				en: 'Some Galaxy AI features run on the device, while others need an internet connection and an account. This demo page cannot verify live feature availability.',
				fr: 'Certaines fonctions Galaxy AI s’exécutent sur l’appareil, tandis que d’autres nécessitent une connexion Internet et un compte. Cette page de démonstration ne peut pas vérifier la disponibilité réelle des fonctions.'
			}
		},
		{
			question: { en: 'Which storage size should I choose?', fr: 'Quelle capacité de stockage choisir ?' },
			answer: {
				en: '128 GB suits light use, 256 GB is the balanced choice for most people, and 512 GB is for large photo, video and game libraries. The rest of the phone is identical.',
				fr: '128 Go conviennent à un usage léger, 256 Go sont le choix équilibré pour la plupart des gens, et 512 Go sont destinés aux grandes bibliothèques de photos, vidéos et jeux. Le reste du téléphone est identique.'
			}
		}
	],
	'macbook-air-m2': [
		{
			question: { en: 'Is 8 GB of memory enough?', fr: '8 Go de mémoire suffisent-ils ?' },
			answer: {
				en: 'For browsing, study, office work and light creative work, yes — the specifications list 8 GB of unified memory. Very heavy video or 3D workloads benefit from more.',
				fr: 'Pour la navigation, les études, le travail de bureau et la création légère, oui — les caractéristiques indiquent 8 Go de mémoire unifiée. Les charges très lourdes en vidéo ou 3D profitent d’une mémoire supérieure.'
			}
		},
		{
			question: { en: 'Does it have a fan?', fr: 'Est-il équipé d’un ventilateur ?' },
			answer: {
				en: 'No. The MacBook Air M2 uses a fanless design, so it stays silent. The trade-off is that sustained heavy loads may run warmer than on fanned laptops.',
				fr: 'Non. Le MacBook Air M2 utilise un design sans ventilateur, il reste donc silencieux. En contrepartie, les charges lourdes prolongées peuvent le rendre plus chaud que les portables ventilés.'
			}
		},
		{
			question: { en: 'What is in the box?', fr: 'Que contient la boîte ?' },
			answer: {
				en: 'The laptop, a 30W USB-C power adapter, a USB-C to MagSafe 3 cable and a quick start guide. See the “What’s in the box” section on this page.',
				fr: 'L’ordinateur portable, un adaptateur secteur USB-C 30 W, un câble USB-C vers MagSafe 3 et un guide de démarrage rapide. Voir la section « Contenu de la boîte » sur cette page.'
			}
		}
	],
	'dell-xps-13': [
		{
			question: { en: 'Can I upgrade the storage later?', fr: 'Puis-je augmenter le stockage plus tard ?' },
			answer: {
				en: 'Choose the storage size you need at purchase — 512 GB or 1 TB — because later upgrades are not part of this demo offer and may require service.',
				fr: 'Choisissez la capacité de stockage dont vous avez besoin à l’achat — 512 Go ou 1 To — car les mises à niveau ultérieures ne font pas partie de cette offre de démonstration et peuvent nécessiter une intervention.'
			}
		},
		{
			question: { en: 'Does the 13.4" display support touch?', fr: 'L’écran 13,4" est-il tactile ?' },
			answer: {
				en: 'The specifications for this model list a 13.4" Full HD+ display without touch. If touch matters to you, check the specifications before ordering.',
				fr: 'Les caractéristiques de ce modèle indiquent un écran 13,4" Full HD+ sans tactile. Si le tactile est important pour vous, vérifiez les caractéristiques avant de commander.'
			}
		}
	],
	'airpods-pro': [
		{
			question: { en: 'How long does the battery last?', fr: 'Quelle est l’autonomie de la batterie ?' },
			answer: {
				en: 'Up to 6 hours on a single charge, and up to 30 hours in total with the charging case, according to the specifications.',
				fr: 'Jusqu’à 6 heures avec une seule charge, et jusqu’à 30 heures au total avec le boîtier de charge, selon les caractéristiques.'
			}
		},
		{
			question: { en: 'Are extra ear tips included?', fr: 'Des embouts supplémentaires sont-ils fournis ?' },
			answer: {
				en: 'Yes — silicone ear tips in four sizes are included, so you can find the fit that seals best for noise cancellation.',
				fr: 'Oui — des embouts en silicone en quatre tailles sont fournis, pour trouver l’ajustement qui isole le mieux pour la réduction du bruit.'
			}
		},
		{
			question: { en: 'Can I charge them with the MagSafe Charger?', fr: 'Puis-je les charger avec le chargeur MagSafe ?' },
			answer: {
				en: 'Yes. The charging case supports MagSafe and USB-C charging, so the MagSafe Charger sold here works with it.',
				fr: 'Oui. Le boîtier de charge prend en charge la charge MagSafe et USB-C, le chargeur MagSafe vendu ici est donc compatible.'
			}
		}
	],
	'sony-wh1000xm5': [
		{
			question: { en: 'How good is the noise cancelling on planes?', fr: 'La réduction de bruit est-elle efficace en avion ?' },
			answer: {
				en: 'These are listed with industry-leading noise cancelling and a 30-hour battery, which is exactly the combination frequent flyers look for. Individual experience varies with fit.',
				fr: 'Elles sont décrites avec une réduction de bruit de référence et une batterie de 30 heures, exactement la combinaison recherchée par les voyageurs fréquents. L’expérience individuelle varie selon l’ajustement.'
			}
		},
		{
			question: { en: 'Can I use them wired?', fr: 'Puis-je les utiliser en filaire ?' },
			answer: {
				en: 'Yes — a headphone cable is included in the box for wired listening, and the USB-C cable handles charging.',
				fr: 'Oui — un câble pour casque est fourni dans la boîte pour l’écoute filaire, et le câble USB-C sert à la charge.'
			}
		},
		{
			question: { en: 'Why is the Silver colour out of stock?', fr: 'Pourquoi la couleur Argent est-elle en rupture de stock ?' },
			answer: {
				en: 'Demo stock for the Silver variant is currently zero, so it cannot be ordered. Black and Midnight Blue remain available in this demo catalogue.',
				fr: 'Le stock de démonstration de la variante Argent est actuellement à zéro, elle ne peut donc pas être commandée. Les couleurs Noir et Bleu nuit restent disponibles dans ce catalogue de démonstration.'
			}
		}
	],
	'galaxy-watch-6': [
		{
			question: { en: 'Does it work with an iPhone?', fr: 'Fonctionne-t-elle avec un iPhone ?' },
			answer: {
				en: 'The Galaxy Watch 6 is designed for Android phones, and works best with a Samsung Galaxy phone. Pairing with other phones is limited, so check compatibility before ordering.',
				fr: 'La Galaxy Watch 6 est conçue pour les téléphones Android et fonctionne au mieux avec un téléphone Samsung Galaxy. L’appairage avec d’autres téléphones est limité, vérifiez donc la compatibilité avant de commander.'
			}
		},
		{
			question: { en: 'Is it safe to swim with?', fr: 'Peut-on nager avec ?' },
			answer: {
				en: 'It is rated 5 ATM water resistant, which covers swimming. It is not rated for diving or high-pressure water activities.',
				fr: 'Elle est certifiée résistante à l’eau 5 ATM, ce qui couvre la natation. Elle n’est pas certifiée pour la plongée ni les activités aquatiques à haute pression.'
			}
		}
	],
	'apple-watch-9': [
		{
			question: { en: 'Does it work with Android phones?', fr: 'Fonctionne-t-elle avec les téléphones Android ?' },
			answer: {
				en: 'No — Apple Watch requires an iPhone for setup and most features. It is the right choice if you already use an iPhone.',
				fr: 'Non — l’Apple Watch nécessite un iPhone pour la configuration et la plupart des fonctions. C’est le bon choix si vous utilisez déjà un iPhone.'
			}
		},
		{
			question: { en: 'What does the Double Tap gesture do?', fr: 'À quoi sert le geste Double Tap ?' },
			answer: {
				en: 'Double Tap lets you tap your index finger and thumb together twice to answer calls, play or pause media, and control the watch without touching the screen.',
				fr: 'Le geste Double Tap permet de taper deux fois l’index et le pouce ensemble pour répondre aux appels, lancer ou mettre en pause un média, et contrôler la montre sans toucher l’écran.'
			}
		},
		{
			question: { en: 'How often do I need to charge it?', fr: 'À quelle fréquence faut-il la charger ?' },
			answer: {
				en: 'Battery life is up to 18 hours according to the specifications, so most people charge it daily — the magnetic fast charger is included.',
				fr: 'L’autonomie est de 18 heures maximum selon les caractéristiques, la plupart des gens la chargent donc quotidiennement — le chargeur rapide magnétique est fourni.'
			}
		}
	],
	'dualsense-controller': [
		{
			question: { en: 'Does it work on PC?', fr: 'Fonctionne-t-elle sur PC ?' },
			answer: {
				en: 'Yes — it connects via Bluetooth or USB-C, and many PC games support it. Some advanced features, like adaptive triggers, depend on the game.',
				fr: 'Oui — elle se connecte en Bluetooth ou USB-C, et de nombreux jeux PC la prennent en charge. Certaines fonctions avancées, comme les gâchettes adaptatives, dépendent du jeu.'
			}
		},
		{
			question: { en: 'How long does the battery last?', fr: 'Quelle est l’autonomie de la batterie ?' },
			answer: {
				en: 'Up to 12 hours according to the specifications. A USB-C cable is included for charging and wired play.',
				fr: 'Jusqu’à 12 heures selon les caractéristiques. Un câble USB-C est fourni pour la charge et le jeu filaire.'
			}
		}
	],
	'nintendo-switch': [
		{
			question: { en: 'Are games included?', fr: 'Des jeux sont-ils inclus ?' },
			answer: {
				en: 'No games are included — the box holds the console, Joy-Con controllers, dock, HDMI cable and AC adapter. Games are bought separately.',
				fr: 'Aucun jeu n’est inclus — la boîte contient la console, les manettes Joy-Con, la station d’accueil, le câble HDMI et l’adaptateur secteur. Les jeux s’achètent séparément.'
			}
		},
		{
			question: { en: 'What is the difference between the colour options?', fr: 'Quelle est la différence entre les options de couleur ?' },
			answer: {
				en: 'Only the Joy-Con colours differ: Neon Blue / Neon Red, or Grey. The console, screen, storage and battery are identical.',
				fr: 'Seules les couleurs des Joy-Con diffèrent : Bleu néon / rouge néon, ou Gris. La console, l’écran, le stockage et la batterie sont identiques.'
			}
		},
		{
			question: { en: 'Can two people play with one console?', fr: 'Deux personnes peuvent-elles jouer avec une seule console ?' },
			answer: {
				en: 'Yes — the two detachable Joy-Con controllers can be used as two separate controllers for multiplayer games that support it.',
				fr: 'Oui — les deux manettes Joy-Con détachables peuvent servir de deux manettes séparées pour les jeux multijoueurs qui le permettent.'
			}
		}
	],
	'magsafe-charger': [
		{
			question: { en: 'Does it need a power adapter?', fr: 'Faut-il un adaptateur secteur ?' },
			answer: {
				en: 'Yes — the charger has an integrated USB-C cable, but the wall adapter is not included. A 20W or higher USB-C adapter gives the fastest charging.',
				fr: 'Oui — le chargeur a un câble USB-C intégré, mais l’adaptateur mural n’est pas fourni. Un adaptateur USB-C de 20 W ou plus offre la charge la plus rapide.'
			}
		},
		{
			question: { en: 'Will it work with a case on my phone?', fr: 'Fonctionne-t-il avec une coque sur mon téléphone ?' },
			answer: {
				en: 'Yes, with MagSafe-compatible cases. Thick cases or cases with metal can weaken the magnetic hold and slow charging.',
				fr: 'Oui, avec les coques compatibles MagSafe. Les coques épaisses ou métalliques peuvent affaiblir la fixation magnétique et ralentir la charge.'
			}
		}
	],
	'usb-c-hub': [
		{
			question: { en: 'Why is it out of stock?', fr: 'Pourquoi est-il en rupture de stock ?' },
			answer: {
				en: 'Demo stock for this hub is currently zero in both colours, so it cannot be ordered right now. Use the notify-me option on this page for demo restock updates.',
				fr: 'Le stock de démonstration de ce concentrateur est actuellement à zéro dans les deux couleurs, il ne peut donc pas être commandé pour le moment. Utilisez l’option de notification sur cette page pour les mises à jour de réassort de démonstration.'
			}
		},
		{
			question: { en: 'Does the HDMI port support 4K?', fr: 'Le port HDMI prend-il en charge la 4K ?' },
			answer: {
				en: 'Yes — the specifications list 4K output at 60Hz. Your laptop and display must also support 4K at 60Hz to get the full benefit.',
				fr: 'Oui — les caractéristiques indiquent une sortie 4K à 60 Hz. Votre ordinateur portable et votre écran doivent également prendre en charge la 4K à 60 Hz pour en profiter pleinement.'
			}
		},
		{
			question: { en: 'Can it charge my laptop while in use?', fr: 'Peut-il charger mon ordinateur portable pendant son utilisation ?' },
			answer: {
				en: 'Yes — it supports 100W pass-through charging, so a USB-C charger connected to the hub powers the laptop while the other ports stay in use.',
				fr: 'Oui — il prend en charge la charge pass-through 100 W, un chargeur USB-C branché au concentrateur alimente donc l’ordinateur portable pendant que les autres ports restent utilisés.'
			}
		}
	]
};

/** Demo Q&As for a product, or [] when a product has none. */
export function getProductQA(slug: string): ProductQA[] {
	return qa[slug] ?? [];
}
