import { getCountries, getStates, getCities, getCountry } from './dist/index.js';

const measure = (cb, name) => {
	// eslint-disable-next-line no-undef
	console.time(name);
	cb();
	// eslint-disable-next-line no-undef
	console.timeEnd(name);
};

(async () => {
	measure(() => getCountry('il'), '* getCountry: Retrieve single country object =>');

	measure(() => getCountries({ page: 1, limit: 10 }), '* getCountries: Retrieve the first 10 countries =>');
	measure(() => getCountries({ page: 1, limit: 10, project: ['name', 'iso'] }), '* getCountries: Retrieve the first 10 countries using projection =>');
	measure(async () => {
		await getCities({ isoCode: 'US', limit: 10, project: ['name'] });
	}, '* getCities: Retrieve the first 10 cities for a country =>');

	measure(async () => {
		await getCities({ isoCode: 'US', limit: 0 });
	}, '* getCities: Retrieve all cities for a given country =>');

	measure(async () => {
		await getCities({ isoCode: 'US', state: 'California', page: 2, limit: 5 });
	}, '* getCities: Retrieve cities for a specific state with pagination =>');

	measure(async () => {
		await getCities({
			isoCode: 'US',
			page: 1,
			limit: 10,
			project: ['name', 'wikiDataId'],
		});
	}, '* Retrieve cities and project only specific fields (name and wikiDataId) =>');

	measure(async () => {
		await getStates({ isoCode: 'IL', page: 1, limit: 10 });
	}, '* Retrieve the first 10 states for israel country =>');

	measure(async () => {
		await getStates({ isoCode: 'US', limit: 0 });
	}, '* Retrieve all states for a country =>');

	measure(async () => {
		await getStates({ isoCode: 'US', project: ['name', 'latitude'] });
	}, '* Retrieve 10 states and project only specific fields (name + latitude) =>');
})();
