

var map = L.map('map').setView([47.25, -122.44], 11);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1Ijoic3VmZmlhbmc5NiIsImEiOiJjazJqbzVveXoxMHB1M25waDNmajltdjBzIn0.Rvaq-B6WyZ-s64wKMEdL2Q',
}).addTo(map);

//I made these myself :)
var startIcon = L.icon({
	iconUrl: 'marker-start.svg',
  iconSize: [36, 93],
});

var destinationIcon = L.icon({
	iconUrl: 'marker-dest.svg',
  iconSize: [36, 93],
});
// start and dest create marker implementation is from https://gis.stackexchange.com/questions/236934/leaflet-routing-control-change-marker-icon/237267
var controlIcon = L.icon({
  iconUrl: 'marker-15.svg',
});

var control = L.Routing.control({
     waypoints: [

            // L.latLng(47.246587, -122.438830),
            // L.latLng(47.258024, -122.444725),
            // L.latLng(47.318017, -122.542970)
        ],
       createMarker: function (i, start, n){
       var marker_icon = null
       if (i == 0) {
           // This is the first marker, indicating start
           marker_icon = startIcon
       } else if (i == n -1) {
           //This is the last marker indicating destination
           marker_icon =destinationIcon
       }
       var marker = L.marker (start.latLng, {
                   draggable: true,
                   bounceOnAdd: false,
                   bounceOnAddOptions: {
                       duration: 1000,
                       height: 800,
                       function(){
                           (bindPopup(myPopup).openOn(map))
                       }
                   },
                   icon: marker_icon
       })
       return marker

     },
     lineOptions: {
        styles: [{color: 'blue', opacity: 0.5, weight: 4.5, }]
     },
     routeWhileDragging: true,
     router: L.Routing.mapbox('pk.eyJ1Ijoic3VmZmlhbmc5NiIsImEiOiJjazJqbzVveXoxMHB1M25waDNmajltdjBzIn0.Rvaq-B6WyZ-s64wKMEdL2Q'),
     units:'imperial',
     collapsible: true,
     show: false,
     geocoder: L.Control.Geocoder.mapbox('pk.eyJ1Ijoic3VmZmlhbmc5NiIsImEiOiJjazJqbzVveXoxMHB1M25waDNmajltdjBzIn0.Rvaq-B6WyZ-s64wKMEdL2Q'),

}).addTo(map)

function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

map.on('click', function(e) {
    var container = L.DomUtil.create('div'),
        startBtn = createButton('Start from this location', container),
        destBtn = createButton('Go to this location', container);

        L.DomEvent.on(startBtn, 'click', function() {
            control.spliceWaypoints(0, 1, e.latlng);
            map.closePopup();
        });

        L.DomEvent.on(destBtn, 'click', function() {
                control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
                control.show();
                map.closePopup();
        });

      L.popup()
          .setContent(container)
          .setLatLng(e.latlng)
          .openOn(map);
});

//icon is from MakiMarkers icon library
L.easyButton('<img src="marker-15.svg">',

function(btn, map){
      map.locate({setView: true,
                  maxZoom: 16,
                });

  }).addTo(map);
// shout out to https://stackoverflow.com/questions/33767463/overlaying-a-text-box-on-a-leaflet-js-map for the guidance
L.Control.textbox = L.Control.extend({
  		onAdd: function(map) {

  		var text = L.DomUtil.create('div');
  		text.id = "info_text";
  		text.innerHTML = "<strong>Begin finding your way by clicking anywhere on the map or search for a location by clicking the icon in the upper right hand corner of the screen.  Pinpoint your current location by clicking the upside-down teardrop below the zoom buttons on the left side of your screen. FYI: This site only requests your location in order to serve your needs. Your location data will not be shared or stored for any purposes.</strong>"
  		return text;
  		},

  		onRemove: function(map) {

  		}
  	});
L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
L.control.textbox ({
  position: 'bottomleft' ,

}).addTo(map);
