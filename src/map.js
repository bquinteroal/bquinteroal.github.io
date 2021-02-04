// Create variable to hold map element, give initial settings to map
var map = L.map('map', {
    center: [7.9037, -72.51],
    zoom: 12.5,
});


var esriAerialUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services' +
    '/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var esriAerialAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, ' +
    'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the' +
    ' GIS User Community';
var esriAerial = new L.TileLayer(esriAerialUrl,
    {maxZoom: 18, attribution: esriAerialAttrib}).addTo(map);


var opens = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

L.easyButton('<img src="/data/fullscreen.png">', function (btn, map) {
    var cucu = [7.9037, -72.51];
    map.setView(cucu, 13);
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = (props ?
        '<b> Manzana ' + props.COD_DANE_A + '</b> <br />' +
        '<b> Comuna ' + props.COMUNA + '</b> <br />' +
        '<b> Viviendas ' + props.VIVI_OCU + '</b> <br />' +
        '<b> Hogares ' + props.HOGARES + '</b> <br />' +
        '<b> Personas ' + props.PERSONAS + '</b> <br />' + '<br />' +
        '<h4>Salud</h4>' +
        '<b> Proximidad equipamientos de salud: </b> ' + props.DIS_SALUD.toFixed(0) + ' m' + '<br />' + '<br />' +
        '<h4>Educación, cultura y diversidad </h4>' + '<br />' +
        '<b> Proximidad equipamientos educativos: </b> ' + props.DIS_EDUCA.toFixed(0) + ' m' + '<br />' +
        '<b> Proximidad equipamientos culturales: </b> ' + props.DIS_BIBLIO.toFixed(0) + ' m' + '<br />' +
        '<b> Años promedio educación: </b> ' + props.PRO_A_ESCO.toFixed(0) + ' años' + '<br />' +
        '<b> Diversidad usos del suelo: </b> ' + props.MIXTICIDAD.toFixed(2) + '<br />' + '<br />' +

        '<h4>Espacios públicos, seguridad y recreación </h4>' +
        '<b> Proximidad espacio público: </b> ' + props.DIS_EP.toFixed(0) + ' m' + '<br />' + '<br />' +

        '<h4>Vivienda </h4>' +
        '<b> Vivienda adecuada: </b> ' + props.VIV_ADE.toFixed(0) + ' %' + '<br />' +
        '<b> Agua mejorada: </b> ' + props.AGUA_MEJOR.toFixed(0) + ' %' + '<br />' +
        '<b> Saneamiento: </b> ' + props.SANEAMIENT.toFixed(0) + ' %' + '<br />' +
        '<b> Electricidad: </b> ' + props.ELECTRICI.toFixed(0) + ' %' + '<br />' +
        '<b> Internet: </b> ' + props.INTERNET.toFixed(0) + ' %' + '<br />' + '<br />' +

        '<h4>Oportunidades económicas </h4>' +
        '<b> Desempleo: </b> ' + props.T_DESEMPL.toFixed(0) + ' %' + '<br />' +
        '<b> Empleo informal: </b> ' + props.EMP_IN_E.toFixed(0) + ' %' + '<br />' +
        '<b> Desempleo juvenil: </b> ' + props.DESEM_JUV.toFixed(0) + ' %' : 'Colocar cursor sobre una manzana');
};
info.addTo(map);

function stylel(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'red',
        fillOpacity: 0,
        clickable: false,

    };
}

var lim = L.geoJson(limiteven, {
    style: stylel,
}).addTo(map);

function stylec(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'yellow',
        fillOpacity: 0,
        dashArray: '3',

    };
}

var comu = L.geoJson(comunas, {
    style: stylec,
    onEachFeature: popupText,
}).addTo(map);


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'black',
        dashArray: '',
        fillColor: false
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var manzanas;

