import { api } from './config.js';

const dom = {
    form: document.querySelector('#app-form'),
    postcodeInput: document.querySelector('#postcode-input'),
    results: document.querySelector('.results .location-wrapper'),
    errorMessage: document.querySelector('.error-message'),
    inputErrorMessage: document.querySelector('.error-message.input'),
    errorText: document.querySelector('.error-message p'),
    location: document.querySelector('.location'),
    loadingIcon: document.querySelector('.loading-image-wrapper ')
}

const coordinates = {
    lat: 55.3781,
    lng: -3.4360
}

const map = new google.maps.Map(document.getElementById('map'), {
    center: coordinates,
    zoom: 6
});

let currentPostcode = '';


// HTTP requests
const getPostcode = async (request) => {
    dom.loadingIcon.classList.add('active');
    try {
        const response = await fetch(`${ api.endPoint }/${ request }`);
        const postcode = await response.json();
        dom.loadingIcon.classList.remove('active');
        return postcode;
    } catch(err) {
        console.log(err)
    }
}

// handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();
    const postcode = dom.postcodeInput.value;
   
    // Only make an api call on a new postcode
    if(currentPostcode == postcode) {
        return;
    };

    currentPostcode = postcode;
    const response = await getPostcode(postcode);
    const { result } = response;

    if(document.querySelector('.location') !== null) document.querySelector('.location').remove();

    if(dom.postcodeInput.value.length == 0) {
        dom.inputErrorMessage.classList.add('active');
        return;
    } else {
        dom.inputErrorMessage.classList.remove('active');
    }

    if(response.status !== 200) {
        dom.errorMessage.classList.add('active');
        dom.errorText.innerText = response.error;
        return;
    } else {
        dom.errorMessage.classList.remove('active');
        dom.errorText.innerText = "";
    }


    dom.results.innerHTML = `
        <div class="location">
            <p><span class='bold'>County</span>: ${ result.admin_district }<p>
            <p><span class='bold'>City</span>: ${ result.admin_ward }</p>
            <p><span class='bold'>Region</span>: ${ result.region }</p>
            <p><span class='bold'>Postcode</span>: ${ result.postcode }</p>
            <p><span class='bold'>Latitude</span>: ${ result.latitude }</p>
            <p><span class='bold'>Longitude</span>: ${ result.longitude }</p>
        </div>
    `;

    const map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: result.latitude,
            lng: result.longitude
        },
        zoom: 15
    });

}

// Events
dom.form.addEventListener('submit', handleSubmit);