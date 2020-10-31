//variables
import { randomPersonData } from "./randomPersonData.js";
const landList = document.getElementById('landen-lijst');
const capricornList = document.getElementById('steenbok-vrouwen');
const creditList = document.getElementById('ouwe-creditcards');
const topLandList = document.getElementById('top-landen');
const ageList = document.getElementById('gem-leeftijd');
const body = document.querySelector('#output');
const matchList = document.getElementById('match-maker');
let matchBtns = false;

//functions
//prints list of regions to the DOM
function getLandList() {
    const regions = randomPersonData.map(item => item.region);
    const noDuplicates = [];

    // filters out all duplicate regions
    regions.forEach(item => {
        if (!noDuplicates.includes(item)) {
            noDuplicates.push(item);
        }
    });

    noDuplicates.sort();
    let output = "<h2>Landenlijst</h2>";

    noDuplicates.forEach(item => {
        output += `<li>${item}</li>`;
    });

    body.innerHTML = output;
}

//prints list of capricorn women to DOM
function getCapricornList() {
    const people = randomPersonData
        .filter(item => item.gender === "female")
        .filter(item => item.age > 30)
        .filter(item => item.birthday.mdy.substring(0, 2) == '01' || item.birthday.mdy.substring(0, 2) == '12');
    let capricorn = [];

    //filters all capricorns into an array
    people.forEach(item => {
        if (item.birthday.mdy.substring(0, 2) == '01' && item.birthday.dmy.substring(0, 2) <= 19) {
            capricorn.push(item);
        } else if (item.birthday.mdy.substring(0, 2) == '12' && item.birthday.dmy.substring(0, 2) >= 22) {
            capricorn.push(item);
        }
    });

    //sort by firstname
    capricorn.sort((a, b) => {
        let nameA = a.name.toUpperCase(); // ignore upper and lowercase
        let nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    let output = "<h2>Steenbok Vrouwen</h2>";

    capricorn.forEach(item => {
        output += `<li> naam: ${item.name}</li>
        <li> achternaam: ${item.surname}</li>
        <li> <img src="${item.photo}"></li>`;
    });

    body.innerHTML = output;
}

//prints list of nearly expired creditcard holders to DOM
function getCreditList() {
    const date = new Date();
    const year = date.getFullYear() - 2000;
    const people = randomPersonData.filter(person => person.age >= 18)
        .filter(item => item.credit_card.expiration.slice(-2) > year)
        .filter(item => item.credit_card.expiration.slice(-2) <= year + 1);

    //sort by creditdate 
    people.sort((a, b) => {
        let monthA = parseFloat(a.credit_card.expiration.slice(0, -3));
        let monthB = parseFloat(b.credit_card.expiration.slice(0, -3));

        if (monthA < monthB) {
            return -1;
        }
        if (monthA > monthB) {
            return 1;
        }
        return 0;
    });

    let output = "<h2>Ouwe Creditcards</h2>";

    people.forEach(item => {
        output += `<li> naam: ${item.name} ${item.surname} </li>
        <li> telefoonnummer: ${item.phone}</li>
        <li> creditcardnummer: ${item.credit_card.number}</li>
        <li> verloopdatum: ${item.credit_card.expiration}</li>
        <br>`;
    });

    body.innerHTML = output;
}

//prints top countries to the DOM
function getTopCountriesList() {
    const regions = randomPersonData.map(item => item.region);
    const noDupliList = [];
    const popArray = [];

    //counts duplicates
    function duplicateCounter(country) {
        const duplis = regions.filter(item => item.includes(country));
        const index = duplis.length;
        return index;
    }

    // filters out all duplicate regions
    regions.forEach(item => {
        if (!noDupliList.includes(item)) {
            noDupliList.push(item);
            const obj = {};
            obj.name = `${item}`;
            obj.index = duplicateCounter(item);
            popArray.push(obj);
        }
    });

    //sort by popularity
    popArray.sort((a, b) => {
        let voteA = a.index;
        let voteB = b.index;

        if (voteA > voteB) {
            return -1;
        }
        if (voteA < voteB) {
            return 1;
        }
        return 0;
        // if the function returns -1, sort a before b
        // if the function returns greater 1, sort b before a
        // if the function returns 0, leave a and b unchanged 
    });

    let output = "<h2>Top Landen</h2>";

    popArray.forEach(item => {
        output += `<li>${item.name}: ${item.index} </li>`;
    });

    body.innerHTML = output;
}

//enables country buttons
const enableBtns = function () {
    matchBtns = document.querySelectorAll('.leeftijd-btn');
    matchBtns.forEach(item => {
        item.addEventListener('click', event => {
            const country = event.target.id;
            ageFinder(country);
        })
    });
}

//calculates gem age per country
function ageFinder(country) {
    const duplis = randomPersonData.filter(item => item.region.includes(country));
    const index = duplis.length;
    let gemAge = 0;
    const container = document.getElementById('container');

    if (index > 1) {
        const ageArray = duplis.map(item => item.age);
        const totalAge = ageArray.reduce((prev, current) => prev + current);
        gemAge = Math.round(totalAge / index);
    } else {
        gemAge = duplis[0].age;
    }
    const msg = document.createElement('p');
    msg.textContent = `De gemiddelde persoon in ${country} is ${gemAge} jaar oud`;
    container.appendChild(msg);
}

//prints gem age to the DOM
function getAgeList() {
    const regionsList = [];

    // filters out all duplicate regions
    randomPersonData.forEach(item => {
        const country = item.region;
        if (!regionsList.includes(country)) {
            regionsList.push(country);
        }
    });

    let output = "<h2>Gem Leeftijd per Land</h2>";

    regionsList.forEach(item => {
        output += `<li><button class="leeftijd-btn" id="${item}">${item}</button></li>`;
    });

    body.innerHTML = output;
    enableBtns();
}

//prints list of zodiac matches to DOM
function getMatchList() {
    const people = randomPersonData
        .filter(item => item.age > 17);
    let matches = [];

    //copies data into new array and adds zodiac sign
    people.forEach(item => {
        const month = parseFloat(item.birthday.mdy.substring(0, 2));
        const day = parseFloat(item.birthday.dmy.substring(0, 2));
        const obj = {
            name: item.name,
            surname: item.surname,
            photo: item.photo,
            region: item.region,
            age: item.age
        };

        switch (month) {
            case 1:
                if (day <= 20) {
                    obj.zodiac = 'steenbok';
                } else {
                    obj.zodiac = 'waterman';
                }
                break;
            case 2:
                if (day <= 19) {
                    obj.zodiac = 'waterman';
                } else {
                    obj.zodiac = 'vissen';
                }
                break;
            case 3:
                if (day <= 20) {
                    obj.zodiac = 'vissen';
                } else {
                    obj.zodiac = 'ram';
                }
                break;
            case 4:
                if (day <= 20) {
                    obj.zodiac = 'ram';
                } else {
                    obj.zodiac = 'stier';
                }
                break;
            case 5:
                if (day <= 20) {
                    obj.zodiac = 'stier';
                } else {
                    obj.zodiac = 'tweelingen';
                }
                break;
            case 6:
                if (day <= 21) {
                    obj.zodiac = 'tweelingen';
                } else {
                    obj.zodiac = 'kreeft';
                }
                break;
            case 7:
                if (day <= 22) {
                    obj.zodiac = 'kreeft';
                } else {
                    obj.zodiac = 'leeuw';
                }
                break;
            case 8:
                if (day <= 23) {
                    obj.zodiac = 'leeuw';
                } else {
                    obj.zodiac = 'maagd';
                }
                break;
            case 9:
                if (day <= 22) {
                    obj.zodiac = 'maagd';
                } else {
                    obj.zodiac = 'weegschaal';
                }
                break;
            case 10:
                if (day <= 23) {
                    obj.zodiac = 'weegschaal';
                } else {
                    obj.zodiac = 'schorpioen';
                }
                break;
            case 11:
                if (day <= 22) {
                    obj.zodiac = 'schorpioen';
                } else {
                    obj.zodiac = 'boogschutter';
                }
                break;
            case 12:
                if (day <= 21) {
                    obj.zodiac = 'boogschutter';
                } else {
                    obj.zodiac = 'steenbok';
                }
                break;
        }
        matches.push(obj);
    });

    //sort by firstname
    matches.sort((a, b) => {
        let nameA = a.name.toUpperCase(); // ignore upper and lowercase
        let nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });


    //enables match buttons
    const enableMatches = function () {
        matchBtns = document.querySelectorAll('.match-btn');
        matchBtns.forEach(item => {
            item.addEventListener('click', event => {
                const zodiac = event.target.id;
                const caller = event.target.classList[1];
                findMatches(zodiac, caller);
            })
        });
    }

    function findMatches(zodiac, caller) {
        const zodiacMatches = matches.filter(item => item.zodiac === zodiac);
        const indexNum = zodiacMatches.findIndex(item => item.name === caller);
        const loveSeeker = zodiacMatches.splice(indexNum, 1);
        let output = "<h2>Match by Zodiac</h2>";

        output += `<br>
        <li><strong>${loveSeeker[0].name} ${loveSeeker[0].surname}</strong></li>
        <li><img width="200" src="${loveSeeker[0].photo}"></li>
        <br><hr>
        <h4>${loveSeeker[0].name}'s Matches:</h4><br>`;

        zodiacMatches.forEach(item => {
            output += `<li> <img src="${item.photo}"></li>
            <li> naam: ${item.name} ${item.surname}</li>
            <li>regio: ${item.region}</li>
            <li>leeftijd: ${item.age}</li>
            <li>sterrenbeeld: ${item.zodiac}</li>
                <br>`;
        });

        body.innerHTML = output;
    }

    let output = "<h2>Match by Zodiac</h2>";

    matches.forEach(item => {
        output += `<li> naam: ${item.name} ${item.surname}</li>
            <li> <img src="${item.photo}"></li>
            <li>regio: ${item.region}</li>
            <li>leeftijd: ${item.age}</li>
            <li>sterrenbeeld: ${item.zodiac}</li>
            <li><button class="match-btn ${item.name}" id="${item.zodiac}">vind matches</button></li>
            <br>`;
    });

    body.innerHTML = output;
    enableMatches();
}

//eventlisteners
landList.addEventListener('click', getLandList);
capricornList.addEventListener('click', getCapricornList);
creditList.addEventListener('click', getCreditList);
topLandList.addEventListener('click', getTopCountriesList);
ageList.addEventListener('click', getAgeList);
matchList.addEventListener('click', getMatchList);