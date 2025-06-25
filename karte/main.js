/*
Skript für die Karte 
*/
// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Grenze Tirol
let boundsTirol = L.latLngBounds(
    [46.5, 9.8],
    [47.8, 13.4],
);

// Karte initialisieren
let map = L.map("map", {
    maxZoom: 19,
    minZoom: 8,
    maxBounds: boundsTirol,
}).setView([ibk.lat, ibk.lng], 12);

/*
// async funktion Tirol Grenze, weil es ein polygon ist hier oben damit es die anderen nicht überdeckt
async function loadTirol(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    // console.log(jsondata);
    L.geoJSON(jsondata, {
        style: function (feature) {
            return {
                color: "#AAAAAA",
                weight: 3,
                fillOpacity: 0,
                dashArray: "5.5",
            };
        }
    }).addTo(map);
}
loadTirol("tirol_1.geojson")
*/
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
                        bottom: 5px;
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
    rad: L.featureGroup().addTo(map),
};

// Layer control
let layerControl = L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery").addTo(map)
}, {
    "Tennisplätze": overlays.tennis,
    "Sportplätze": overlays.sport,
    "Schwimmplätze": overlays.swim,
    "Rodelbahnen": overlays.rodel,
    "Radtouren": overlays.rad,
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Tennisplätze Tirol
async function loadTennis(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    // console.log(jsondata);
    L.geoJSON(jsondata, {

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
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    // console.log(jsondata);
    L.geoJSON(jsondata, {
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
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    // console.log(jsondata);
    L.geoJSON(jsondata, {
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
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    // console.log(jsondata);
    L.geoJSON(jsondata, {
        style: function (feature) {
            //console.log(feature.properties);
            let rodelColor;

            if (feature.properties.ATTR_TYP == "Sommerrodelbahn") {
                rodelColor = "#FF851B";
                dash = "5";
                weight = 3;
            } else if (feature.properties.ATTR_TYP == "Naturrodelbahn") {
                rodelColor = "#87CEFF";
                dash = "5";
                weight = 3;
            } else if (feature.properties.ATTR_TYP == "Trainings- und Wettkampfbahn") {
                rodelColor = "#2ECC40";
                dash = "4";
                weight = 3;
            } else {
                rodelColor = "#111111";
                dash = "1,2";
                weight = 2;
            }

            return {
                color: rodelColor,
                dashArray: dash,
                weight: weight,
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


// Radtouren 
async function loadRad(url) {
    //console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    // console.log(jsondata);
    L.geoJSON(jsondata, {
        style: function (feature) {
            //console.log(feature.properties);
            let radColor;

            if (feature.properties.ROUTEN_SCH == "leicht") {
                radColor = "#0074D9";
                weight = 4;
            } else if (feature.properties.ROUTEN_SCH == "mittelschwierig") {
                radColor = "#FF4000";
                weight = 3.5;
            } else if (feature.properties.ROUTEN_SCH == "schwierig") {
                radColor = "#111111";
                weight = 3;
            } else {
                radColor = "#AAAAAA";
                weight = 3;
            }

            return {
                color: radColor,
                weight: weight,
            }
        },
        onEachFeature: function (feature, layer) {
            //console.log(feature.properties.ROUTEN_SCH);
            layer.bindPopup(`
                <h3>${feature.properties.ROUTEN_TYP}</h3>
                <h4>${feature.properties.ROUTENNAME}</h4>
                <hr>
                <h3>Routen Details</h4>
                <h5>Länge: ${feature.properties.LAENGE_KM} km</h5>
                <h5>Start: ${feature.properties.ROUTENSTAR}</h5>
                <h5>Ziel: ${feature.properties.ROUTENZIEL}</h5>
                <h5>Schwierigkeit: ${feature.properties.ROUTEN_SCH}</h5>
                <h5>Höhenmeter auf: ${feature.properties.HM_BERGAUF} m</h5>
                <h5>Höhenmeter ab: ${feature.properties.HM_BERGAB} m</h5>

                
                `
            );
        }
    }).addTo(overlays.rad);
}
loadRad("./radtouren/radtouren.geojson")

//Minimap Plugin Leaflet
var gkTirol = new L.TileLayer("https://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png");
var miniMap = new L.Control.MiniMap(gkTirol, {
    toggleDisplay: true,
}).addTo(map);

//Leaflet fullscreen Plugin
map.addControl(new L.Control.Fullscreen());

// Leaflet locationcontrol
L.control.locate({
    strings: {
        title: "Eigenen Standort anzeigen"
    },
    drawCircle: false
}).addTo(map);

// Geo search
const searchControl = new GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(),
    style: "bar",
    searchLable: "Adresse suchen",
});
map.addControl(searchControl);

//Resetview
L.control.resetView({
    position: "topleft",
    title: "Reset view",
    latlng: map.getCenter(),
    zoom: map.getZoom(),
}).addTo(map);