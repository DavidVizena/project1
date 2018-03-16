// Function to be called by Google Maps on callback, outside document.ready to prevent issues with load
function displayMap() {

    var mapProp = {
        center: new google.maps.LatLng(29.756846, -95.363444),
        zoom: 10,
    };
    var mapLocate = document.getElementById("map");
    var map = new google.maps.Map(mapLocate, mapProp);
}

$(document).ready(function () {

    function newLocation(){

        event.preventDefault();

        if ($('#location').val()){

        var location = $('#location').val().trim()

        $('#location').val('');

        var newDiv = $('<div>').text(location);
        newDiv.appendTo('#addedLocations');

        };
    };

    $('#addLocation').on('click', newLocation);



    // Closing tag for document.ready
});