import './style.css';
import { getWeatherApi, cityData } from './logic.js';
import './dom.js';
import * as THREE from 'three';
import BIRDS from 'vanta/src/vanta.birds';

export let vantaEffect;

vantaEffect = BIRDS({
  el: '.loadPage',
  THREE: THREE,
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
  scale: 1.0,
  scaleMobile: 1.0,
});

const startapp = (function () {
  (function loadPageAnimation() {
    const pronounChange = document.querySelector('.pronounChange');

    const words = ['BETA', 'SMART', 'EVERY', 'REAL', 'NEXT', 'ONE', 'THE'];
    let index = 0;

    function changeWord() {
      pronounChange.classList.add('change');

      setTimeout(() => {
        pronounChange.textContent = words[index];
        pronounChange.classList.remove('change');
        index++;

        if (index < words.length) {
          setTimeout(changeWord, 2000);
        }
      }, 400);
    }

    setTimeout(changeWord, 1000);
  })();

  (function location() {
    const loadPage = document.querySelector('.loadPage');
    const getgeolocation = document.querySelector('.geolocation');
    const locationBox = document.querySelector('#locationBox');
    const searchCityButton = document.querySelector(
      '.manualLocation .searchCityButton'
    );
    const searchCityButtonNavRight = document.querySelector(
      '.navRight .searchCityButton'
    );
    const searchCity = document.querySelector('#searchCity');
    const errorDisplay = document.querySelector('.loadPage .error');
    const loadingIcon = document.querySelector('.loadingIcon');

    let coordinates = null;

    getgeolocation.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            coordinates = `${lat},${lon}`;
            locationBox.value = coordinates;
          },
          (error) => {
            errorDisplay.textContent = 'GPS Unavailable';
            errorDisplay.classList.remove('loading');
            errorDisplay.classList.add('display');
          }
        );
      } else {
        alert('Geolocation is not supported by the browser!');
      }
    });

    searchCityButton.addEventListener('click', () => {
      if (locationBox.value) {
        searchCity.value = locationBox.value;
        searchCityButtonNavRight.click();
        errorDisplay.textContent = 'Fetching meteorological data...';
        errorDisplay.classList.remove('display');
        errorDisplay.classList.add('loading');
        loadingIcon.classList.add('loading');
      }
    });
  })();
})();
