import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const ul = document.querySelector('.country-list');

input.addEventListener('input', debounce(fetchCountries, DEBOUNCE_DELAY));

function fetchCountries(event) {
  if (event.target.value.trim() === '') {
    ul.innerHTML = '';
  }
  fetch(
    `https://restcountries.com/v3.1/name/${event.target.value}?fields=name,capital,population,flags,languages`
  )
    .then(responce => {
      return responce.json();
    })
    .then(country => {
      if (country.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (country.length === 1) {
        return renderMurkupOneCountry(country);
      } else if (country.length < 10) {
        return renderMurkupAllContryes(country);
      }
    })
    .catch(error =>
      Notify.failure(
        `Oops, there is no country with that ${event.target.value}`
      )
    );
}

// Guatemala

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
