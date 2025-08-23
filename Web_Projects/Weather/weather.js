const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap API key

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weather-icon');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if(city === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => displayWeather(data))
        .catch(err => alert('City not found!'));
});

function displayWeather(data) {
    if(data.cod !== 200) {
        alert('City not found!');
        return;
    }

    cityName.textContent = data.name + ', ' + data.sys.country;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    description.textContent = `Weather: ${data.weather[0].description}`;

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.style.display = 'block';
}
