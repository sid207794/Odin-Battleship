import { vantaEffect } from './index.js';

export let cityData = [];

export async function getWeatherApi(city) {
  try {
    cityData.length = 0;
    const cityName = city.trim();
    const resolve = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=metric&key=TJKLDPKEX986CRYB7PZ6PBN8K&contentType=json&elements=%2Baqius`,
      { mode: 'cors' }
    );
    const resolveReference = await resolve.json();
    cityData.push(resolveReference);
    const loadPage = document.querySelector('.loadPage');

    setTimeout(() => {
      loadPage.classList.add('fadeOut');
      setTimeout(() => {
        if (vantaEffect) {
          vantaEffect.destroy();
          console.log('VantaEffect was destroyed!');
        }
      }, 1000);
    }, 1500);
    console.log(cityData);
  } catch (error) {
    const errorDisplay = document.querySelector('.loadPage .error');
    const bodyError = document.querySelector('.bodyError');
    const loadingIcon = document.querySelector('.loadingIcon');

    bodyError.classList.add('display');
    errorDisplay.classList.remove('loading');
    loadingIcon.classList.remove('loading');
    errorDisplay.classList.add('display');
    errorDisplay.textContent = 'We were unable to find this place!';
    bodyError.textContent = 'We were unable to find this place!';

    setTimeout(() => {
      bodyError.classList.remove('display');
      errorDisplay.classList.remove('display');
    }, 2500);
  }
}
