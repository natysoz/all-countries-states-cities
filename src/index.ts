import countries from './resource/countries/index.js';
import {
	City,
	CityModule,
	Country,
	GetBasicCountriesResponse,
	GetCitiesByCountryResponse,
	GetCitiesParams,
	GetStatesByCountryResponse,
	GetStatesParams,
	PaginationParams,
	State,
	StateModule,
} from './types/index.js';
/**
 * Retrieves a list of all countries in the world, with support for pagination and field projection.
 *
 * This function allows the user to specify which fields to return from the country data by passing
 * an array of field names in the `project` parameter.
 * If no `project` array is provided, the full
 * country object will be returned.
 *
 * Pagination parameters (`page`, `limit`, and `skip`) allow the user to control the number
 * of countries returned and how they are paginated.
 *
 * @param {Object} [options] - Optional parameters for pagination and field projection.
 * @param {number} [options.page=1] - The page number to retrieve (starting from 1).
 * @param {number} [options.limit=10] - The number of countries per page.
 * Set to `0` to retrieve all countries.
 * @param {number} [options.skip=0] -
 * The number of countries to skip before starting to return results.
 * @param {string[]} [options.project] - An array of field names to return for each country.
 * If not provided, the full country object is returned.
 *
 * @returns {{countries: Partial<Country>[], pagination: {totalCountries: number, totalPages: number, currentPage: number, hasMore: boolean}}}
 * A promise
 * that resolves an object containing the paginated list of countries and pagination information.
 *
 * @throws {Error} If countries for the specified ISO code are not found.
 *
 * @example
 * // Retrieve the first 10 countries with only the 'name' and 'iso' fields
 * getBasicCountries({ page: 1, limit: 10, project: ['name', 'iso'] });
 *
 * @example
 * // Retrieve all countries with full details
 * getBasicCountries({ limit: 0 });
 */
function getCountries({ page = 1, limit = 10, skip = 0, project = [] }: PaginationParams = {}): GetBasicCountriesResponse {
	// Ensure valid values for page and limit
	page = Math.max(1, page);
	limit = limit === 0 ? countries.length : Math.max(1, limit);

	const totalCountries = countries.length;
	const start = (page - 1) * limit + skip;
	const end = start + limit;

	// Paginate the countries array or return all countries if the limit is 0
	const paginatedCountries = countries.slice(start, end);

	// Calculate total pages
	const totalPages = Math.ceil(totalCountries / limit);

	// Function to project country based on the user-defined properties in 'project'
	const projectCountry = <K extends keyof Country>(country: Country, project: K[]): Pick<Country, K> => {
		// If no 'project' array is provided, return the full country object
		if (project.length === 0) {
			return country as Pick<Country, K>;
		}

		// Otherwise, return only the fields specified in the 'project' array
		return project.reduce(
			(obj, key) => {
				obj[key] = country[key];
				return obj;
			},
			{} as Pick<Country, K>,
		);
	};

	// Return the paginated countries with projection applied
	return {
		countries: paginatedCountries.map((country) => projectCountry(country, project as (keyof Country)[])),
		pagination: {
			totalCountries,
			totalPages: limit === countries.length ? 1 : totalPages,
			currentPage: page,
			hasMore: page < totalPages,
		},
	};
}

/**
 * Retrieves a single country with full detailed information, filtered by its iso code.
 *
 * This function searches for a country using its ISO 3166-1 alpha-2 code and returns
 * all available data for that country.
 * The returned object includes comprehensive details such as
 * - `id`: The unique identifier for the country.
 * - `name`: The name of the country.
 * - `iso3`: The ISO 3166-1 alpha-3 code of the country.
 * - `iso2`: The ISO 3166-1 alpha-2 code of the country.
 * - `numeric_code`: The numeric code of the country.
 * - `phone_code`: The international dialing code for the country.
 * - `capital`: The capital city of the country.
 * - `currency`: The currency code used by the country.
 * - `currency_name`: The name of the currency.
 * - `currency_symbol`: The symbol of the currency.
 * - `tld`: The top-level domain associated with the country.
 * - `native`: The native name of the country.
 * - `region`: The region where the country is located.
 * - `region_id`: The identifier for the region.
 * - `subregion`: The subregion where the country is located.
 * - `subregion_id`: The identifier for the subregion.
 * - `nationality`: The nationality of the country's citizens.
 * - `timezones`: An array of timezone objects, each containing information about the timezones in the country.
 * - `translations`: A list of translations for the country’s name in various languages.
 * - `latitude`: The latitude coordinate of the country.
 * - `longitude`: The longitude coordinate of the country.
 * - `emoji`: The emoji flag representation of the country.
 * - `emojiU`: The Unicode representation of the emoji flag.
 * - And more fields as defined in the `Country` type.
 *
 * @param {string} isoCode - The ISO 3166-1 alpha-2 code of the country to retrieve.
 * @returns {Country} An object representing the country with full detailed information.
 * @throws {Error} If no country with the specified iso code is found.
 */
