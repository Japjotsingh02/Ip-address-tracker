// All DOM Elements
const domElements={
  input: document.querySelector('.input'),
  searchButton:document.querySelector('.button'),
  address:document.querySelector('.address'),
  location :document.querySelector('.location'),
  timeZone :document.querySelector('.timezone'),
  provider:document.querySelector('.provider'),
  loader:document.querySelector('.loader'),
};


// Get Input
const getInput=(e)=>{
  if(! domElements.input.value) return;
  e.preventDefault();
  findType(domElements.input.value);
}


// Api Credentials
const addressApi={
  url:"https://geo.ipify.org/api/v1",
  key:"at_IIa7jKlnHWJb2iCB1v5WR2g2u3BHb",
};


// Regular Expression to find domain or ip address
const ValidIpAddressRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

const ValidHostnameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;


let add="";
// Find that input is domain or ip address
const findType=(inputText) =>{
  if(inputText.match(ValidHostnameRegex)){
    domElements.loader.style.display="block";
    add=`domain=${domElements.input.value}`;
    getAddress();
  }
  else if(inputText.match(ValidIpAddressRegex)){
    domElements.loader.style.display="block";
    add=`ipAddress=${domElements.input.value}`;
    getAddress();
  }
  else{
    domElements.loader.style.display="none";
  }
};

// Get Ip address data
const getAddress=() =>{
  fetch(`${addressApi.url}?apiKey=${addressApi.key}&${add}`)
    .then(response => response.json())
      .then(data =>{
        showData(data);
        getMap(data);
      })
      .catch(error=>{
        alert('input is invalid');

      })
};


// Show Data
const showData=(info)=>{ 
  domElements.loader.style.display="none";
  domElements.address.textContent=info.ip;
  domElements.location.textContent=`${info.location.city}, ${info.location.country} ${info.location.postalCode}`;
  domElements.timeZone.textContent=info.location.timezone;
  domElements.provider.textContent=info.isp;
};


// Show Map

let mymap ="";
let myIcon="";

getMap=(info)=>{

  document.getElementById('weathermap').innerHTML = "<div id='mapid'></div>";

  mymap = L.map('mapid').setView([info.location.lat,info.location.lng], 13);
  
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiamFwam90czA3IiwiYSI6ImNrcHF6aGVtdDAwaDYyd2xrcTJhMzViNTcifQ.tS3undaI4g7NAtF8DEqrPA'
  }).addTo(mymap);
  

  myIcon = L.icon({
    iconUrl: "./resources/images/icon-location.svg",
    iconSize: [40, 50],
    iconAnchor: [22,94],
    popupAnchor: [-3, -76],
  });
    
  L.marker([info.location.lat,info.location.lng], {icon: myIcon}).addTo(mymap);

  mymap.panTo([info.location.lat,info.location.lng]);
  // marker.bindPopup(location)

};

findType("domain");

// Event listeners
domElements.searchButton.addEventListener('click',getInput);

