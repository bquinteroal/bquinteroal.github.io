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
        '<b> Manzana ' + props.id_manzana + '</b> <br />' +
        '<b> Comuna ' + props.comuna + '</b> <br />' +
        '<b> Viviendas ' + props.vivi_ocu + '</b> <br />' +
        '<b> Hogares ' + props.hogares + '</b> <br />' +
        '<b> Personas ' + props.personas + '</b> <br />' + '<br />' +
        '<h4>Salud</h4>' +
        '<b> Proximidad equipamientos de salud: </b> ' + props.dis_salud.toFixed(0) + ' m' + '<br />' + '<br />' +
        '<h4>Educación, cultura y diversidad </h4>' + '<br />' +
        '<b> Proximidad equipamientos educativos: </b> ' + props.dis_educa.toFixed(0) + ' m' + '<br />' +
        '<b> Proximidad equipamientos culturales: </b> ' + props.dis_biblio.toFixed(0) + ' m' + '<br />' +
        '<b> Años promedio educación: </b> ' + props.pro_a_esco.toFixed(0) + ' años' + '<br />' +
        '<b> Diversidad usos del suelo: </b> ' + props.mixticidad.toFixed(2) + '<br />' + '<br />' +

        '<h4>Espacios públicos, seguridad y recreación </h4>' +
        '<b> Proximidad espacio público: </b> ' + props.dis_ep.toFixed(0) + ' m' + '<br />' + '<br />' +

        '<h4>Vivienda </h4>' +
        '<b> Vivienda adecuada: </b> ' + props.viv_ade.toFixed(2) + ' %' + '<br />' +
        '<b> Agua mejorada: </b> ' + props.agua_mejor.toFixed(0) + ' %' + '<br />' +
        '<b> Saneamiento: </b> ' + props.saneamient.toFixed(0) + ' %' + '<br />' +
        '<b> Electricidad: </b> ' + props.electrici.toFixed(0) + ' %' + '<br />' +
        '<b> Internet: </b> ' + props.internet.toFixed(0) + ' %' + '<br />' + '<br />' +

        '<h4>Oportunidades económicas </h4>' +
        '<b> Desempleo: </b> ' + props.t_desempl.toFixed(0) + ' %' + '<br />' +
        '<b> Empleo informal: </b> ' + props.emp_in_e.toFixed(0) + ' %' + '<br />' +
        '<b> Desempleo juvenil: </b> ' + props.desem_juv.toFixed(0) + ' %' : 'Colocar cursor sobre una manzana');
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
        opacity: 0.4,
        color: '#c3bfc2',
        fillOpacity: 0.3,
        fillColor: '#c3bfc2'
    };
}

function changeLegend(props) {
    var _legend = document.getElementById('legend'); // create a div with a class "info"
    _legend.innerHTML = (props ?
        `<p style="font-size: 12px"><strong>${props.title}</strong></p>
            <p style="font-size: 10px">${props.subtitle}</p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>Sin información<br>
                <span style='color:#1a9641'>▉</span>${props.elem1}<br>
                <span style='color:#a6d96a'>▉</span>${props.elem2}<br>
                <span style='color:#f4f466'>▉</span>${props.elem3}<br>
                <span style='color:#fdae61'>▉</span>${props.elem4}<br>
                <span style='color:#d7191c'>▉</span>${props.elem5}
            </p>` :
        `<p style="font-size: 12px"><strong>Proximidad</strong></p>
            <p style="font-size: 10px">Distancia en m</p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>Sin información<br>
                <span style='color:#1a9641'>▉</span>Menor 300<br>
                <span style='color:#a6d96a'>▉</span>301 - 501<br>
                <span style='color:#f4f466'>▉</span>501 - 700<br>
                <span style='color:#fdae61'>▉</span>701 - 1000<br>
                <span style='color:#d7191c'>▉</span>Mayor 100
            </p>`);
}

var legends = {
    dis_salud: {
        title: "Proximidad equipamientos de salud",
        subtitle: "Distancia en m",
        elem1: "Menor 300",
        elem2: "301 - 501",
        elem3: "501 - 701",
        elem4: "701 - 1000",
        elem5: "Mayor 1000",
    },
    dis_educa: {
        title: "Proximidad equipamientos de educación",
        subtitle: "Distancia en m",
        elem1: "Menor 300",
        elem2: "301 - 501",
        elem3: "501 - 701",
        elem4: "701 - 1000",
        elem5: "Mayor 1000",
    },
    dis_biblio: {
        title: "Proximidad espacios públicos",
        subtitle: "Distancia en m",
        elem1: "Menor 300",
        elem2: "301 - 501",
        elem3: "501 - 701",
        elem4: "701 - 1000",
        elem5: "Mayor 1000",
    },
    dis_ep: {
        title: "Proximidad espacios públicos",
        subtitle: "Distancia en m",
        elem1: "Menor 300",
        elem2: "301 - 501",
        elem3: "501 - 701",
        elem4: "701 - 1000",
        elem5: "Mayor 1000",
    },
    viv_ade: {
        title: "Vivienda Adecuada",
        subtitle: "% de Viviendas",
        elem1: "Mayor 86",
        elem2: "66 - 85",
        elem3: "36 - 65",
        elem4: "16 - 35",
        elem5: "Menor 15",
    }
}

var indi = L.geoJson(Manzana, {
    style: legends.dis_salud,
}).addTo(map);

var currentStyle = 'dis_salud';


function setProColor(d) {
    if (currentStyle === 'viv_ade') {
        return d > 85 ? '#1a9641' :
            d > 65 ? '#a6d96a' :
                d > 35 ? '#f4f466' :
                    d > 15 ? '#fdae61' :
                        '#d7191c';
    } else {
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
        opacity: 0.4,
        color: (currentStyle && currentStyle !== 'default') ? 'white' : '#c3bfc2',
        fillOpacity: (currentStyle && currentStyle !== 'default') ? 0.9 : 0.3,
    };
}

function changeIndi(style) {
    currentStyle = style.value;
    indi.setStyle(fillColor);
    changeLegend((style.value && legends[style.value]) ? legends[style.value] :
        {
            title: "Proximidad equipamientos de salud",
            subtitle: "Distancia en m",
            elem1: "Menor 300",
            elem2: "301 - 501",
            elem3: "501 - 701",
            elem4: "701 - 1000",
            elem5: "Mayor 1001",
        });
}


manzanas = L.geoJson(Manzana, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


var baseMaps = {
    'Esri Satellite': esriAerial,
    'Open Street Map': opens

};

// Defines the overlay maps. For now this variable is empty, because we haven't created any overlay layers
var overlayMaps = {
    'Manzanas': manzanas,
    'Comunas': comu,
    'Límite fronterizo con Venezuela': lim
};

// Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {
    collapsed: true,
});
map.addControl(layersControl);
changeIndi({value: 'dis_salud'});


function popupText(feature, layer) {

    layer.bindPopup('<strong>Comuna: </strong>' + feature.properties.comuna + '<br />')
}
    


