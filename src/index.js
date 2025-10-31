import debounce from 'lodash.debounce';
import { alert, info } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import fetchCountries from './fetchCountries.js';
import countryTemplate from './templates/country.hbs';
import countryListTemplate from './templates/countryList.hbs';

const input = document.querySelector('#search-box');
const resultContainer = document.querySelector('#result');

input.addEventListener(
    'input',
    debounce(async (e) => {
        const query = e.target.value.trim();
        if (!query) {
            resultContainer.innerHTML = '';
            return;
        }
        try {
            const countries = await fetchCountries(query);
            resultContainer.innerHTML = '';

            if (countries.length > 10) {
                info({ text: 'Занадто багато результатів. Введіть більш специфічний запит.' });
            } else if (countries.length >= 2 && countries.length <= 10) {
                resultContainer.innerHTML = countryListTemplate({ countries });
            } else if (countries.length === 1) {
                resultContainer.innerHTML = countryTemplate(countries[0]);
            } else {
                alert({ text: 'Країну не знайдено' });
            }
        } catch (error) {
            alert({ text: 'Помилка запиту' });
            console.error(error);
        }
    }, 500)
);