function getCountry(isoCode: string): Country {
	const country: Country | undefined = countries.find((c: Country) => c.iso === isoCode.toUpperCase());
	if (!country) {
		throw new Error(`Country with iso code "${isoCode}" couldn't be found.`);
	}
	return country;
}

/**
 * Retrieves a list of states for a specific country by its ISO code, with support for pagination and field projection.
 *
 * This function dynamically imports a module containing states for the specified country,
 * identified by its ISO 3166-1 alpha-2 code.
 *
 * Projection allows you to specify which fields to return for each state, by passing an array
 * of field names in the `project` parameter.
 *
 * Pagination parameters (`page`, `limit`, and `skip`) allow the user to control the number
 * of states returned and how they are paginated.
 *
 * @param {Object} params - The parameters for retrieving states.
 * @param {string} params.isoCode - The ISO 3166-1 alpha-2 code of the country to retrieve states for.
 * @param {number} [params.page=1] - The page number to retrieve (starting from 1).
 * @param {number} [params.limit=10] - The number of states per page. Set to `0` to retrieve all states.
 * @param {number} [params.skip=0] - The number of states to skip before starting to return results.
 * @param {Array<string>} [params.project] - An array of state field names to return. If not provided, the full state object is returned.
 *
 * @returns {Promise<{states: Partial<State>[], pagination: {totalStates: number, totalPages: number, currentPage: number, hasMore: boolean}}>}
 * A promise that resolves an object containing the paginated list of `State`
 * objects (with optional projection) and pagination information.
 *
 * @throws {Error} Throws an error if the country with the specified ISO code is not found,
 * or if the States file for the country is not found.
 *
 * @example
 * // Retrieve the first 10 states for a country
 * getStates({ isoCode: 'US', page: 1, limit: 10 });
 *
 * @example
 * // Retrieve all states for a country
 * getStates({ isoCode: 'US', limit: 0 });
 *
 * @example
 * // Retrieve states and project only the 'name' and 'abbreviation' fields
 * getStates({ isoCode: 'US', project: ['name', 'abbreviation'] });
 */