function resetHighlight(e) {
    manzanas.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function style(feature) {
    return {
        weight: 0.6,
        opacity: 0.5,
        color: 'white',
        fillOpacity: 0,
        fillColor:0
    };
}


function changeLegend(props) {
    var _legend = document.getElementById('legend'); // create a div with a class "info"
    _legend.innerHTML = (props ?
        `<p style="font-size: 11px"><strong>${props.title}</strong></p>
            <p style="font-size: 10px">${props.subtitle}</p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>${props.elem6}<br>
                <span style='color:#1a9641'>▉</span>${props.elem1}<br>
                <span style='color:#a6d96a'>▉</span>${props.elem2}<br>
                <span style='color:#f4f466'>▉</span>${props.elem3}<br>
                <span style='color:#fdae61'>▉</span>${props.elem4}<br>
                <span style='color:#d7191c'>▉</span>${props.elem5}
            </p>` :
        `<p style="font-size: 12px"><strong>Área urbana</strong></p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>Manzanas<br>
            </p>`);
}

var legends = {
    DIS_SALUD: {
        title: "Proximidad equipamientos de salud",
        subtitle: "Distancia en m",
        elem1: "Menor 300",
        elem2: "301 - 501",
        elem3: "501 - 701",
        elem4: "701 - 1000",
        elem5: "Mayor 1001",
        elem6: "Sin información",
    },
    DIS_EDUCA: {
        title: "Proximidad equipamientos de educación",
        subtitle: "Distancia en m",
        elem1: "Menor 300",
        elem2: "301 - 501",
        elem3: "501 - 701",
        elem4: "701 - 1000",
        elem5: "Mayor 1001",
        elem6: "Sin información",
    },
    DIS_BIBLIO: {
        title: "Proximidad equipamientos culturales",
        subtitle: "Distancia en m",
        elem1: "Menor 300",
        elem2: "301 - 501",
        elem3: "501 - 701",
        elem4: "701 - 1000",
        elem5: "Mayor 1001",
        elem6: "Sin información",
    },
    PRO_A_ESCO: {
        title: "Años promedio educación",
        subtitle: "años",
        elem1: "Mayor 16",
        elem2: "14 - 15",
        elem3: "12 - 13",
        elem4: "9 - 11",
        elem5: "3 - 8",
        elem6: "Sin información"
    },
    MIXTICIDAD: {
        title: "Diversidad usos del suelo",
        subtitle: "Índice de Shanon",
        elem1: "1.06 - 1.67",
        elem2: "0.79 - 1.05",
        elem3: "0.54 - 0.78",
        elem4: "0.30 - 0.53",
        elem5: "0.01 - 0.29",
        elem6: "Sin información"
    },
    DIS_EP: {
        title: "Proximidad espacios públicos",
        subtitle: "Distancia en m",
        elem1: "Menor 300",
        elem2: "301 - 501",
        elem3: "501 - 701",
        elem4: "701 - 1000",
        elem5: "Mayor 1001",
        elem6: "Sin información",
    },
    VIV_ADE: {
        title: "Vivienda Adecuada",
        subtitle: "% de Viviendas",
        elem1: "Mayor 86",
        elem2: "66 - 85",
        elem3: "36 - 65",
        elem4: "16 - 35",
        elem5: "Menor 15",
        elem6: "Sin información",
    },
    AGUA_MEJOR: {
        title: "Acceso a agua mejorada",
        subtitle: "% de Viviendas",
        elem1: "Mayor 81",
        elem2: "61 - 80",
        elem3: "41 - 60",
        elem4: "21 - 40",
        elem5: "Menor 20",
        elem6: "Sin información",
    },
    SANEAMIENT: {
        title: "Acceso a saneamiento",
        subtitle: "% de Viviendas",
        elem1: "Mayor 81",
        elem2: "61 - 80",
        elem3: "41 - 60",
        elem4: "21 - 40",
        elem5: "Menor 20",
        elem6: "Sin información"
    },  
}


var indi = L.geoJson(Manzana, {
    style: legends.DIS_SALUD,
}).addTo(map);

var currentStyle = 'DIS_SALUD';

manzanas = L.geoJson(Manzana, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


function setProColor(d) {
    if (currentStyle === 'VIV_ADE') {
        return d > 85 ? '#1a9641' :
            d > 65 ? '#a6d96a' :
                d > 35 ? '#f4f466' :
                    d > 15 ? '#fdae61' :
                        '#d7191c';
    }else if (currentStyle === 'AGUA_MEJOR') {
        return d > 80 ? '#1a9641' :
            d > 60 ? '#a6d96a' :
                d > 40 ? '#f4f466' :
                    d > 20 ? '#fdae61' :
                        '#d7191c';
    } 
    else if (currentStyle === 'SANEAMIENT') {
        return d > 80 ? '#1a9641' :
            d > 60 ? '#a6d96a' :
                d > 40 ? '#f4f466' :
                    d > 20 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'PRO_A_ESCO') {
        return d > 15 ? '#1a9641' :
            d > 13 ? '#a6d96a' :
                d > 11 ? '#f4f466' :
                    d > 8 ? '#fdae61' :
                        '#d7191c';
    }
    else if (currentStyle === 'MIXTICIDAD') {
        return d > 1.05 ? '#1a9641' :
            d > 0.78 ? '#a6d96a' :
                d > 0.53 ? '#f4f466' :
                    d > 0.29 ? '#fdae61' :
                        '#d7191c';
    }
    else {
        return d > 1000 ? '#d7191c' :
            d > 700 ? '#fdae61' :
                d > 500 ? '#f4f466' :
                    d > 300 ? '#a6d96a' :
                        '#1a9641';
    }

}

function fillColor(feature) {
    return {
        fillColor: (currentStyle && currentStyle !== 'default' && feature.properties[currentStyle]) ? setProColor(feature.properties[currentStyle]) : '#c3bfc2',
        weight: 0.6,
        opacity: 0.1,
        color: (currentStyle && currentStyle !== 'default') ? 'white' : '#c3bfc2', 
        fillOpacity: (currentStyle && currentStyle !== 'default') ? 0.9 : 0.5,
    };
}

function changeIndi(style) {
    currentStyle = style.value;
    indi.setStyle(fillColor);
    changeLegend((style.value && legends[style.value]) ? legends[style.value] :
        {
            title: "Área urbana",
            subtitle: "Cúcuta y Villa del Rosario",
            elem1: "No aplica",
            elem2: "No aplica",
            elem3: "No aplica",
            elem4: "No aplica",
            elem5: "No aplica",
            elem6: "Manzanas",
            
        });
}



var baseMaps = {
    'Esri Satellite': esriAerial,
    'Open Street Map': opens

};

// Defines the overlay maps. For now this variable is empty, because we haven't created any overlay layers
var overlayMaps = {
    'Comunas': comu,
    'Límite fronterizo con Venezuela': lim
};

// Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {
    collapsed: true,
});
map.addControl(layersControl);
changeIndi({value: 'DIS_SALUD'});


function popupText(feature, layer) {
    layer.bindPopup('<strong>Comuna: </strong>' + feature.properties.comuna + '<br />')
}
    


