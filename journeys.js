//doc sections
const form = document.getElementById("form");
const journeysList = document.getElementById("journeys-list");

//form inputs
const city = document.getElementById("city");
const country = document.getElementById("country");
const start = document.getElementById("start");
const end = document.getElementById("end");
const description = document.getElementById("desc");
const add = document.getElementById("addBtn");

//my own journeys I want to be displayed on page initially
const initialJourneys = [
    {
        city: "Ouarzazate",
        country: "Morocco",
        start: "2011-03-20",
        end: "2011-03-27",
        description: "Horseback riding trip in the desert area with a friend."
    },
    {
        city: "Shanghai",
        country: "China",
        start: "2011-09-08",
        end: "2011-10-15",
        description: "Stayed there for an internship. Got the chance to travel a bit, too."
    }
];

//retrieves current journeys array from local storage
const getJourneys = () => {
    let stringJourneys = localStorage.getItem("journeys");
    if (!stringJourneys) {
        return initialJourneys;
    }
    return JSON.parse(stringJourneys);
}

//gets current journeys array, saves journey to it, saves to local storage again
const saveJourney = (journey) => {
    let journeys = getJourneys();
    journeys.push(journey);
    localStorage.setItem("journeys", JSON.stringify(journeys));
}

//creates text using variables of journey array passed as parameter
const createJourney = (journey) => {
    let journeyText = `
    From ${journey.start} to ${journey.end}, I visited <br> ${journey.city} in ${journey.country}.
    My memories:<br>"${journey.description}"
    `;
    return journeyText;
}

const removeJourney = (index) => {
    let journeys = getJourneys();
    journeys.splice(index, 1);
    localStorage.setItem("journeys", JSON.stringify(journeys));
}

//fetches data from API and returns in json format
const fetchData = (journey) => {
    //to do: change to my personal key
    return  fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${journey.city}&appid=18ebb74c4c845cd84cc98885effee0ae`)
            .then((response) => response.json())
}

//creates and returns text based on API info
const weatherText = (json) => {
    const city = json.name;
    const main = json.main;
    const sky = json.weather[0];
    
    return `
        <div class="flex">
            <img id="weatherIcon" class="column" src="http://openweathermap.org/img/wn/${sky.icon}@2x.png">
            <div class="column">
             The current temperature in ${city} feels like ${main.temp_max} 
             and the sky looks like this: ${sky.description}
            </div>
        </div>
    `;
}

//empties journeyslist, then for all journeys produces journey and weather text and deleteBtn
const allJourneys = () => {
    journeysList.innerHTML = "";
    getJourneys().forEach((journey, index) => {
        fetchData(journey).then(json => {
            //journey text
            const insertion = document.createElement("div");
            insertion.innerHTML = createJourney(journey);
            journeysList.appendChild(insertion);
            //weather data
            const weatherInfo = document.createElement("div");
            weatherInfo.innerHTML = weatherText(json);
            journeysList.appendChild(weatherInfo);
            //deleteBtn
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = `delete entry`;
            journeysList.appendChild(deleteBtn);
            deleteBtn.addEventListener("click", () => {
                removeJourney(index);
                allJourneys();
            });
        });
    });
}

const addJourney = (journey) => {
    saveJourney(journey);
    allJourneys();
}

const onSubmit = (event) => {
    event.preventDefault();
    let journey = {
        city: city.value,
        country: country.value,
        start: start.value,
        end: end.value,
        description: description.value,
    };
    addJourney(journey);
    form.reset();
}

form.addEventListener("submit", onSubmit);

allJourneys();