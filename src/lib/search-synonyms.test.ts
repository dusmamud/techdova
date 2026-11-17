import { describe, expect, it } from 'vitest';
import { filterProducts, products } from '#lib/data/products';
import { getSynonymCategories, normalizeSearchTerm } from '#lib/data/search-synonyms';

describe('normalizeSearchTerm', () => {
	it('lowercases and strips accents', () => {
		expect(normalizeSearchTerm('Écouteurs')).toBe('ecouteurs');
		expect(normalizeSearchTerm('TÉLÉPHONE')).toBe('telephone');
		expect(normalizeSearchTerm('Portable')).toBe('portable');
	});
});

describe('getSynonymCategories', () => {
	it('maps English generic words to categories', () => {
		expect(getSynonymCategories('phone')).toEqual(['smartphones']);
		expect(getSynonymCategories('laptop')).toEqual(['computers']);
		expect(getSynonymCategories('earbuds')).toEqual(['audio']);
		expect(getSynonymCategories('watch')).toEqual(['smartwatches']);
		expect(getSynonymCategories('console')).toEqual(['gaming']);
		expect(getSynonymCategories('charger')).toEqual(['accessories']);
	});

	it('maps French generic words to categories, accents included', () => {
		expect(getSynonymCategories('téléphone')).toEqual(['smartphones']);
		expect(getSynonymCategories('ordinateur')).toEqual(['computers']);
		expect(getSynonymCategories('écouteurs')).toEqual(['audio']);
		expect(getSynonymCategories('montre')).toEqual(['smartwatches']);
		expect(getSynonymCategories('manette')).toEqual(['gaming']);
		expect(getSynonymCategories('chargeur')).toEqual(['accessories']);
	});

	it('maps ambiguous words to every category they can mean', () => {
		expect(getSynonymCategories('portable')).toEqual(['smartphones', 'computers']);
	});

	it('returns [] for unknown words and brand names', () => {
		expect(getSynonymCategories('titanium')).toEqual([]);
		expect(getSynonymCategories('apple')).toEqual([]);
		expect(getSynonymCategories('')).toEqual([]);
	});
});

describe('synonym-aware search', () => {
	it('finds smartphones for a generic word that appears in no product text', () => {
		const slugs = filterProducts(products, { query: 'smartphone' }, 'en').map(
			(product) => product.slug
		);
		expect(slugs).toEqual(['iphone-15-pro', 'galaxy-s24']);
	});

	it('finds audio products for French terms with accents', () => {
		const slugs = filterProducts(products, { query: 'écouteurs' }, 'fr').map(
			(product) => product.slug
		);
		expect(slugs).toEqual(['airpods-pro', 'sony-wh1000xm5']);
	});

	it('keeps AND semantics across words', () => {
		// "watch charger": no product is both a smartwatch and an accessory.
		expect(filterProducts(products, { query: 'watch charger' }, 'en')).toEqual([]);
	});
});
