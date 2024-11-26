import countries from './resource/countries/index.js';
function getCountries({ page = 1, limit = 10, skip = 0, project = [] } = {}) {
    page = Math.max(1, page);
    limit = limit === 0 ? countries.length : Math.max(1, limit);
    const totalCountries = countries.length;
    const start = (page - 1) * limit + skip;
    const end = start + limit;
    const paginatedCountries = countries.slice(start, end);
    const totalPages = Math.ceil(totalCountries / limit);
    const projectCountry = (country, project) => {
        if (project.length === 0) {
            return country;
        }
        return project.reduce((obj, key) => {
            obj[key] = country[key];
            return obj;
        }, {});
    };
    return {
        countries: paginatedCountries.map((country) => projectCountry(country, project)),
        pagination: {
            totalCountries,
            totalPages: limit === countries.length ? 1 : totalPages,
            currentPage: page,
            hasMore: page < totalPages,
        },
    };
}
function getCountry(isoCode) {
    const country = countries.find((c) => c.iso === isoCode.toUpperCase());
    if (!country) {
        throw new Error(`Country with iso code "${isoCode}" couldn't be found.`);
    }
    return country;
}
async function getStates({ isoCode, page = 1, limit = 10, skip = 0, project = [] }) {
    try {
        const statesModule = (await import(`./resource/states/${isoCode.toUpperCase()}.js`));
        const states = statesModule.states;
        if (limit === 0) {
            limit = states.length;
        }
        const totalStates = states.length;
        const start = (page - 1) * limit + skip;
        const end = start + limit;
        const paginatedStates = states.slice(start, end);
        const totalPages = Math.ceil(totalStates / limit);
        const projectState = (state, project) => {
            if (project.length === 0) {
                return state;
            }
            return project.reduce((obj, key) => {
                obj[key] = state[key];
                return obj;
            }, {});
        };
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
    }
    catch {
        throw new Error(`States for ISO code "${isoCode}" not found.`);
    }
}
async function getCities({ isoCode, state = '', page = 1, limit = 10, skip = 0, project = [] }) {
    try {
        const cityModule = (await import(`./resource/cities/${isoCode.toUpperCase()}.js`));
        let cities = cityModule.cities;
        if (state) {
            cities = cities.filter((c) => c.state_name === state);
        }
        if (limit === 0) {
            limit = cities.length;
        }
        const totalCities = cities.length;
        const start = (page - 1) * limit + skip;
        const end = start + limit;
        const paginatedCities = cities.slice(start, end);
        let totalPages;
        if (limit === cities.length) {
            totalPages = 1;
        }
        else {
            totalPages = Math.ceil(totalCities / limit);
        }
        const projectCity = (city, project) => {
            if (project.length === 0) {
                return city;
            }
            return project.reduce((obj, key) => {
                obj[key] = city[key];
                return obj;
            }, {});
        };
        const projectedCities = paginatedCities.map((city) => projectCity(city, project));
        return {
            cities: projectedCities,
            pagination: {
                totalCities,
                totalPages,
                currentPage: page,
                hasMore: page < totalPages,
            },
        };
    }
    catch {
        throw new Error(`Cities for ISO code "${isoCode}" not found.`);
    }
}
export { getCountries, getStates, getCities, getCountry };
