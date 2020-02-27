'use strict';

(() => {
    const tags = {
        airport: 'airports',
        bank: 'banks',
        atm: 'ATMs',
        hotel: 'hotels',
        pub: 'pubs',
        bus_station: 'bus stations',
        railway_station: 'railway stations',
        cinema:	'cinema theatres',
        hospital: 'hospitals',
        college: 'colleges',
        school:	'schools',
        pharmacy: 'pharmacies',
        supermarket: 'supermarket',
        fuel: 'fuel stations',
        toilet: 'toilets',
        park: 'parks',
        stadium: 'stadiums',
    };
    const optionsContainer = document.getElementById('tag');
    
    Object.keys(tags).forEach(option => {
        optionsContainer.innerHTML += `<option value="${option}">${tags[option]}</option>`;
    });
})();

function showAlert(message) {
    const alert = document.getElementById('alert');
    alert.innerText = message;
    alert.classList.remove('d-none');

    setInterval(() => {
        alert.classList.add('d-none');
    }, 3000);
}

async function makeRequest(e) {
    e.preventDefault();
    
    const spinner = document.getElementById('spinner');
    const results = document.getElementById('results');
    const contentContainer = document.getElementById('nearby');
    const imageContainer = document.getElementById('image');
    const { options } = document.getElementById('tag');
    const { value: place } = document.getElementById('place');
    const tag = options[options.selectedIndex].value;
    
    contentContainer.innerHTML = '';
    imageContainer.innerHTML = '';
    
    if (place === '') {
        return showAlert('Starting point should not be an empty string!');
    }

    results.classList.add('d-none');
    spinner.classList.remove('d-none');

    try {
        const plainResponse = await fetch(`http://127.0.0.1:3000/api/v1?place=${place}&tag=${tag}`);

        if (plainResponse.status !== 200) {
            return showAlert('Could not find anything!');
        }

        const jsonResponse = await plainResponse.json();
        const { nearbyPlaces } = jsonResponse;

        if (jsonResponse.randomImage) {
            imageContainer.innerHTML = `<img src="${jsonResponse.randomImage}" alt=""  class="img-fluid rounded"/>`;
        }

        let content = '';
        for (let i = 0; i < nearbyPlaces.length; i++) {
            if (!nearbyPlaces[i].name) {
                continue;
            }

            content += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    ${nearbyPlaces[i].name}
                    <span class="badge badge-primary badge-pill">${nearbyPlaces[i].distance}m away</span>
                </li>`;
        }

        contentContainer.innerHTML = content;
    } catch (err) {
        console.log(`Error: ${err}`);
    } finally {
        spinner.classList.add('d-none');
        results.classList.remove('d-none');
    }
}
