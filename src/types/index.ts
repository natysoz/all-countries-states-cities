export type Country = {
	id: number;
	name: string;
	iso3: string;
	iso2: string;
	numeric_code: string;
	phone_code: string;
	capital: string;
	currency: string;
	currency_name: string;
	currency_symbol: string;
	tld: string;
	native: null | string;
	region: string;
	region_id: null | string;
	subregion: string;
	subregion_id: null | string;
	nationality: string;
	timezones: null | Array<{
		zoneName: string;
		gmtOffset: number;
		gmtOffsetName: string;
		abbreviation: string;
		tzName: string;
	}>;
	translations: {
		[key: string]: string;
	};
	latitude: string;
	longitude: string;
	emoji: string;
	emojiU: string;
	iso: string;
};

export type City = {
	id: number;
	name: string;
	state_id: number;
	state_code: string;
	state_name: string;
	country_id: number;
	country_code: string;
	country_name: string;
	latitude: string;
	longitude: string;
	wikiDataId: string;
};

export type CityModule = {
	cities: City[];
};

export type StateModule = { states: State[] };

export type State = {
	id: number;
	name: string;
	country_id: number;
	country_code: string;
	country_name: string;
	state_code: string;
	latitude: string;
	longitude: string;
};

export type GetCitiesParams = {
	isoCode: string;
	state?: string;
	page?: number;
	limit?: number;
	skip?: number;
	project?: (keyof City)[];
};

export type GetStatesParams = {
	isoCode: string;
	page?: number;
	limit?: number;
	skip?: number;
	project?: (keyof State)[];
};

export type PaginationParams = {
	page?: number;
	limit?: number;
	skip?: number;
	project?: string[];
};

export type PaginationInfo = {
	totalStates?: number;
	totalCities?: number;
	totalCountries?: number;
	totalPages: number;
	currentPage: number;
	hasMore: boolean;
};

export type GetBasicCountriesResponse = PaginatedResponse<Partial<Country>, 'countries'>;

export type GetCitiesByCountryResponse = PaginatedResponse<City, 'cities'>;

export type GetStatesByCountryResponse = PaginatedResponse<State, 'states'>;

export type PaginatedResponse<T, K extends string> = {
	[key in K]: T[];
} & {
	pagination: PaginationInfo;
};
