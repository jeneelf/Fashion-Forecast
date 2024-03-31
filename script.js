function getWeather() {
  const apiKey = "0013d1727c79c04d63a754f1c51940b6";
  const city = document.getElementById("city").value;
  const units = document.querySelector('input[name="units"]:checked').value;

  if (!city) {
    alert("Please enter a city");
    return;
  }

  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;

  fetch(currentWeatherURL)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data, units);
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      alert("Error fetching current weather data. Try again.");
    });

  fetch(forecastURL)
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list, units);
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error);
      alert("Error fetching hourly forecast data. Try again.");
    });
}

function displayWeather(data, units) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  // Clear previous content
  weatherInfoDiv.innerHTML = "";
  hourlyForecastDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";

  if (data.cod === "404") {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cityName = data.name;
    let temperature;
    if (units === "metric") {
      temperature = Math.round(data.main.temp) + "°C";
    } else {
      temperature = Math.round(data.main.temp) + "°F";
    }
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconURL = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHTML = `<p>${temperature}</p>`;
    const weatherHTML = `<p>${cityName}</p><p>${description}</p>`;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHTML;
    weatherIcon.src = iconURL;
    weatherIcon.alt = description;

    showImage(temperature);

    document.getElementById("outfit-area").style.display = "flex";
    document.getElementById("weather-text").style.display = "block"; //show hidden areas
  }
}

function displayHourlyForecast(hourlyData, units) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");
  const next24Hours = hourlyData.slice(0, 12);

  next24Hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    let temperature;
    if (units === "metric") {
      temperature = Math.round(item.main.temp) + "°C";
    } else {
      temperature = Math.round(item.main.temp) + "°F";
    }
    const iconCode = item.weather[0].icon;
    const iconURL = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItemHTML = `
          <div class="hourly-item">
            <span>${hour}:00</span>
            <img src="${iconURL}" alt="Hourly Weather Icon">
            <span>${temperature}</span>
          </div>`;
    hourlyForecastDiv.innerHTML += hourlyItemHTML;
  });
}

function showImage(temperature) {
  let imageSrc;
  let imageArray;

  if (temperature.includes("°C")) {
    temperature = parseInt(temperature);
    if (temperature >= 0 && temperature <= 5) {
      imageArray = ["very-cold1.jpg", "very-cold2.jpg", "very-cold3.jpg"]; // Array for very cold temperature
    } else if (temperature > 5 && temperature <= 10) {
      imageArray = ["cold1.jpg", "cold2.jpg", "cold3.jpg"]; // Array for cold temperature
    } else if (temperature > 10 && temperature <= 15) {
      imageArray = [
        "moderate-cold1.jpg",
        "moderate-cold2.jpg",
        "moderate-cold3.jpg",
      ]; // Array for moderate cold temperature
    } else if (temperature > 15 && temperature <= 20) {
      imageArray = ["moderate1.jpg", "moderate2.jpg", "moderate3.jpg"]; // Array for moderate temperature
    } else if (temperature > 20 && temperature <= 25) {
      imageArray = ["warm1.jpg", "warm2.jpg", "warm3.jpg"]; // Array for warm temperature
    } else {
      imageArray = ["hot1.jpg", "hot2.jpg", "hot3.jpg"]; // Array for hot temperature
    }
  } else if (temperature.includes("°F")) {
    temperature = parseInt(temperature);
    if (temperature >= 32 && temperature <= 41) {
      imageArray = ["very-cold1.jpg", "very-cold2.jpg", "very-cold3.jpg"]; // Array for very cold temperature
    } else if (temperature > 41 && temperature <= 50) {
      imageArray = ["cold1.jpg", "cold2.jpg", "cold3.jpg"]; // Array for cold temperature
    } else if (temperature > 50 && temperature <= 59) {
      imageArray = [
        "moderate-cold1.jpg",
        "moderate-cold2.jpg",
        "moderate-cold3.jpg",
      ]; // Array for moderate cold temperature
    } else if (temperature > 59 && temperature <= 68) {
      imageArray = ["moderate1.jpg", "moderate2.jpg", "moderate3.jpg"]; // Array for moderate temperature
    } else if (temperature > 68 && temperature <= 77) {
      imageArray = ["warm1.jpg", "warm2.jpg", "warm3.jpg"]; // Array for warm temperature
    } else {
      imageArray = ["hot1.jpg", "hot2.jpg", "hot3.jpg"]; // Array for hot temperature
    }
  }

  // Pick a random image from the selected array
  imageSrc = imageArray[Math.floor(Math.random() * imageArray.length)];

  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.style.display = "block";
  const outfitButtons = document.querySelectorAll(".outfit-button img");
  outfitButtons.forEach((img) => {
    img.src = imageSrc;
  });
}

document.querySelectorAll('input[name="units"]').forEach((input) => {
  input.addEventListener("change", () => {
    getWeather(); // Re-fetch weather data with the selected units
  });
});
