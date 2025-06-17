/*
Skrit für die Karte 
*/
// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let map = L.map("map").setView([ibk.lat, ibk.lng], 10);

// thematische Layer
let overlays = {
    tennis: L.featureGroup().addTo(map),

};

// Layer contol
let layerControl = L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery").addTo(map)
}, {
    "Tennisplätze": overlays.tennis,

}).addTo(map);    

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

//Tennisplätze Tirol
async function loadTennis(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
     console.log(jsondata);
    L.geoJSON(jsondata, {
        // attribution: "Datenquelle: <a href= 'https://data.wien.gv.at'> Tennisplätze Tirol</a>",
        onEachFeature: function (feature, layer) {
             console.log(feature.properties);
            layer.bindPopup(`
                <h3>${feature.properties[""]}</h3>
                `
            );
        }
    }).addTo(overlays.tennis);
}
loadTennis("tennis.geojson")