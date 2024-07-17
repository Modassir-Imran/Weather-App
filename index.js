const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container")

const grantAccessContainer = document.querySelector(".grant-location-container")
 
const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");

const grantAccessButton = document.querySelector("[data-grantAccess]");

const searchInput = document.querySelector("[data-searchInput]");

// initially vairiable need

let currentTab = userTab;
const API_KEY = "566fac0c172218c2eba203432cc98b92";
currentTab.classList.add("current-tab");


getfromSessionStorage();

function switchTab(clickedTab){
    // when current tab and clicked tab is different
    // current tab is oldertab
    // clicked tab is like as new tab

    if(clickedTab != currentTab ){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        
        // if search tab waala invisble hai to visible kerna hai
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("flex");
            userInfoContainer.classList.add("hidden");
            grantAccessContainer.classList.remove("flex");
            grantAccessContainer.classList.add("hidden");
            searchForm.classList.remove("hidden");
            searchForm.classList.add("flex");
        }
        else{
            // main pehle search wale pr tha ab your weather tab visible kerna ha
            searchForm.classList.remove("flex");
            searchForm.classList.add("hidden");
            userInfoContainer.classList.remove("flex");
            userInfoContainer.classList.add("hidden");
            // saved waale coordinates se lega 
            getfromSessionStorage();
                 
        }
    }
}

userTab.addEventListener('click', () => {
    switchTab(userTab);  // passed clicked tab as input parameter
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);  // passed clicked tab as input parameter

});

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        grantAccessContainer.classList.add("flex");
        grantAccessContainer.classList.remove("hidden");
        //console.log("coordinates not present")
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
        //console.log("coordinates not present");

    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("flex");
    grantAccessContainer.classList.add("hidden");
    // make loader visible
    loadingScreen.classList.remove("hidden");
    loadingScreen.classList.add("flex");
   

    // API call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );



        const data =await response.json();

        loadingScreen.classList.remove("flex");
        loadingScreen.classList.add("hidden");
        userInfoContainer.classList.remove("hidden");
        userInfoContainer.classList.add("flex");
        renderWeatherInfo(data);
        // console.log(lat);
        // console.log(lon);
    }
    catch(error){
        loadingScreen.classList.remove("flex");
        loadingScreen.classList.add("hidden");

    }
}

function renderWeatherInfo(weatherInfo){
    // firstly we haveto fetch the element 
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temperature= document.querySelector("[data-temp");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness");

    //console.log(weatherInfo);
    // fetch value from weather INFO and put it UI ElementInternals
    cityName.innerText = weatherInfo?.name
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = `${weatherInfo?.weather?.[0]?.description}`;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${Math.floor(weatherInfo?.main?.temp-273)}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`; 

    //console.log(weatherInfo);

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
 
    }
}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        }
     sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
     fetchUserWeatherInfo(userCoordinates);
}
grantAccessButton.addEventListener('click', getLocation);


searchForm.addEventListener("submit",(e)=>{
    e.preventDefault(); 
    let cityName = searchInput.value;

    if(cityName ==="")
        return ;
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.remove("hidden");
    loadingScreen.classList.add("flex");
    userInfoContainer.classList.remove("flex");
    userInfoContainer.classList.add("hidden");
    grantAccessContainer.classList.remove("flex");
    grantAccessContainer.classList.add("hidden");


    try{
        const response =await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );

        
    const data = await response.json();
    loadingScreen.classList.remove("flex");
    loadingScreen.classList.add("hidden");
    userInfoContainer.classList.remove("hidden");
    userInfoContainer.classList.add("flex");

    renderWeatherInfo(data);

    }
    catch(err){

    }
 
}

