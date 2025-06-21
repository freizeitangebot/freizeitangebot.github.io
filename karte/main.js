/*
Skript für die Karte 
*/
// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let map = L.map("map", {
    maxZoom: 19,
}).setView([ibk.lat, ibk.lng], 10);

// thematische Layer
let overlays = {
    tennis: L.featureGroup().addTo(map),
    sport: L.featureGroup().addTo(map),
    swim: L.featureGroup().addTo(map),
    rodel: L.featureGroup().addTo(map),
};

// Layer contol
let layerControl = L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery").addTo(map)
}, {
    "Tennisplätze": overlays.tennis,
    "Sportplätze": overlays.sport,
    "Schwimmplätze": overlays.swim,
    "Rodelbahnen": overlays.rodel,

}).addTo(map);    

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Tennisplätze Tirol
async function loadTennis(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    // console.log(jsondata);
    L.geoJSON(jsondata, {
        // attribution: "Datenquelle: <a href= 'https://data.wien.gv.at'> Tennisplätze Tirol</a>",

        style: function (feature) {
            //console.log(feature.properties);
            let platzColor;

            if (feature.properties.ATTR_BELAG == "Sand") {
                platzColor = "#FF851B";
            } else if (feature.properties.ATTR_BELAG == "Teppich") {
                platzColor = "#0074D9";
            } else if (feature.properties.ATTR_BELAG == "Hartplatz") {
                platzColor = "#AAAAAA";
            } else if (feature.properties.ATTR_BELAG == "Kunstrasen") {
                platzColor = "#2ECC40";
            } else {
                platzColor = "#111111";
            }

            return {
                color: platzColor
            }
        },
        onEachFeature: function (feature, layer) {
            //console.log(feature.properties);
            layer.bindPopup(`
                <h3>${feature.properties.STAETTE_NA}</h3>
                <h5>${feature.properties.ANLAGE_NAM}</h5>
                <hr>
                <h3>Platz Details</h3>
                <h5>Belag: ${feature.properties.ATTR_BELAG}</h5>
                <h5>Gelände: ${feature.properties.ATTR_FREI_}</h5>
                `
            );
        }
    }).addTo(overlays.tennis);
}
loadTennis("./tennis/tennis_1.geojson")

// Sportplätze Tirol
async function loadSport(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    // console.log(jsondata);
    L.geoJSON(jsondata, {
        // attribution: "Datenquelle: <a href= 'https://data.wien.gv.at'> Tennisplätze Tirol</a>",
        onEachFeature: function (feature, layer) {
            //console.log(feature.properties);
            layer.bindPopup(`
                <h3>${feature.properties.STAETTE_NAME}</h3>
                <h5>${feature.properties.ANLAGE_NAME}</h5>
                <hr>
                <h3>Platz Details</h3>
                <h5>Belag: ${feature.properties.ATTR_BELAG}</h5>
                <h5>Gelände: ${feature.properties.ATTR_SPORTPLATZTYP}</h5>
                `
            );
        }
    }).addTo(overlays.sport);
}
loadSport("./sportplaetze/Sportplaetze_5424977732169178233.geojson")

// Schwimmanlagen Tirol
async function loadSwim(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    // console.log(jsondata);
    L.geoJSON(jsondata, {
        // attribution: "Datenquelle: <a href= 'https://data.wien.gv.at'> Tennisplätze Tirol</a>",
        onEachFeature: function (feature, layer) {
            //console.log(feature.properties);
            layer.bindPopup(`
                <h3>${feature.properties.STAETTE_NAME}</h3>
                <h5>${feature.properties.ANLAGE_NAME}</h5>
                <hr>
                <h3>Schwimmbecken Details</h3>
                <h5>Typ: ${feature.properties.ATTR_SCHWIMMBECKENTYP}</h5>
                `
            );
        }
    }).addTo(overlays.swim);
}
loadSwim("./schwimmanlagen/Schwimmanlagen_3256018082439661768.geojson")

// Rodelbahnen Tirol
async function loadRodel(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    // console.log(jsondata);
    L.geoJSON(jsondata, {
        // attribution: "Datenquelle: <a href= 'https://data.wien.gv.at'> Tennisplätze Tirol</a>",
        style: function (feature) {
            //console.log(feature.properties);
            let rodelColor;

            if (feature.properties.ATTR_TYP == "Sommerrodelbahn") {
                rodelColor = "#FF851B";
            } else if (feature.properties.ATTR_TYP == "Naturrodelbahn") {
                rodelColor = "#0074D9";
            } else if (feature.properties.ATTR_TYP == "Trainings- und Wettkampfbahn") {
                rodelColor = "#2ECC40";
            } else {
                rodelColor = "#111111";
            }

            return {
                color: rodelColor
            }
        },
        onEachFeature: function (feature, layer) {
            //console.log(feature.properties.ATTR_TYP);
            layer.bindPopup(`
                <h3>${feature.properties.STAETTE_NAME}</h3>
                <hr>
                <h3>Rodelbahn Details</h4>
                <h5>Typ: ${feature.properties.ATTR_TYP}</h5>
                <h5>Kategorie: ${feature.properties.ATTR_KATEGORIE}</h5>
                <h5>Beleuchtung: ${feature.properties.ATTR_BELEUCHTUNG}</h5>
                `
            );
        }
    }).addTo(overlays.rodel);
}
loadRodel("./rodelbahnen/Rodelbahnen_3907122753758785632.geojson")

/*
async function loadGeoJSON(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    L.geoJSON(geojson).addTo(map);
}
loadGeoJSON("./tennis/tennis_1.geojson");
*/