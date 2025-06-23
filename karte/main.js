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
}).setView([ibk.lat, ibk.lng], 12);

// thematische Layer
let overlays = {
    tennis: L.markerClusterGroup({
        disableClusteringAtZoom: 17,
        /* KI_BEGIN */
        iconCreateFunction: function (cluster) {
            let count = cluster.getChildCount();

            return L.divIcon({
                html: `
                    <div style="
                        background-image: url('./tennis/tennis.png');
                        background-size: cover;
                        width: 50px;
                        height: 60px;
                        position: relative;
                        
                        
                    ">
                    <div style="
                        position: absolute;
                        bottom: 11px;
                        left: 7px;
                        color: black;
                        font-weight: bold;
                        font-size: 14px;
                    ">
                        ${count}
                    </div>
                `,
                className: '', 
                iconSize: [50, 50]
            });
        }

    }).addTo(map),
    /* KI_END */
    sport: L.markerClusterGroup({
        disableClusteringAtZoom: 16,
        /* KI_BEGIN */
        iconCreateFunction: function (cluster) {
            let count = cluster.getChildCount();

            return L.divIcon({
                html: `
                    <div style="
                        background-image: url('./sportplaetze/soccerfield.png');
                        background-size: cover;
                        width: 50px;
                        height: 60px;
                        position: relative;
                        
                        
                    ">
                    <div style="
                        position: absolute;
                        bottom: 6px;
                        left: 50%;
                        transform: translateX(-50%);
                        color: black;
                        font-weight: bold;
                        font-size: 14px;
                    ">
                        ${count}
                    </div>
                `,
                className: '', 
                iconSize: [50, 50]
            });
        }

    }).addTo(map),
    /* KI_END */
    swim: L.markerClusterGroup({
        disableClusteringAtZoom: 17, 
        /* KI_BEGIN */
        iconCreateFunction: function (cluster) {
            let count = cluster.getChildCount();

            return L.divIcon({
                html: `
                    <div style="
                        background-image: url('./schwimmanlagen/swimming2.png');
                        background-size: cover;
                        width: 50px;
                        height: 60px;
                        position: relative;
                        
                        
                    ">
                    <div style="
                        position: absolute;
                        bottom: 20px;
                        left: 7px;
                        color: black;
                        font-weight: bold;
                        font-size: 14px;
                        text-shadow:
                            -1px -1px 0 white,
                            1px -1px 0 white,
                            -1px  1px 0 white,
                            1px  1px 0 white;
                    ">
                        ${count}
                    </div>
                `,
                className: '', 
                iconSize: [50, 50]
            });
        }

    }).addTo(map),
     /* KI_END */
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
                platzColor = "#111111";
            } else if (feature.properties.ATTR_BELAG == "Kunstrasen") {
                platzColor = "#2ECC40";
            } else {
                platzColor = "#AAAAAA";
            }

            return {
                color: platzColor
            }
        },
        onEachFeature: function (feature, layer) {
            //console.log(feature.properties);
            let center = layer.getBounds().getCenter();
            let marker = L.marker(center, {
                icon: L.icon({
                    iconUrl: "./tennis/tennis.png",
                    iconAnchor: [16, 37],
                })
            }).addTo(overlays.tennis);

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
        style: function (feature) {
            //console.log(feature.properties);
            let platzColor;

            if (feature.properties.ATTR_SPORTPLATZTYP == "Streetballplatz") {
                platzColor = "#FF851B";
            } else if (feature.properties.ATTR_SPORTPLATZTYP == "Mehrzweckplatz") {
                platzColor = "#111111";
            } else if (feature.properties.ATTR_SPORTPLATZTYP == "Fußballplatz") {
                platzColor = "#2ECC40";
            } else {
                platzColor = "#AAAAAA";
            }

            return {
                color: platzColor
            }
        },
        onEachFeature: function (feature, layer) {
            //console.log(feature.properties.ATTR_SPORTPLATZTYP);
            let center = layer.getBounds().getCenter();
            let marker = L.marker(center, {
                icon: L.icon({
                    iconUrl: "./sportplaetze/soccerfield.png",
                    iconAnchor: [16, 37],
                })
            }).addTo(overlays.sport);

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

             let center = layer.getBounds().getCenter();
            let marker = L.marker(center, {
                icon: L.icon({
                    iconUrl: "./schwimmanlagen/swimming2.png",
                    iconAnchor: [16, 37],
                    maxZoom: 14,
                })
            }).addTo(overlays.swim);

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

//Minimap Plugin LeafletS
var gkTirol = new L.TileLayer("https://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png");
var miniMap = new L.Control.MiniMap(gkTirol, {
    toggleDisplay: true,
    //zoomLevelOffset: -5,
}).addTo(map);

//Leaflet fullscreen Plugin
map.addControl(new L.Control.Fullscreen());

 // Leaflet locationcontrol
        L.control.locate({
            strings: {
                title:"Eigenen Standort anzeigen"
            },
            drawCircle: false
        }).addTo(map);