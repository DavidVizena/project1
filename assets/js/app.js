function myMap() {

    console.log('starting');
    var mapProp = {
        center: new google.maps.LatLng(51.508742, -0.120850),
        zoom: 5,
    };
    var mapLocate = document.getElementById("map");
    var map = new google.maps.Map(mapLocate, mapProp);
}

$(document).ready(function () {



    // Closing tag for document.ready
});