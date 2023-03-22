import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './fetchCntr';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const ul = document.querySelector('.country-list');

input.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY));

function searchCountries(event) {
  if (event.target.value.trim() === '') {
    ul.innerHTML = '';
  }

  API.fetchCountries(event.target.value)

    .then(render)
    .catch(error);
}

function render(country) {
  if (country.length > 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (country.length === 1) {
    return renderMurkupOneCountry(country);
  } else if (country.length < 10) {
    return renderMurkupAllContryes(country);
  }
}

function renderMurkupOneCountry(element) {
  const markup = element
    .map(({ name, population, capital, flags, languages }) => {
      return `<li><div class="wrapper-flag"><img src="${
        flags.svg
      }" alt="flags" width="50">   
          <h2 class="country-title">${name.official}</h2></div>
          <p>Population: ${population}</p>
          <p>Capital: ${capital}</p>
            <p>Language: ${Object.values(languages)}</p>
        </li>`;
    })
    .join('');

  ul.innerHTML = markup;
}

function renderMurkupAllContryes(element) {
  const markup = element
    .map(({ name, flags }) => {
      return `<li>
          <div class="wrapper-flag"><img src="${flags.svg}" alt="flags" width="50">   
          <h2 class="country-title">${name.official}</h2>
        </li>`;
    })
    .join('');

  ul.innerHTML = markup;
}

function error() {
  Notify.failure(`Oops, there is no country with that name`);
}
