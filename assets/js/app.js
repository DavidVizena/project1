function myMap() {

    console.log('starting');
    var mapProp = {
        center: new google.maps.LatLng(29.756846, -95.363444),
        zoom: 10,
    };
    var mapLocate = document.getElementById("map");
    var map = new google.maps.Map(mapLocate, mapProp);
}

$(document).ready(function () {



    // Closing tag for document.ready
});