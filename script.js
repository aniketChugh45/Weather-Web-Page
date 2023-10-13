let user_weather = document.querySelector(".user-weather");

let search_weather = document.querySelector(".search-weather");

let input_city = document.querySelector(".input-city-value");

let search_city_btn = document.querySelector(".search-city-btn");

let city_name = document.querySelector(".city-name");

let country_img = document.querySelector(".country-img");

let description_txt = document.querySelector(".description-txt");

let description_img = document.querySelector(".description-img");

let temperature = document.querySelector(".temperature");

let windValue = document.querySelector(".wind-value");

let humidValue = document.querySelector(".humidity-value");

let cloudinessValue = document.querySelector(".cloudiness-value");

let choose_Container = document.querySelector(".choose-container");

let grant_access_btn = document.querySelector(".grant-access-btn");

let grant_location_container = document.querySelector(".grant-location-container");

let search_city_container = document.querySelector(".search-city-container");

let weather_display_container = document.querySelector(".weather-display-container");

let loading_container = document.querySelector(".loading-container");

let not_found_container = document.querySelector(".not-found-container");

const API_KEY = "5eb762324183aeb0fa46e54a76b53580";

user_weather.classList.add('active');
grant_location_container.classList.add('active');
handleUserTab();

function switchToSearch(){
    if(search_weather.classList.contains('active')){
        return;
    }
    else{
        user_weather.classList.remove('active');
        weather_display_container.classList.remove('active');
        grant_location_container.classList.remove('active');
        search_city_container.classList.add('active');
        search_weather.classList.add('active');
        not_found_container.classList.remove('active');
    }
}


function switchToUser(){
    if(user_weather.classList.contains('active')){
        return;
    }
    else{
        search_city_container.classList.remove('active');
        search_weather.classList.remove('active');
        user_weather.classList.add('active');
        not_found_container.classList.remove('active');
    }
    handleUserTab();
}

user_weather.addEventListener('click',switchToUser);

search_weather.addEventListener('click',switchToSearch);

grant_access_btn.addEventListener('click',getLocation);

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
    sessionStorage.setItem("latitude",position.coords.latitude);
    sessionStorage.setItem("longitude",position.coords.longitude);
    handleUserTab();
}

function handleUserTab(){
    if(sessionStorage.getItem("latitude")!==null && sessionStorage.getItem("longitude")!==null){
        grant_location_container.classList.remove('active');
        fetchWeatherLatLong();
       
    }
    else{
        weather_display_container.classList.remove('active');
        grant_location_container.classList.add('active');
    }
}


async function fetchWeatherLatLong(){
    try {
        loading_container.classList.add('active');
        let lat = sessionStorage.getItem("latitude");
        let lon = sessionStorage.getItem("longitude");
        let content = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        let data = await content.json();
        renderData(data);    
    } catch (e) {
        loading_container.classList.remove('active');
        weather_display_container.classList.remove('active');
        not_found_container.classList.add('active');
    }
}

async function fetchWeatherCityName(city_name){
    try {
        loading_container.classList.add('active');
        let content = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}&units=metric`);
        let data = await content.json();
        renderData(data);    
    } catch (e) {
        loading_container.classList.remove('active');
        weather_display_container.classList.remove('active');
        not_found_container.classList.add('active');
    }
}

function searchCityWeather(){
    if(input_city.value === null || input_city.value === undefined || input_city.value ===""){
        return;
    }
    not_found_container.classList.remove('active');
    let city_name = input_city.value;
    input_city.value="";
    console.log(city_name);
    fetchWeatherCityName(city_name);
}

search_city_btn.addEventListener('click',searchCityWeather);

input_city.addEventListener('keypress',function(e){
    if(e.key==='Enter'){
        searchCityWeather();
    }
});

function renderData(data){
    let country_code = data?.sys?.country.toLowerCase();
    let icon = data?.weather[0]?.icon;

    city_name.innerText = data?.name;
    country_img.src = `https://flagcdn.com/144x108/${country_code}.png`;
    description_txt.innerText = data?.weather[0]?.main;
    temperature.innerText = `${data?.main?.temp}°C`;
    description_img.src = `https://openweathermap.org/img/w/${icon}.png`
    windValue.innerText = `${data?.wind?.speed}m/s`;
    humidValue.innerText= `${data?.main?.humidity}%`;
    cloudinessValue.innerText = `${data?.clouds?.all}%`;

    loading_container.classList.remove('active');
    weather_display_container.classList.add('active');

}

