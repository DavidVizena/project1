
$(document).ready(function () {
    var locations = [];
    var center;
    var map;
    var userStatus = false;
    var panelStatus = false;

    statusChecker();

    // SLIDEOUT MENU
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
    // 

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCmsUyEaY8znd7KUyIoiyVkl2SHNPa-Bnw",
        authDomain: "huddle-meet-up.firebaseapp.com",
        databaseURL: "https://huddle-meet-up.firebaseio.com",
        projectId: "huddle-meet-up",
        storageBucket: "huddle-meet-up.appspot.com",
        messagingSenderId: "876221643870"
    };
    firebase.initializeApp(config);
    db = firebase.database();

    statusChecker();
    function statusChecker(activator1, activator2) {
        userStatus = activator1;
        panelStatus = activator2;
        if (userStatus) {
            var logoutBtn = $("#logoutBtn").show();
            $("#userP").hide();
            $("#formEmail").hide();
            $("#formPassword").hide();
            $("#formConfirmPassword").hide();
            $("#formUsername").hide();
            $("#signUpBtn").hide();
            $("#loginBtn").hide();
            $("#signInBtn").hide();
        } else if (!userStatus) {
            $("#userCard").text("Sign Up Today");
            $("#logoutBtn").hide();
            $("#userP").show();
            $("#formEmail").show();
            $("#formPassword").show();
            $("#formConfirmPassword").show();
            $("#formUsername").show();
            $("#signUpBtn").show();
            $("#loginBtn").hide();
            $("#signInBtn").show();

        }

        if (panelStatus) {
            $("#userCard").text("Login");
            $("#formUsername").hide();
            $("#userP").hide();
            $("#signUpBtn").hide();
            $("#signInBtn").hide();
            $("#formConfirmPassword").hide();
            $("#loginBtn").show();
        }
    }

    // all buttons used for signIn, logout, and login functionality
    $("#signInBtn").on("click", function (e) {
        e.preventDefault();
        statusChecker(false, true);
    });

    $("#signUpBtn").on("click", function (e) {
        e.preventDefault();
        signUp();
    });

    $("#loginBtn").on("click", function (e) {
        e.preventDefault();
        login();
    });

    $("#logoutBtn").on("click", function (e) {
        e.preventDefault();
        logout();
    });

    // checks the current users state and if anything is changed do something
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var user = firebase.auth().currentUser;
            console.log(user);
            console.log("logged in as: " + user.email);
            statusChecker(true), false;
            var email_id = user.email;
            var editGreeting = $("#userCard").text("Welcome User : " + user.email);
        } else {
            // No user is signed in.
            console.log("No user detected, Please sign in.");
            statusChecker(false, false);
        }
    });

    // sign up function
    function signUp() {

        // grabs data from input fields
        var userEmail = $("#formEmail").val().trim();
        var userPass = $("#formPassword").val().trim();
        var confirmPass = $("#formConfirmPassword").val().trim();
        userName = $("#formUsername").val().trim();
        console.log(userEmail);

        if (userPass !== confirmPass) {
            alert("Sorry! your passwords do not match, please fix them to continue")
        } else {
            firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
                .then(function () {
                    signInAuth()
                }).catch(function (error) {
                    //TODO: had to put user display name assigning here due to asynchronous issues will tidy up later
                    firebase.auth().currentUser.updateProfile({
                        displayName: userName,
                    }).then(function () {
                        //   console.log(user.userName);
                    });
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("CreateUserError : " + errorMessage);
                    // signInAuth();
                });
        }
    }

    function signInAuth() {
        firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("SignInError : " + errorMessage);
            console.log("cool");
        });
    }

    // login function
    function login() {
        // grabs data from input fields
        var userEmail = $("#formEmail").val().trim();
        var userPass = $("#formPassword").val().trim();
        console.log(userEmail);
        firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("SignInError : " + errorMessage);
        });
    }

    // logout function
    function logout() {
        firebase.auth().signOut();
        statusChecker(true, false);
    }


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

            findPlaces();

        };

    };

    function findPlaces () {

        $.ajax({
            method: 'GET',
            url: 'https://developers.zomato.com/api/v2.1/geocode?lat=30&lon=-95',
            headers: {'user-key' : '9b0f7f04f6701a9e6b5c0b40c2a61b80'},
        }).then(function(res){
            console.log(res);
        })

       /*  var parameters = {
            location: centerPoint,
            radius: 1000,
            type: ['restaurant']
        }

        placesSearch = new google.maps.places.PlacesService(map);
        placesSearch.nearbySearch(parameters, function(res){
            console.log(res);

            for (var i=0; i <= 4; i++){
                var newMarker = new google.maps.Marker({ position: res[i].geometry.location });
                newMarker.setMap(map);
            };
        }); */

    };






    function makeMap() {

        $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw&libraries=places', function () {
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