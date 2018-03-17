$(document).ready(function () {

    var locations = [];
    var center;
    var map;

    function newLocation() {

        event.preventDefault();

        // Verify that something has been entered
        if ($('#location').val()) {

            // Create a new div containing the location entered and append that to the addedLocations div on page, then clear form
            var location = $('#location').val().trim()
            var newDiv = $('<div>').text(location);
            newDiv.appendTo('#addedLocations');
            $('#location').val('');

            // Set url to be used for AJAX request by inserting searched for address in, AJAX is used to return GPS coordinates of searched location
            var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw';

            $.ajax({
                url: queryURL,
                method: 'Get'


            }).then(function (res) {

                // Once the AJAX has run, pull out the latitude and longitude of searched address and use to dispaly marker on map
                var latLong = res.results[0].geometry.location;
                var locationLat = latLong.lat;
                var locationLong = latLong.lng;

                var locationCordinates = { lat: locationLat, lng: locationLong };

                var newMarker = new google.maps.Marker({ position: locationCordinates });

                newMarker.setMap(map);

                locations.push(locationCordinates);

                console.log(locations);

            });

        };

    };


    var centerPoint;


    function findCenter() {

        event.preventDefault();

        if (locations[1]) {

            var bounds = new google.maps.LatLngBounds;
            $.each(locations, function (i) {
                console.log('getting location');

                bounds.extend(locations[i]);

                map.fitBounds(bounds);

                centerPoint = JSON.parse(JSON.stringify(bounds.getCenter()));
                console.log(centerPoint);
            });


            var queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=AIzaSyC8gvqoFEacptQQDQaI7wBLTEnqIXq97-g"
            $.ajax({
                // type: "POST",
                // dataType: 'jsonp',
                url: queryURL,
                method: 'Get'

            }).then(function (res) {
                console.log(res);
                console.log("got it")
            });

        };


        // var service = new google.maps.places.PlacesService(centerPoint);
        // console.log(services);

    };

    function makeMap() {

        $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw', function () {

            console.log('success');
            var mapProp = {
                center: new google.maps.LatLng(29.756846, -95.363444),
                zoom: 10,
            };
            var mapLocate = document.getElementById("map");
            map = new google.maps.Map(mapLocate, mapProp);

        })

    }

    $('#addLocation').on('click', newLocation);

    $('#submitLocations').on('click', findCenter);

    makeMap();



    // Closing tag for document.ready
});