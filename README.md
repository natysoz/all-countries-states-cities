# 🌍 Location Data Package

Welcome to the Location Data Package! This package provides well-formatted,
all-English data on countries,
states, and cities, including projection and pagination support for efficient
data retrieval.
It can be easily integrated into any project and includes a wide range of
features for working with geographical data.

## 📦 What's Included

This package includes the following features:

1. Country Data: Retrieve information on all countries, with optional projection
   for specific fields.
2. State Data: Get details on states within a specific country, with support for
   pagination and field projection.
3. City Data: Fetch cities based on country ISO codes, with the ability to
   filter by state and use pagination.
4. Field Projection: Specify which fields you want returned (e.g., only `name`
   and `iso`).
5. Pagination: Easily control how many items are returned and navigate through
   large datasets.
6. All the names that should be in english are cleared from unknown symbols!

## 📚 How to Use

### Installation

First, install the package using npm:

`npm install @all-countries-states-cities`

### Importing Functions

You can import the available functions like so:

```javascript
import {
    getCountries,
    getCountry,
    getStates,
    getCities
} from '@all-countries-states-cities'
```

### Available Functions

#### 1. getCountries

Retrieve a list of all countries with support for pagination and field
projection.

```javascript
const result = getCountries({ page: 1, limit: 10, project: ['name', 'iso'] });
console.log(result.countries); // Array of countries with 'name' and 'iso' fields
```

Parameters:

- `page`: Page number (default: 1)
- `limit`: Number of countries per page (set to `0` to retrieve all)
- `project`: Array of fields to return (optional)

#### 2. getCountry

Retrieve full details of a specific country by its ISO code.

```javascript
const country = getCountry('US');
console.log(country); // Returns the details for the country with ISO code 'US'
```

Parameters:

- `isoCode`: ISO 3166-1 alpha-2 code of the country.

#### 3. getStates

Retrieve a list of states within a country, with support for pagination and
field projection.

```javascript
const result = await getStates({
    isoCode: 'US',
    limit: 5,
    page: 1,
    project: ['name', 'abbreviation']
});
console.log(result.states); // Array of states with 'name' and 'abbreviation' fields
```

Parameters:

- `isoCode`: ISO 3166-1 alpha-2 code of the country.
- `page`: Page number (default: 1)
- `limit`: Number of states per page (set to `0` to retrieve all)
- `project`: Array of fields to return (optional)

#### 4. getCities

Retrieve a list of cities within a country, with optional filtering by state,
pagination, and field projection.

```javascript
const result = await getCities({
    isoCode: 'US',
    state: 'California',
    limit: 10,
    project: ['name', 'population']
});
console.log(result.cities); // Array of cities in California with 'name' and 'population' fields
```

Parameters:

- `isoCode`: ISO 3166-1 alpha-2 code of the country.
- `state`: Optional state name to filter cities by.
- `page`: Page number (default: 1)
- `limit`: Number of cities per page (set to `0` to retrieve all)
- `project`: Array of fields to return (optional)

## 🔄 Pagination Support

For endpoints that support pagination, you can control the number of results and
navigate through pages.

- `page`: The current page number (starting from 1).
- `limit`: Number of results per page.

Example: Fetch the second page of states for the United States, with a limit of
5 states per page:

```javascript
const result = await getStates({ isoCode: 'US', page: 2, limit: 5 });
console.log(result.pagination); // Pagination info including current page, total pages, etc.
```

### Example Pagination Response:

```json
{
    "states": [],
    "pagination": {
        "totalStates": 50,
        "totalPages": 10,
        "currentPage": 2,
        "hasMore": true
    }
}
```

## 🛠️ Example Usage

### Fetching Countries with Field Projection

```javascript
const countries = getCountries({ limit: 5, project: ['name', 'iso'] });
console.log(countries);
```

### Fetching Cities by Country and State

```javascript
const cities = await getCities({
    isoCode: 'US',
    state: 'California',
    limit: 10
});
console.log(cities);
```

### Fetching States with Pagination

```javascript
const states = await getStates({ isoCode: 'US', page: 2, limit: 5 });
console.log(states);
```

## 📝 Notes

- The `project` parameter can be used to limit the fields returned, reducing
  payload size and improving performance.
- Pagination parameters allow you to control the number of results returned and
  navigate through large datasets.
