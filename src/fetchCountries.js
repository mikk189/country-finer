export default function fetchCountries(searchQuery) {
    const url = `https://restcountries.com/v2/name/${encodeURIComponent(searchQuery)}`;
    return fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error('Country not found');
            return res.json();
        })
        .catch((err) => {
            console.error(err);
            return [];
        });
}
