$(document).ready(function () {
    var locations = [];
    var center;
    var map;
    var userStatus = false;
    var panelStatus = false;
    var uid;
    var user;
    var passFix = false;

    statusChecker();

    // SCROLLING ANIMATIONS (FRONT END)
    window.sr = ScrollReveal();
    sr.reveal('.navbar', {
        duration: 2000,
        origin: 'bottom'
    });
    sr.reveal('#homeLeft', {
        duration: 2000,
        origin: 'left',
        distance: '300px'
    });
    sr.reveal('#homeRight', {
        duration: 2000,
        origin: 'right',
        distance: '300px'
    });
    sr.reveal('#exploreHeadSection', {
        duration: 2000,
        origin: 'bottom',
        distance: '300px'
    });
    sr.reveal('#locCol', {
        duration: 1000,
        origin: 'right',
        distance: '300px'
    });
    sr.reveal('#createHeadSection', {
        move: 0
    });
    sr.reveal('#createLeft', {
        duration: 1000,
        origin: 'left',
        distance: '300px'
    });
    sr.reveal('#createRight', {
        duration: 1000,
        origin: 'right',
        distance: '300px'
    });
    sr.reveal('#shareHeadSection', {
        move: 0
    });
    sr.reveal('#shareLeft', {
        duration: 1000,
        origin: 'left',
        distance: '300px'
    });
    sr.reveal('#shareRight', {
        duration: 1000,
        origin: 'right',
        distance: '300px'
    });
    sr.reveal('#mainFooter', {
        move: 0
    });
    // 

    // SLOW SCROOL CODE
    // $('a[href*="#"]:not([href="#"])').click(function () {
    //     if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
    //         var target = $(this.hash);
    //         target = target.length ? target : $(' [name' + this.hash.slice(1) + ']');
    //         if (target.length) {
    //             $('html, body').animate({
    //                 scrollTop: target.offset().top
    //             }, 1000);
    //             return false;
    //         }
    //     }
    // })
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

    //calls function to check if a user is logged in or not
    statusChecker();

    //checks if user is logged in or not and displays or removes correct input fields and data
    function statusChecker(activator1, activator2) {
        userStatus = activator1;
        panelStatus = activator2;
        if (userStatus) {
            $("#homeSection").css("display", "none")
            $("#logoutBtn").show();
            $("#meNav", ).show();
        } else if (!userStatus) {
            $("#userCard").text("Sign Up Today");
            $(".show").show();
            $(".hide").hide();
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
        passFix = true;
        console.log(passFix)
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

    function test() {
        $("#loginBtn").on("click", function (e) {
            e.preventDefault();
            login();
        });
    }




    $("#formPassword").on("click", function () {
        // login();
    });

    // checks the current users state and if anything is changed do something
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var user = firebase.auth().currentUser;
            console.log("logged in as: " + user.email);
            statusChecker(true, false);
            var email_id = user.email;
            var editGreeting = $("#userCard").text("Welcome User : " + user.email);
            var testId = user.uid;
            uidFirebase();

            function uidFirebase() {
                db.ref("user").child(testId).once('value', function (snapshot) {
                    if (snapshot.exists()) {
                        console.log(user.email + " exist in Database");
                        submitData();
                    } else {
                        console.log("Created " + user.displayName + "'s Firebase data");
                        db.ref("user").child(testId).set({
                            userName: user.displayName,
                            email: user.email,
                            userId: user.uid
                        });
                    }
                });
            }
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
        var userName = $("#formUsername").val().trim();
        console.log(userEmail);

        //makes sure password and pass word confirm match
        if (userPass !== confirmPass && passFix === false) {
            alert("Sorry! your passwords do not match, please fix them to continue")
        } else {
            //once passwords do match it then creates the user in the auth section of firebase
            firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).then(function () {
                //then signs them in with the same credentials
                firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function () {
                    firebase.auth().currentUser.updateProfile({
                        displayName: userName,
                    })
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("SignInError : " + errorMessage);
                });
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("CreateUserError : " + errorMessage);
                // signInAuth();
            });
        }
    }

    // function processKey(e)
    // {
    //     if (null == e)
    //         e = window.event ;
    //     if (e.keyCode == 13)  {
    //         document.getElementById("loginBtn").click();
    //         return false;
    //     }
    // }

    // login function

    function login() {
        passFix = true
        if (passFix === true) {
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
    }
    // function login() {
    //     passFix = true
    //     if (passFix === true) {
    //         // grabs data from input fields
    //         var userEmail = $("#formEmail").val().trim();
    //         var userPass = $("#formPassword").val().trim();
    //         console.log(userEmail);
    //         firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
    //             // Handle Errors here.
    //             var errorCode = error.code;
    //             var errorMessage = error.message;
    //             console.log("SignInError : " + errorMessage);
    //         });
    //     }
    // }
    // logout function
    function logout() {
        firebase.auth().signOut();
        statusChecker(true, false);
    }



    //pushes data to firebase
    function submitData() {
        var ref = db.ref("user");
        ref.on("value", getData);
    }

    function getData(data) {
        $(".clearStuff").remove();
        var userGroups = data.val();
        //stores each branch in the "newTrain" node to an array
        var keys = Object.keys(userGroups);
        //iterates through each branch in the "newTrain" node using keys
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
        };
    }



    $("#createGroup").on("click", function () {
        var user = firebase.auth().currentUser;
        var idRef = db.ref("user").child(user.uid);
        var dataRef = idRef.child("gdata");
        var gName = $("#groupName").val().trim()
        var gMembers = $("#groupMembers").val().trim().split(",")
        idRef.push({
            gName
        });
        console.log(user.uid);

    });

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

                var locationCordinates = {
                    lat: locationLat,
                    lng: locationLong
                };

                var newMarker = new google.maps.Marker({
                    animation: google.maps.Animation.DROP,
                    position: locationCordinates
                });

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

    function findPlaces() {

        console.log(centerPoint.lat, centerPoint.lng);

        $.ajax({
            method: 'Get',
            url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search",
            headers: {
                "authorization": "Bearer kRyV3p6ITp77dDn2qY87bfRkXQ13FegYRNJ7v_GIQG-yGhqmzZLwahMQVAijbo8g16B5Sui5I2MczThm65HstDjDvyApeQnlWKaNK-ddIoIa1xF2nvEA5GkGYjmtWnYx",
                "cache-control": "no-cache"
            },
            data: {
                term: 'cafes',
                latitude: centerPoint.lat,
                longitude: centerPoint.lng,
                radius: 3000,
                categories: 'cafes,coffee',
                sort_by: 'rating'
            }

        }).then(function (res) {
            console.log(res);

            $('#innerCaro').empty();

            for (var i = 0; i <= 4; i++) {
                var results = res.businesses[i];
                console.log(results);

                var resultLat = results.coordinates.latitude;
                var resultLong = results.coordinates.longitude;

                var resultLatLong = new google.maps.LatLng(resultLat, resultLong)

                var contentString = "<div> its working </div>";

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });


                var newMarker = new google.maps.Marker({
                    animation: google.maps.Animation.DROP,
                    position: resultLatLong
                });
                newMarker.setMap(map);

                google.maps.event.addListener( newMarker, "click", (
                    function(newMarker, i){
                        return function() {
                            infowindow.open(map, newMarker);
                        }
                    }
                )(newMarker, i));
            

                var cardItem = $('<div>').addClass('carousel-item').attr('id', 'card' + i);
                var cardInfo = $('<div>').addClass('card text-center');
                var cardText = $('<div>').addClass('card-body rounded text-center');

                var name = $('<h5>').addClass('card-title').text(results.name);
                var rating = $('<h6>').addClass('card-subtitle mb-2').text(results.rating + ' out of 5 stars')
                var yelpLink = $('<a>').attr({
                    'href': results.url,
                    'target': '_blank'
                }).text('Click here to visit on Yelp');

                cardText.append(name, rating, yelpLink);
                cardText.appendTo(cardInfo);
                cardInfo.appendTo(cardItem);
                cardItem.appendTo('#innerCaro');

            };

            $('#item0').addClass('active');
            $('#card0').addClass('active');

        });


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

    /* $(document).on('click', '.carousel-control-prev', function(){
        $('#yelpCaro').carousel('prev');
    });

    $(document).on('click', '.carousel-control-next', function(){
        $('#yelpCaro').carousel('next');
    }); */

    makeMap();



    // Closing tag for document.ready
});