import type { LocalizedString } from '#lib/i18n/index';

/** Demo tech-advice articles. Body copy is localized paragraph content. */
export type BlogPost = {
	slug: string;
	title: LocalizedString;
	excerpt: LocalizedString;
	body: LocalizedString[];
	dateISO: string;
	readingMinutes: number;
	image: string;
	imageAlt: LocalizedString;
	category: LocalizedString;
};

export const blogPosts: BlogPost[] = [
	{
		slug: 'choosing-noise-cancelling-headphones',
		title: {
			en: 'How to choose noise-cancelling headphones',
			fr: 'Comment choisir un casque à réduction de bruit'
		},
		excerpt: {
			en: 'Active noise cancellation, fit, battery life and price — what actually matters when you pick your next pair.',
			fr: 'Réduction active du bruit, confort, autonomie et prix — ce qui compte vraiment pour choisir votre prochaine paire.'
		},
		body: [
			{
				en: 'Noise-cancelling headphones have gone from a travel luxury to an everyday essential. Whether you work in a busy office, commute on a loud bus or simply want to focus at home, a good pair can transform your day. But with so many models on the market, knowing what to look for makes all the difference.',
				fr: 'Les casques à réduction de bruit sont passés du luxe de voyage à l’essentiel du quotidien. Que vous travailliez dans un bureau animé, preniez un bus bruyant ou souhaitiez simplement vous concentrer à la maison, une bonne paire peut transformer votre journée. Mais face à tant de modèles, savoir quoi chercher fait toute la différence.'
			},
			{
				en: 'Active noise cancellation (ANC) works by listening to the world around you and generating the opposite sound wave to cancel it out. It is most effective against constant, low-frequency sounds like engine hum and air conditioning. For sudden noises such as voices, a good physical seal from the earcups matters just as much, so always consider fit alongside the electronics.',
				fr: 'La réduction active du bruit fonctionne en écoutant le monde qui vous entoure et en générant l’onde sonore opposée pour l’annuler. Elle est particulièrement efficace contre les sons constants et graves comme le ronronnement d’un moteur ou la climatisation. Pour les bruits soudains comme les voix, une bonne isolation physique des coussinets compte tout autant : pensez donc au confort autant qu’à l’électronique.'
			},
			{
				en: 'Battery life is the next thing to weigh. Most over-ear models now offer 25 to 40 hours with ANC switched on, which covers a full working week for most people. If you travel often, look for fast charging: ten minutes plugged in can buy several hours of listening on many current models.',
				fr: 'L’autonomie est le critère suivant à peser. La plupart des modèles circum-auriculaires offrent aujourd’hui 25 à 40 heures avec la réduction de bruit activée, ce qui couvre une semaine de travail complète pour la plupart des gens. Si vous voyagez souvent, privilégiez la charge rapide : dix minutes branchées peuvent offrir plusieurs heures d’écoute sur de nombreux modèles actuels.'
			},
			{
				en: 'Comfort decides whether expensive headphones end up in a drawer. Lightweight designs with soft earcups and even clamping force win over long sessions. If you wear glasses, try to check how the earcups sit over the arms of your frames, and remember that on-ear models press directly on the ears while over-ear models surround them.',
				fr: 'Le confort détermine si un casque coûteux finira dans un tiroir. Les modèles légers avec des coussinets doux et une pression uniforme l’emportent sur les longues sessions. Si vous portez des lunettes, vérifiez comment les coussinets reposent sur les branches, et souvenez-vous que les modèles supra-auriculaires appuient directement sur les oreilles, tandis que les circum-auriculaires les entourent.'
			},
			{
				en: 'Finally, set your budget before you start comparing features. Excellent ANC is available at many price points, and paying more usually buys better microphones, nicer materials and small refinements rather than a dramatic jump in silence. Decide which features you will actually use — multipoint pairing, transparency mode, an app with an equalizer — and choose the pair that fits your life, not just the spec sheet.',
				fr: 'Enfin, fixez votre budget avant de comparer les fonctionnalités. Une excellente réduction de bruit existe à de nombreux niveaux de prix, et payer plus achète généralement de meilleurs microphones, de plus beaux matériaux et de petits raffinements plutôt qu’un bond spectaculaire en silence. Décidez quelles fonctionnalités vous utiliserez vraiment — connexion multipoint, mode transparence, application avec égaliseur — et choisissez la paire qui correspond à votre vie, pas seulement à la fiche technique.'
			}
		],
		dateISO: '2026-11-10',
		readingMinutes: 5,
		image: '/images/hero-main',
		imageAlt: {
			en: 'Smartphone, laptop, smartwatch and earbuds arranged on a white podium',
			fr: 'Smartphone, ordinateur portable, montre connectée et écouteurs sur un podium blanc'
		},
		category: { en: 'Buying guides', fr: 'Guides d’achat' }
	},
	{
		slug: 'laptop-buying-guide-2026',
		title: {
			en: 'Laptop buying guide: what matters in 2026',
			fr: 'Guide d’achat d’ordinateur portable : l’essentiel en 2026'
		},
		excerpt: {
			en: 'Chip, memory, display and battery — a plain-language guide to picking a laptop you will still love in three years.',
			fr: 'Puce, mémoire, écran et batterie — un guide en langage clair pour choisir un portable que vous aimerez encore dans trois ans.'
		},
		body: [
			{
				en: 'Buying a laptop in 2026 is easier than it looks, because most modern machines handle everyday tasks brilliantly. The trick is to match the machine to your real routine: a student writing essays, a designer editing photos and a developer running virtual machines need very different things, even though all three would be happy with a fast, light laptop.',
				fr: 'Acheter un ordinateur portable en 2026 est plus simple qu’il n’y paraît, car la plupart des machines modernes gèrent brillamment les tâches quotidiennes. L’astuce est d’adapter la machine à votre routine réelle : un étudiant qui rédige des dissertations, un designer qui retouche des photos et un développeur qui lance des machines virtuelles ont des besoins très différents, même si tous les trois seraient heureux avec un portable rapide et léger.'
			},
			{
				en: 'Start with the chip and memory, the two parts you usually cannot upgrade later. For browsing, documents and video calls, any current processor with 8 GB of memory is enough. For photo editing, programming or keeping dozens of tabs open, step up to 16 GB — it is the single upgrade that keeps a laptop feeling fast the longest.',
				fr: 'Commencez par la puce et la mémoire, les deux composants que vous ne pourrez généralement pas mettre à niveau plus tard. Pour la navigation, les documents et les appels vidéo, n’importe quel processeur actuel avec 8 Go de mémoire suffit. Pour la retouche photo, la programmation ou des dizaines d’onglets ouverts, passez à 16 Go — c’est la mise à niveau qui garde un portable rapide le plus longtemps.'
			},
			{
				en: 'Storage deserves the same forward thinking. A 256 GB drive fills quickly once you add photos, videos and applications, so 512 GB is a comfortable minimum for most people. Solid-state drives are standard now, which means fast startups and near-silent operation on every machine in this guide.',
				fr: 'Le stockage mérite la même anticipation. Un disque de 256 Go se remplit vite une fois que vous ajoutez photos, vidéos et applications : 512 Go est donc un minimum confortable pour la plupart des gens. Les disques SSD sont désormais la norme, ce qui signifie des démarrages rapides et un fonctionnement presque silencieux sur toutes les machines de ce guide.'
			},
			{
				en: 'The display is what you actually stare at all day, so give it real weight in your decision. A bright screen (400 nits or more) stays readable near a window, and a sharp, accurate panel matters far more for enjoyment than a slightly faster chip. If you carry the laptop everywhere, a 13 or 14-inch screen keeps the weight under 1.5 kg; if it mostly stays on a desk, a larger screen is worth the extra bulk.',
				fr: 'L’écran est ce que vous regardez vraiment toute la journée : accordez-lui un vrai poids dans votre décision. Un écran lumineux (400 nits ou plus) reste lisible près d’une fenêtre, et une dalle nette et fidèle compte bien plus pour le plaisir qu’une puce légèrement plus rapide. Si vous transportez le portable partout, un écran de 13 ou 14 pouces garde le poids sous 1,5 kg ; s’il reste surtout sur un bureau, un écran plus grand vaut le volume supplémentaire.'
			},
			{
				en: 'Battery life claims are measured in ideal conditions, so treat them as a ranking rather than a promise. Look for independent reviews that measure real browsing time, and remember that a laptop that charges over USB-C can top up from the same charger as your phone — one less brick in your bag.',
				fr: 'Les autonomies annoncées sont mesurées dans des conditions idéales : considérez-les comme un classement plutôt qu’une promesse. Cherchez des tests indépendants qui mesurent le temps réel de navigation, et souvenez-vous qu’un portable qui se charge en USB-C peut se recharger avec le même chargeur que votre téléphone — une brique de moins dans votre sac.'
			},
			{
				en: 'Finally, check the keyboard, trackpad and ports in person if you can. You will type thousands of words on that keyboard, so it should feel right from the first minute. Two USB-C ports are the bare minimum for comfortable daily use, and a warranty of at least one year — ideally two — protects the investment you are about to make.',
				fr: 'Enfin, vérifiez le clavier, le pavé tactile et les ports en personne si possible. Vous taperez des milliers de mots sur ce clavier : il doit être agréable dès la première minute. Deux ports USB-C sont le minimum pour un usage quotidien confortable, et une garantie d’au moins un an — idéalement deux — protège l’investissement que vous vous apprêtez à faire.'
			}
		],
		dateISO: '2026-11-05',
		readingMinutes: 6,
		image: '/images/promo-devices',
		imageAlt: {
			en: 'Laptop, tablet and headphones with a small plant on a pale green background',
			fr: 'Ordinateur portable, tablette et casque avec une petite plante sur fond vert pâle'
		},
		category: { en: 'Buying guides', fr: 'Guides d’achat' }
	},
	{
		slug: 'smartwatch-health-features',
		title: {
			en: 'Smartwatch health features, explained simply',
			fr: 'Les fonctions santé des montres connectées, expliquées simplement'
		},
		excerpt: {
			en: 'Heart rate, sleep stages, step counts and workout tracking — what your watch can really tell you about your health.',
			fr: 'Fréquence cardiaque, phases de sommeil, nombre de pas et suivi d’entraînement — ce que votre montre peut vraiment vous dire sur votre santé.'
		},
		body: [
			{
				en: 'Modern smartwatches pack an impressive set of health sensors into a device smaller than a matchbox. Heart-rate monitoring runs throughout the day, sleep tracking watches your nights, and workout modes record everything from a morning run to a swim. Understanding what each feature does — and what it cannot do — helps you get real value from the watch on your wrist.',
				fr: 'Les montres connectées modernes concentrent un ensemble impressionnant de capteurs de santé dans un appareil plus petit qu’une boîte d’allumettes. Le suivi de la fréquence cardiaque fonctionne toute la journée, le suivi du sommeil observe vos nuits, et les modes d’entraînement enregistrent tout, de la course du matin à la natation. Comprendre ce que fait chaque fonction — et ce qu’elle ne peut pas faire — vous aide à tirer une vraie valeur de la montre à votre poignet.'
			},
			{
				en: 'Continuous heart-rate tracking is the foundation. Your watch shines light through your skin and measures the tiny changes in reflected light as blood pulses through. The result is a good picture of your resting heart rate and how hard you are working during exercise, though wrist sensors can struggle with very rapid changes or loose fits during intense workouts.',
				fr: 'Le suivi continu de la fréquence cardiaque est la base. Votre montre projette de la lumière à travers votre peau et mesure les infimes variations de lumière réfléchie au rythme des pulsations sanguines. Le résultat donne une bonne image de votre fréquence cardiaque au repos et de l’intensité de vos efforts pendant l’exercice, même si les capteurs au poignet peuvent peiner lors de changements très rapides ou si la montre est lâche pendant les entraînements intenses.'
			},
			{
				en: 'Sleep tracking estimates your time in light, deep and REM sleep using movement and heart-rate patterns. The stage breakdown is an estimate, not a medical measurement, but the trends are genuinely useful: consistent bedtimes, enough total sleep and regular wake times show up clearly over weeks, and that is what matters most for feeling rested.',
				fr: 'Le suivi du sommeil estime votre temps en sommeil léger, profond et paradoxal à partir des mouvements et de la fréquence cardiaque. La répartition des phases est une estimation, pas une mesure médicale, mais les tendances sont vraiment utiles : des heures de coucher régulières, un sommeil total suffisant et des réveils constants apparaissent clairement sur plusieurs semaines, et c’est ce qui compte le plus pour se sentir reposé.'
			},
			{
				en: 'Activity tracking turns movement into motivation. Step counts, active minutes and standing reminders nudge you toward moving more, and most watches let you set daily goals that grow with you. The numbers do not need to be perfect to be helpful — a consistent daily target you can actually hit beats an ambitious one you abandon in a week.',
				fr: 'Le suivi d’activité transforme le mouvement en motivation. Nombre de pas, minutes actives et rappels pour se lever vous encouragent à bouger davantage, et la plupart des montres permettent de définir des objectifs quotidiens qui évoluent avec vous. Les chiffres n’ont pas besoin d’être parfaits pour être utiles — un objectif quotidien régulier que vous pouvez vraiment atteindre vaut mieux qu’un objectif ambitieux abandonné en une semaine.'
			},
			{
				en: 'A final word of caution: a smartwatch is a wellness companion, not a medical device. If it flags an unusually high resting heart rate or an irregular rhythm, treat that as a prompt to talk to a doctor, not as a diagnosis. Used with that perspective, the health features on your wrist become a practical, everyday tool for paying attention to your body.',
				fr: 'Un dernier mot de prudence : une montre connectée est un compagnon de bien-être, pas un appareil médical. Si elle signale une fréquence cardiaque au repos inhabituellement élevée ou un rythme irrégulier, considérez cela comme une invitation à consulter un médecin, et non comme un diagnostic. Utilisées avec cette perspective, les fonctions santé à votre poignet deviennent un outil pratique et quotidien pour prêter attention à votre corps.'
			}
		],
		dateISO: '2026-10-28',
		readingMinutes: 4,
		image: '/images/category-audio',
		imageAlt: {
			en: 'Black over-ear headphones',
			fr: 'Casque noir'
		},
		category: { en: 'Health & wearables', fr: 'Santé et objets connectés' }
	},
	{
		slug: 'mechanical-vs-membrane-keyboards',
		title: {
			en: 'Mechanical vs membrane keyboards: which should you choose?',
			fr: 'Claviers mécaniques ou à membrane : lequel choisir ?'
		},
		excerpt: {
			en: 'Clicky switches, quiet membranes, layouts and price — a plain-language guide to picking a keyboard you will enjoy typing on.',
			fr: 'Switches cliquants, membranes silencieuses, dispositions et prix — un guide en langage clair pour choisir un clavier agréable à utiliser.'
		},
		body: [
			{
				en: 'Keyboards are easy to overlook, yet they are the part of your setup your fingers touch for hours every day. The two main families — mechanical and membrane — feel completely different, and the right choice depends on how you type, where you work and how much noise you can make.',
				fr: 'Les claviers sont faciles à négliger, pourtant ce sont eux que vos doigts touchent pendant des heures chaque jour. Les deux grandes familles — mécanique et à membrane — offrent des sensations très différentes, et le bon choix dépend de votre façon de taper, de votre lieu de travail et du bruit que vous pouvez faire.'
			},
			{
				en: 'A mechanical keyboard gives every key its own switch: a small spring-loaded mechanism that registers the press partway down. That is why mechanical boards feel crisp and responsive, and why enthusiasts collect different switch types — clicky, tactile or smooth and linear. The trade-off is noise and price: most mechanical keyboards are louder and cost more than membrane models.',
				fr: 'Un clavier mécanique attribue à chaque touche son propre switch : un petit mécanisme à ressort qui enregistre la frappe à mi-course. C’est pourquoi les claviers mécaniques sont si nets et réactifs, et pourquoi les passionnés collectionnent les types de switches — cliquants, tactiles ou lisses et linéaires. La contrepartie est le bruit et le prix : la plupart des claviers mécaniques sont plus bruyants et plus chers que les modèles à membrane.'
			},
			{
				en: 'A membrane keyboard uses a rubber dome under each key that collapses when pressed. The feel is softer and quieter, the design is slimmer, and the price is usually much lower. For shared offices, late-night typing or a first keyboard, a good membrane board is often the sensible choice — modern ones are far better than the mushy keyboards of a decade ago.',
				fr: 'Un clavier à membrane utilise un dôme en caoutchouc sous chaque touche, qui s’écrase quand on appuie. La sensation est plus douce et plus silencieuse, le design plus fin, et le prix généralement bien inférieur. Pour un bureau partagé, des frappes nocturnes ou un premier clavier, un bon modèle à membrane est souvent le choix raisonnable — les modèles modernes sont bien meilleurs que les claviers mous d’il y a dix ans.'
			},
			{
				en: 'Layout matters as much as the switch type. A full-size board includes a number pad, which is handy for spreadsheets; a tenkeyless board drops it to save desk space; compact 65% and 75% boards go further, keeping arrows and a few extras. Think about which keys you actually reach for before deciding how much board you need.',
				fr: 'La disposition compte autant que le type de switch. Un clavier complet inclut un pavé numérique, pratique pour les tableurs ; un modèle tenkeyless s’en passe pour gagner de la place ; les formats compacts 65 % et 75 % vont plus loin en gardant les flèches et quelques touches supplémentaires. Réfléchissez aux touches que vous utilisez vraiment avant de décider de la taille.'
			},
			{
				en: 'Whichever family you pick, try the keyboard before you commit if you can — feel is personal, and no review can tell you how a switch will feel under your fingers. And remember that a keyboard is a long-term companion: spending a little more on the one you type on all day is one of the best upgrades you can buy.',
				fr: 'Quelle que soit la famille choisie, essayez le clavier avant de vous engager si possible — la sensation est personnelle, et aucun test ne peut vous dire ce qu’un switch donnera sous vos doigts. Et souvenez-vous qu’un clavier est un compagnon de longue durée : investir un peu plus dans celui que vous utilisez toute la journée est l’une des meilleures améliorations possibles.'
			}
		],
		dateISO: '2026-10-21',
		readingMinutes: 4,
		image: '/images/category-computers',
		imageAlt: {
			en: 'Open laptop keyboard seen from above',
			fr: 'Clavier d’ordinateur portable ouvert, vu de dessus'
		},
		category: { en: 'Buying guides', fr: 'Guides d’achat' }
	},
	{
		slug: 'getting-started-with-sleep-tracking',
		title: {
			en: 'Getting started with sleep tracking',
			fr: 'Débuter avec le suivi du sommeil'
		},
		excerpt: {
			en: 'Sleep stages, bedtime consistency and what the numbers mean — how to turn a week of sleep data into better rest.',
			fr: 'Phases du sommeil, régularité du coucher et signification des chiffres — comment transformer une semaine de données en meilleur repos.'
		},
		body: [
			{
				en: 'Sleep tracking is one of the most useful things a smartwatch does, and one of the easiest to misunderstand. The watch cannot read your brain: it estimates sleep stages from movement and heart-rate patterns. Used as a trend-spotter rather than a medical instrument, it can genuinely help you sleep better.',
				fr: 'Le suivi du sommeil est l’une des fonctions les plus utiles d’une montre connectée, et l’une des plus faciles à mal interpréter. La montre ne lit pas votre cerveau : elle estime les phases du sommeil à partir des mouvements et de la fréquence cardiaque. Utilisée comme un outil de tendances plutôt que comme un instrument médical, elle peut vraiment vous aider à mieux dormir.'
			},
			{
				en: 'Start by wearing the watch for a full week without changing anything. That baseline shows your real pattern: what time you actually fall asleep, how often you wake, and whether weekends shift everything later. Most people are surprised by at least one of those numbers.',
				fr: 'Commencez par porter la montre pendant une semaine complète sans rien changer. Cette référence révèle votre vrai rythme : l’heure à laquelle vous vous endormez réellement, la fréquence de vos réveils, et le décalage du week-end. La plupart des gens sont surpris par au moins l’un de ces chiffres.'
			},
			{
				en: 'The single most powerful change is consistency. Going to bed and waking up at similar times every day — including weekends — stabilises your body clock more reliably than any gadget setting. Your watch can help here: set a bedtime reminder and a gentle wake alarm, and let the trend lines show you the effect over two or three weeks.',
				fr: 'Le changement le plus efficace est la régularité. Se coucher et se lever à des heures similaires chaque jour — week-ends compris — stabilise votre horloge biologique plus sûrement que n’importe quel réglage. Votre montre peut vous aider : définissez un rappel de coucher et un réveil doux, et laissez les courbes de tendance vous montrer l’effet sur deux ou trois semaines.'
			},
			{
				en: 'Do not chase perfect stage percentages. Night-to-night variation in deep and REM sleep is normal, and the estimates are approximate. What matters is the direction of travel: total sleep creeping up, wake-ups creeping down, and a bedtime that stops drifting later. If the numbers consistently look worrying — very short nights, loud snoring flags, or restless sleep most nights — that is a prompt to talk to a doctor, not a diagnosis.',
				fr: 'Ne courez pas après des pourcentages de phases parfaits. Les variations d’une nuit à l’autre du sommeil profond et paradoxal sont normales, et les estimations sont approximatives. Ce qui compte, c’est la direction : un temps de sommeil total qui augmente, des réveils qui diminuent, et un coucher qui cesse de dériver. Si les chiffres sont régulièrement inquiétants — nuits très courtes, ronflements signalés ou sommeil agité la plupart des nuits — c’est une invitation à consulter un médecin, pas un diagnostic.'
			},
			{
				en: 'Finally, protect the hour before bed. Dim the lights, put the phone on charge outside the bedroom if you can, and keep the room cool and dark. Sleep tracking works best as a mirror for good habits, not as a replacement for them — the watch shows you the pattern, but only the routine changes it.',
				fr: 'Enfin, protégez l’heure avant le coucher. Tamisez les lumières, mettez le téléphone en charge hors de la chambre si possible, et gardez la pièce fraîche et sombre. Le suivi du sommeil fonctionne mieux comme un miroir des bonnes habitudes que comme leur remplacement — la montre vous montre le rythme, mais seule la routine le change.'
			}
		],
		dateISO: '2026-10-14',
		readingMinutes: 4,
		image: '/images/category-smartwatches',
		imageAlt: {
			en: 'Smartwatch on a wrist showing the time',
			fr: 'Montre connectée au poignet affichant l’heure'
		},
		category: { en: 'Health & wearables', fr: 'Santé et objets connectés' }
	},
	{
		slug: 'what-to-look-for-in-wireless-earbuds',
		title: {
			en: 'What to look for in wireless earbuds',
			fr: 'Que rechercher dans des écouteurs sans fil'
		},
		excerpt: {
			en: 'Fit, sound, battery, microphones and water resistance — the five things that separate earbuds you love from earbuds you lose.',
			fr: 'Ajustement, son, batterie, microphones et résistance à l’eau — les cinq critères qui distinguent les écouteurs que l’on adore de ceux que l’on perd.'
		},
		body: [
			{
				en: 'Wireless earbuds live in your ears, your pocket and your gym bag, so the details that matter are practical ones. Great sound means little if the buds fall out on a run, and the longest battery is useless if the case is too big to carry. Here is what to weigh before you buy.',
				fr: 'Les écouteurs sans fil vivent dans vos oreilles, votre poche et votre sac de sport : les détails qui comptent sont donc pratiques. Un excellent son ne sert à rien si les écouteurs tombent en courant, et la plus longue batterie est inutile si le boîtier est trop gros à transporter. Voici ce qu’il faut peser avant d’acheter.'
			},
			{
				en: 'Fit comes first, because it affects everything else. A good seal keeps bass full, blocks outside noise and stops the buds working loose. Most earbuds ship with three or four tip sizes — try them all, and try both silicone and foam if both are included. If a bud hurts after twenty minutes, no feature list will fix it.',
				fr: 'L’ajustement passe en premier, car il influence tout le reste. Une bonne étanchéité garde les basses pleines, bloque le bruit extérieur et empêche les écouteurs de se desserrer. La plupart des écouteurs sont livrés avec trois ou quatre tailles d’embouts — essayez-les toutes, ainsi que la silicone et la mousse si les deux sont fournies. Si un écouteur fait mal après vingt minutes, aucune liste de fonctions ne réglera le problème.'
			},
			{
				en: 'Sound quality is the next question, and it is more personal than the spec sheets suggest. Some earbuds emphasise bass for workouts, others aim for a balanced, detailed sound for long listening. An app with an equalizer lets you tune either style to your taste, so treat the app as part of the purchase — and remember that a good seal does more for sound than any driver size.',
				fr: 'La qualité sonore est la question suivante, et elle est plus personnelle que ne le suggèrent les fiches techniques. Certains écouteurs accentuent les basses pour le sport, d’autres visent un son équilibré et détaillé pour les longues écoutes. Une application avec égaliseur permet d’adapter chaque style à vos goûts : considérez donc l’application comme partie de l’achat — et souvenez-vous qu’une bonne étanchéité fait plus pour le son que n’importe quelle taille de transducteur.'
			},
			{
				en: 'Battery life has two numbers: hours per charge, and total hours with the case. Five to six hours per charge covers most days, with the case adding another three or four top-ups. Fast charging matters more than the headline figure for many people: ten minutes in the case often buys an hour or more of listening.',
				fr: 'L’autonomie comporte deux chiffres : les heures par charge, et les heures totales avec le boîtier. Cinq à six heures par charge couvrent la plupart des journées, le boîtier ajoutant trois ou quatre recharges supplémentaires. La charge rapide compte souvent plus que le chiffre principal : dix minutes dans le boîtier offrent souvent une heure d’écoute ou plus.'
			},
			{
				en: 'Finally, check the microphones and the water rating if you take calls or exercise with your earbuds. Multiple microphones with wind-noise reduction make a real difference outdoors, and an IPX4 rating or better handles sweat and rain. With fit, sound, battery, mics and sealing all covered, you have earbuds you will actually keep using — which is the only review that matters.',
				fr: 'Enfin, vérifiez les microphones et l’indice de résistance à l’eau si vous passez des appels ou faites du sport avec vos écouteurs. Plusieurs microphones avec réduction du bruit du vent font une vraie différence en extérieur, et un indice IPX4 ou supérieur résiste à la transpiration et à la pluie. Avec l’ajustement, le son, la batterie, les micros et l’étanchéité couverts, vous avez des écouteurs que vous utiliserez vraiment — et c’est le seul avis qui compte.'
			}
		],
		dateISO: '2026-10-07',
		readingMinutes: 4,
		image: '/images/hero-audio',
		imageAlt: {
			en: 'Black over-ear headphones and white wireless earbuds on a green gradient background',
			fr: 'Casque noir et écouteurs sans fil blancs sur fond vert dégradé'
		},
		category: { en: 'Buying guides', fr: 'Guides d’achat' }
	}
];

export function getBlogPost(slug: string): BlogPost | undefined {
	return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPosts(): BlogPost[] {
	return [...blogPosts];
}
