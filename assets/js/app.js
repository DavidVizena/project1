var map;

// Function to be called by Google Maps on callback, outside document.ready to prevent issues with load
function displayMap() {

    var mapProp = {
        center: new google.maps.LatLng(29.756846, -95.363444),
        zoom: 10,
    };
    var mapLocate = document.getElementById("map");
    map = new google.maps.Map(mapLocate, mapProp);
}

$(document).ready(function () {

    function newLocation() {

        event.preventDefault();

        // Verify that something has been entered
        if ($('#location').val()) {

            // Create a new div containing the location entered and append that to the addedLocations div on page, then clear form
            var location = $('#location').val().trim()
            var newDiv = $('<div>').text(location);
            newDiv.appendTo('#addedLocations');

            $('#location').val('');

            var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw';

            console.log(queryURL);

            $.ajax({
                url: queryURL,
                method: 'Get'


            }).then(function (res) {
            
                var latLong = res.results[0].geometry.location;
                var locationLat = latLong.lat;
                var locationLong = latLong.lng;

                var locationCordinates = {lat: locationLat, lng: locationLong};

                var newMarker = new google.maps.Marker({position: locationCordinates});

                newMarker.setMap(map);

            });

        };

    };

        $('#addLocation').on('click', newLocation);



        // Closing tag for document.ready
    });