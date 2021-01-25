

// Create variable to hold map element, give initial settings to map
        var map = L.map('map',{ 
            center: [7.9037, -72.51], 
            zoom: 12.5,
        });
        

        var esriAerialUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services'+
        '/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        var esriAerialAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, '+
        'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the'+
        ' GIS User Community';
        var esriAerial = new L.TileLayer(esriAerialUrl,
        {maxZoom: 18, attribution: esriAerialAttrib}).addTo(map);


        var opens = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
        });

        L.easyButton('<img src="/data/fullscreen.png">', function(btn, map){
            var cucu = [7.9037, -72.51];
            map.setView(cucu,13);
            }).addTo(map);

        var info = L.control();

        info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
        };

// method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML =  (props ?
            '<b> Manzana ' + props.id_manzana + '</b> <br />' +
            '<b> Comuna ' + props.comuna + '</b> <br />'+
            '<b> Viviendas ' + props.vivi_ocu + '</b> <br />' +
            '<b> Hogares ' + props.hogares + '</b> <br />' +
            '<b> Personas ' + props.personas + '</b> <br />' + '<br />'+
            '<h4>Salud</h4>'+
            '<b> Proximidad equipamientos de salud: </b> '+ props.dis_salud + ' m'+ '<br />'+ '<br />'+
            '<h4>Educación, cultura y diversidad </h4>' + '<br />'+ 
            '<b> Proximidad equipamientos educativos: </b> '+ props.dis_educa + ' m'+ '<br />'+
            '<b> Proximidad equipamientos culturales: </b> '+ props.dis_biblio + ' m'+ '<br />'+ 
            '<b> Años promedio educación: </b> '+ props.pro_a_esco + ' años'+ '<br />'+ 
            '<b> Diversidad usos del suelo: </b> '+ props.mixticidad + '<br />'+ '<br />'+ 
            
            '<h4>Espacios públicos, seguridad y recreación </h4>' +  
            '<b> Proximidad espacio público: </b> '+ props.dis_ep + ' m'+ '<br />'+ '<br />'+
            
            '<h4>Vivienda </h4>'  +
            '<b> Vivienda adecuada: </b> '+ props.viv_ade +' %'+  '<br />'+
            '<b> Agua mejorada: </b> '+ props.agua_mejor + ' %'+'<br />'+
            '<b> Saneamiento: </b> '+ props.saneamient + ' %'+'<br />'+
            '<b> Electricidad: </b> '+ props.electrici + ' %'+'<br />'+
            '<b> Internet: </b> '+ props.internet +' %'+ '<br />'+ '<br />'+ 
            
            '<h4>Oportunidades económicas </h4>'+
            '<b> Desempleo: </b> '+ props.t_desempl + ' %'+'<br />'+
            '<b> Empleo informal: </b> '+ props.emp_in_e + ' %'+'<br />'+
            '<b> Desempleo juvenil: </b> '+ props.desem_juv+ ' %'


            : 'Colocar cursor sobre una manzana');
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

    var indi = L.geoJson(Manzana, {
        style: style2,
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
                        fillColor:'#c3bfc2'
            };
            }
    document.getElementById("style").onclick = function (){
                indi.setStyle(style);
    }
  

    
    manzanas = L.geoJson(Manzana, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);


    function setProColor(d) {
        return d > 1000  ? '#d7191c' : 
               d > 700   ? '#fdae61' :
               d > 500   ? '#f4f466' :
               d > 300   ? '#a6d96a' :
                  '#1a9641';
        }

        function style2(feature) {
            return {
            fillColor: setProColor(feature.properties.dis_salud),
            weight: 0.6,
            opacity: 0.4,
            color: 'white',
            fillOpacity: 0.9
           };
        }
        
        document.getElementById("style2").onclick = function (){
        indi.setStyle(style2);
        }
        
        function style3(feature) {
        return {
        fillColor: setProColor(feature.properties.dis_educa),
        weight: 0.6,
        opacity: 0.4,
        color: 'white',
        fillOpacity: 0.9
        };
        }
        
        document.getElementById("style3").onclick = function (){
        indi.setStyle(style3);
        }
        
        function style4(feature) {
        return {
        fillColor: setProColor(feature.properties.dis_biblio),
        weight: 0.6,
        opacity: 0.4,
        color: 'white',
        fillOpacity: 0.9
        };
        }
        
        document.getElementById("style4").onclick = function (){
        indi.setStyle(style4);
        }
        
        function style5(feature) {
        return {
        fillColor: setProColor(feature.properties.dis_ep),
        weight: 0.6,
        opacity: 0.4,
        color: 'white',
        fillOpacity: 0.9
        };
        }
        
        document.getElementById("style5").onclick = function (){
        indi.setStyle(style5);
        }

        function setvivColor(d) {
            return d > 85  ?  '#1a9641' : 
                   d > 65   ? '#a6d96a' :
                   d > 35   ? '#f4f466' :
                   d > 15   ? '#fdae61':
                   '#d7191c' ;
            }
    
            function style6(feature) {
                return {
                fillColor: setvivColor(feature.properties.viv_ade),
                weight: 0.6,
                opacity: 0.4,
                color: 'white',
                fillOpacity: 0.9
               };
            }
            
            document.getElementById("style6").onclick = function (){
            indi.setStyle(style6);
            }


var baseMaps = {
        'Esri Satellite': esriAerial,
        'Open Street Map': opens
        
};

    // Defines the overlay maps. For now this variable is empty, because we haven't created any overlay layers  
var overlayMaps = {
        'Manzanas': manzanas,
        'Comunas': comu,
        'Límite fronterizo con Venezuela': lim, 
};

    // Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {
    collapsed: true,    
    });
    map.addControl(layersControl);


    function popupText(feature, layer) {

        layer.bindPopup('<strong>Comuna: </strong>' + feature.properties.comuna + '<br />')
    }
    


   