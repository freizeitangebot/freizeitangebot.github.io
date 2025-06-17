/*
Skrit für die Karte 
*/

// Karte initialisieren
let map = L.map("map");

// thematische Layer
let overlays = {
    tennis: L.featureGroup(),

};

// Layer contol
let layerControl = L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik").addTo(map),
}, {
    "Tennisplätze": overlays.tennis,

}).addTo(map);    