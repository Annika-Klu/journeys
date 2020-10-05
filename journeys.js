//doc sections
const form = document.getElementById("form");
const journeysList = document.getElementById("journeys-list");

//form inputs
const yourName = document.getElementById("name");
const countryOrigin = document.getElementById("countryOrigin");
const city = document.getElementById("city");
const country = document.getElementById("country");
const start = document.getElementById("start");
const end = document.getElementById("end");
const description = document.getElementById("desc");
const add = document.getElementById("addBtn");

//sorting dropdown selector
const orderSelect = document.getElementById("order-select");

//my own journeys I want to be displayed on page initially
const initialJourneys = [
    {
        name: "Annika",
        origin: "Germany",
        city: "Ouarzazate",
        country: "Morocco",
        start: "2011-03-20",
        end: "2011-03-27",
        description: "Horseback riding trip in the desert area with a friend. We saw nomads, beautiful desert places with palm trees as well as oases and clay villages."
    },
    {
        name: "Annika",
        origin: "Germany",
        city: "Shanghai",
        country: "China",
        start: "2011-09-08",
        end: "2011-10-15",
        description: "Stayed there for an internship. Fascinating city but very crowded and noisy. Got the chance to travel to Hangzhou and Suzhou in the South, visiting an old village and the Hangzhou Lake."
    }
];

//ADDED sorting function
let sortList = "city";

const sortJourneys = (journeys) => {
    if (sortList === "city") {
        return journeys.sort((a, b) => a.city.localeCompare(b.city));
    }
    if (sortList === "country") {
        return journeys.sort((a, b) => a.country.localeCompare(b.country));
    }
    if (sortList === "startDate") {
        return journeys.sort((a, b) => a.start.localeCompare(b.start));
    }
};

//retrieves current journeys from local storage, sorts, and returns as array
const getJourneys = () => {
    let stringJourneys = localStorage.getItem("journeys");
    if (!stringJourneys) {
        return initialJourneys;
    }
    return sortJourneys(JSON.parse(stringJourneys));
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
    <div class="journey-title">
        <span class="personalData">
            <span class="bold">${journey.name} from ${journey.origin}</span>
            <br>
            explored
        </span>
        <br>
        <span class="travelLocation">
            ${journey.city}, ${journey.country}
        </span>
    </div>
    <br>
    <div class="flex journeyColumns">
        <div class="column">
            <span class="dates">
            <span class="dates-title bold">travel dates<br></span>
                ${journey.start} to ${journey.end}
            </span>
            <br> <br>
            <span class="memories bold">memories</span>
            <br>
            <span class="quote">"${journey.description}"<span>
            </span>
        </div>
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
    return  fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${journey.city}&appid=11c6f4677a50a8f4992f135de7fafa0f`)
            .then((response) => response.json())
}

//creates and returns text based on API info
const weatherText = (json) => {
    const city = json.name;
    const main = json.main;
    const sky = json.weather[0];
    
    return `
        <div class="column flex">
            <img class="weatherIcon" src="http://openweathermap.org/img/wn/${sky.icon}@2x.png">
            <div class="weatherText">
                <span class="weatherTitle bold">weather data</span><br>
                The current temperature in ${city} feels like ${main.temp_max}°C
                and the sky looks like this: ${sky.description}
            </div>
        </div>
    </div>
    <br>
    `;
}

//empties journeyslist, then for all journeys produces journey and weather text and deleteBtn
const allJourneys = () => {
    journeysList.innerHTML = "";
    getJourneys().forEach((journey, index) => {
        console.log(journey);
        fetchData(journey).then(json => {
            console.log(json.name);
            //journey & weather text
            const insertion = document.createElement("div");
            insertion.innerHTML = createJourney(journey) + weatherText(json);
            journeysList.appendChild(insertion);
            //deleteBtn
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = `- delete -`;
            journeysList.appendChild(deleteBtn);
            deleteBtn.addEventListener("click", () => {
                removeJourney(index);
                allJourneys();
            });
            //line between journeys
            const line = document.createElement("div");
            line.innerHTML = `<br> <hr> <br>`
            journeysList.appendChild(line);
        });
    });
}

const addJourney = (journey) => {
    saveJourney(journey);
    allJourneys();
}

//on journey form submit
const onSubmit = (event) => {
    event.preventDefault();
    let journey = {
        name: yourName.value,
        origin: countryOrigin.value,
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

//ADDED eventListener + function for select form
const changeOrder = (event) => {
    sortList = event.target.value;
    allJourneys();
}

orderSelect.addEventListener("change", changeOrder);

allJourneys();