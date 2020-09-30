//doc sections
const form = document.getElementById("form");
const journeysList = document.getElementById("journeys-list");

//form inputs
const city = document.getElementById("city");
const country = document.getElementById("country");
const start = document.getElementById("start");
const end = document.getElementById("end");
const description = document.getElementById("desc");
const button = document.getElementById("button");

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

const createJourney = (journey) => {
    let journeyText = `
    From ${journey.start} to ${journey.end}, I visited ${journey.city} in ${journey.country}.
    `;
    return journeyText;
}

const allJourneys = () => {
    journeysList.innerHTML = "";
    getJourneys().forEach((journey) => {
        const insertion = document.createElement("div");
        insertion.innerHTML = createJourney(journey);
        journeysList.appendChild(insertion);
    });
}

const addJourney = (journey) => {
    saveJourney(journey);
    allJourneys();
}

const onSubmit = (event) => {
    event.preventDefault();
    let journey = {};
    journey.city = city.value;
    journey.country = "Test";
    journey.start = "2018-05-09";
    journey.end = "2018-05-28";
    journey.description = "Adding fictional trip";
    addJourney(journey);
// form.resetForm();
}

form.addEventListener("submit", onSubmit);

allJourneys();