async function getStates({ isoCode, page = 1, limit = 10, skip = 0, project = [] }: GetStatesParams): Promise<GetStatesByCountryResponse> {
	try {
		const statesModule = (await import(`./resource/states/${isoCode.toUpperCase()}.js`)) as StateModule;
		const states: State[] = statesModule.states;

		// Handle the case when the limit is 0 (return all states)
		if (limit === 0) {
			limit = states.length; // Set limit to total number of states
		}

		// Pagination logic
		const totalStates = states.length;
		const start = (page - 1) * limit + skip;
		const end = start + limit;
		const paginatedStates = states.slice(start, end);

		// Calculate total pages
		const totalPages = Math.ceil(totalStates / limit);

		// Function to project state based on the user-defined properties in 'project'
		const projectState = <K extends keyof State>(state: State, project: K[]): Pick<State, K> => {
			if (project.length === 0) {
				return state as Pick<State, K>; // If no 'project' array is provided, return the full state object
			}

			return project.reduce(
				(obj, key) => {
					obj[key] = state[key];
					return obj;
				},
				{} as Pick<State, K>,
			);
		};

		// Project fields if the project array is provided
		const projectedStates = paginatedStates.map((state) => projectState(state, project));

		return {
			states: projectedStates,
			pagination: {
				totalStates,
				totalPages: limit === states.length ? 1 : totalPages,
				currentPage: page,
				hasMore: page < totalPages,
			},
		};
	} catch {
		throw new Error(`States for ISO code "${isoCode}" not found.`);
	}
}
/**
 * Retrieves a list of cities for a specific country, filtered by ISO code and optionally by state,
 * with support for pagination and projection of specific fields.
 *
 * This function dynamically imports a module containing cities for the specified country,
 * identified by its ISO 3166-1 alpha-2 code. If a state name is provided, it returns only
 * the cities within that state; otherwise, it returns all cities in the country.
 *
 * Projection allows you to specify which fields to return for each city, by passing an array
 * of field names in the `project` parameter.
 *
 * Pagination parameters (`page`, `limit`, and `skip`) allow the user to control the number
 * of cities returned and how they are paginated.
 *
 * @param {Object} params - The parameters for retrieving cities.
 * @param {string} params.isoCode - The ISO 3166-1 alpha-2 code of the country to retrieve cities for.
 * @param {string} [params.state=''] - Optional state name to filter cities by.
 * @param {number} [params.page=1] - The page number to retrieve (starting from 1).
 * @param {number} [params.limit=10] - The number of cities per page. Set to `0` to retrieve all cities.
 * @param {number} [params.skip=0] - The number of cities to skip before starting to return results.
 * @param {Array<string>} [params.project] - An array of city field names to return. If not provided, the full city object is returned.
 *
 * @returns {Promise<{cities: Partial<City>[], pagination: {totalCities: number, totalPages: number, currentPage: number, hasMore: boolean}}>}
 * A promise that resolves an object containing the paginated list of `City`
 * objects (with optional projection) and pagination information.
 *
 * @throws {Error} If cities for the specified ISO code are not found.
 *
 * @example
 * // Retrieve the first 10 cities for a country
 * getCities({ isoCode: 'US', page: 1, limit: 10 });
 *
 * @example
 * // Retrieve all cities for a country
 * getCities({ isoCode: 'US', limit: 0 });
 *
 * @example
 * // Retrieve cities for a specific state with pagination
 * getCities({ isoCode: 'US', state: 'California', page: 2, limit: 5 });
 *
 * @example
 * // Retrieve cities and project only the 'name' and 'population' fields
 * getCities({ isoCode: 'US', page: 1, limit: 10, project: ['name', 'population'] });
 */
async function getCities({ isoCode, state = '', page = 1, limit = 10, skip = 0, project = [] }: GetCitiesParams): Promise<GetCitiesByCountryResponse> {
	try {
		const cityModule = (await import(`./resource/cities/${isoCode.toUpperCase()}.js`)) as CityModule;
		let cities: City[] = cityModule.cities;

		// Filter by state if provided
		if (state) {
			cities = cities.filter((c: City) => c.state_name === state);
		}

		// Handle the case when the limit is 0 (return all cities)
		if (limit === 0) {
			limit = cities.length;
		}

		// Pagination logic
		const totalCities = cities.length;
		const start = (page - 1) * limit + skip;
		const end = start + limit;
		const paginatedCities = cities.slice(start, end);

		// Calculate total pages before returning
		let totalPages: number;
		if (limit === cities.length) {
			totalPages = 1;
		} else {
			totalPages = Math.ceil(totalCities / limit);
		}

		// Function to project city based on the user-defined properties in 'project'
		const projectCity = <K extends keyof City>(city: City, project: K[]): Pick<City, K> => {
			if (project.length === 0) {
				return city as Pick<City, K>; // If no 'project' array is provided, return the full city object
			}

			return project.reduce(
				(obj, key) => {
					obj[key] = city[key];
					return obj;
				},
				{} as Pick<City, K>,
			);
		};

		// Project fields if the project array is provided
		const projectedCities = paginatedCities.map((city) => projectCity(city, project));

		return {
			cities: projectedCities,
			pagination: {
				totalCities,
				totalPages, // Use pre-calculated totalPages
				currentPage: page,
				hasMore: page < totalPages,
			},
		};
	} catch {
		throw new Error(`Cities for ISO code "${isoCode}" not found.`);
	}
}

export { getCountries, getStates, getCities, getCountry };
