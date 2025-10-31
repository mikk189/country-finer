import debounce from 'lodash.debounce';
import { alert, info } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import fetchCountries from './fetchCountries.js';
import Handlebars from 'handlebars';


const countryTemplateSource = `
<h2>{{name}}</h2>
<p>Столиця: {{capital}}</p>
<p>Населення: {{population}}</p>
<p>Мови: {{#each languages}}{{name}} {{/each}}</p>
<img src="{{flag}}" alt="{{name}}" width="200"/>
`;

const countryTemplate = Handlebars.compile(countryTemplateSource);

const countryListSource = `
<ul>
{{#each countries}}
  <li>{{name}}</li>
{{/each}}
</ul>
`;

const countryListTemplate = Handlebars.compile(countryListSource);


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