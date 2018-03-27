$(document).ready(function () {

    //=================================================================================================================================================
    // GLOBAL VARIABLES
    //=================================================================================================================================================

    var locations = [];
    var locationMarkers = [];
    var resultMarkers = [];
    var map;
    var userStatus = false;
    var panelStatus = false;
    var uid;
    var user;
    var passFix = false;
    var userName;
    var centerPoint;
    var infoWindow;

    //=================================================================================================================================================
    // SCROLLING ANIMATIONS (FRONT END)
    //=================================================================================================================================================

    window.sr = ScrollReveal();
    sr.reveal('.navbar', {
        mobile: false,
        duration: 2000,
        origin: 'bottom'
    });
    sr.reveal('#homeLeft', {
        mobile: false,
        duration: 2000,
        origin: 'left',
        distance: '300px'
    });
    sr.reveal('#homeRight', {
        mobile: false,
        duration: 2000,
        origin: 'right',
        distance: '300px'
    });
    sr.reveal('#exploreHeadSection', {
        mobile: false,
        duration: 2000,
        origin: 'bottom',
        distance: '300px'
    });
    sr.reveal('#locCol', {
        mobile: false,
        duration: 1000,
        origin: 'right',
        distance: '300px'
    });
    sr.reveal('#createHeadSection', {
        mobile: false,
        move: 0
    });
    sr.reveal('#createLeft', {
        mobile: false,
        duration: 1000,
        origin: 'left',
        distance: '300px'
    });
    sr.reveal('#createRight', {
        mobile: false,
        duration: 1000,
        origin: 'right',
        distance: '300px'
    });
    sr.reveal('#shareHeadSection', {
        mobile: false,
        move: 0
    });
    sr.reveal('#shareLeft', {
        mobile: false,
        duration: 1000,
        origin: 'left',
        distance: '300px'
    });
    sr.reveal('#shareRight', {
        mobile: false,
        duration: 1000,
        origin: 'right',
        distance: '300px'
    });
    sr.reveal('#mainFooter', {
        mobile: false,
        move: 0
    });

    //=================================================================================================================================================
    // INITIALIZE FIREBASE
    //=================================================================================================================================================

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
    var chat = db.ref('/chat');

    //=================================================================================================================================================
    // USER LOGIN AND LOGOUT
    //=================================================================================================================================================

    //checks if user is logged in or not and displays or removes correct input fields and data ========================================================
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
            $("#backBtn").hide();
        }
        if (panelStatus) {
            $("#userCard").text("Login");
            $("#formUsername").hide();
            $("#userP").hide();
            $("#signUpBtn").hide();
            $("#signInBtn").hide();
            $("#formConfirmPassword").hide();
            $("#loginBtn").show();
            $("#backBtn").show();
        }
    }

    // checks the current users state and if anything is changed do something  ========================================================================
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            user = firebase.auth().currentUser;
            userName = user.displayName;
            console.log("logged in as: " + user.email);
            statusChecker(true, false);
            var email_id = user.email;
            var editGreeting = $("#userCard").text("Welcome User : " + user.email);
            var testId = user.uid;
            uidFirebase();
            //checks if user is in the "Data section" of firebase if not it then adds it.
            function uidFirebase() {
                db.ref("user").child(testId).once('value', function (snapshot) {
                    if (snapshot.exists()) {
                        console.log(user.email + " exist");
                        var me = $("#meNav").text(firebase.auth().currentUser.displayName);
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


    // sign up function ==============================================================================================================================
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
        } else if (passFix === false) {
            console.log("in");
            //once passwords do match it then creates the user in the auth section of firebase
            firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).then(function () {
                //then signs them in with the same credentials
                firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function () {
                    console.log("in2");
                    firebase.auth().currentUser.updateProfile({
                        displayName: userName
                    }).then(function () {
                        document.location.reload(true);
                    });
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

    // login function ===============================================================================================================================
    function login() {
        // grabs data from input fields
        var userEmail = $("#formEmail").val().trim();
        var userPass = $("#formPassword").val().trim();
        firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function () {
            var me = $("#meNav").text(firebase.auth().currentUser.displayName);
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("SignInError : " + errorMessage);
        });
    }

    // logout function=================================================================================================================================
    function logout() {
        firebase.auth().signOut();
        statusChecker(true, false);
    }

    //=================================================================================================================================================
    // MAP FUNCTIONALITY
    //=================================================================================================================================================

    // Creates the map on the page ====================================================================================================================
    function makeMap() {

        $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDqVvFEbKT3bghZxOT581eUo156nRZR4bw&libraries=places', function () {
            var mapProp = {
                center: new google.maps.LatLng(29.756846, -95.363444),
                zoom: 10,
            };
            var mapLocate = document.getElementById("map");
            map = new google.maps.Map(mapLocate, mapProp);
            infoWindow = new google.maps.InfoWindow({});

        })

    }

    // Takes user entered locations and places on map =================================================================================================
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
                    position: locationCordinates,
                    map: map
                });

                // Push both coordinates and marker made to arrays to be used in clearing
                locations.push(locationCordinates);
                locationMarkers.push(newMarker);

            });

        };

    };

    // Clearing all entered and returned locations from map =============================================================================================
    function clearLocations() {

        event.preventDefault();

        // Clear markers from both entered locations and returned business, clear all related arrays and on screan div
        $.each(locationMarkers, function (i) {
            locationMarkers[i].setMap(null);
        })

        $.each(resultMarkers, function (i) {
            resultMarkers[i].setMap(null)
        })

        resultMarkers = [];
        locationMarkers = [];
        locations = [];
        $('#addedLocations').empty();

        // Reset map position and zoom to default
        map.setCenter(new google.maps.LatLng(29.756846, -95.363444));
        map.setZoom(10);

        // Returning any built cards to default
        $('#innerCaro').empty();

        var defaultCard = $('<div>').addClass('carousel-item active');
        var defaultInfo = $('<div>').addClass('card text-center');
        var defaultText = $('<div>').addClass('card-body rounded text-center');

        var title = $('<h5>').addClass('card-title').text('Find great places to meet up with your friends!');
        var subtitle = $('<h6>').addClass('card-subtitle mb-2 text-muted').text('Enter your addresses above, hit Let\'s Meet, and Huddle will do the rest!')

        defaultText.append(title, subtitle);
        defaultText.appendTo(defaultInfo);
        defaultInfo.appendTo(defaultCard);
        defaultCard.appendTo('#innerCaro');
    }

    // First part of finding businesses, use Google Maps methods to locate center of all points provided ================================================
    function findCenter() {

        event.preventDefault();

        if (locations[1]) {

            var bounds = new google.maps.LatLngBounds;
            $.each(locations, function (i) {

                bounds.extend(locations[i]);
                centerPoint = JSON.parse(JSON.stringify(bounds.getCenter()));

                // Make the map zoom to newly found midpoint
                map.setCenter(centerPoint);
                map.setZoom(13);

            });

            // Make the call to Yelp
            findPlaces();

        };

    };

    // Using center to query Yelp for cafes/coffeshops based on that center =============================================================================
    function findPlaces() {

        console.log(centerPoint.lat, centerPoint.lng);

        $.ajax({
            method: 'Get',
            url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search",
            headers: {
                "authorization": "Bearer kRyV3p6ITp77dDn2qY87bfRkXQ13FegYRNJ7v_GIQG-yGhqmzZLwahMQVAijbo8g16B5Sui5I2MczThm65HstDjDvyApeQnlWKaNK-ddIoIa1xF2nvEA5GkGYjmtWnYx",
                "cache-control": "no-cache"
            },

            // Yelp parameters
            data: {
                latitude: centerPoint.lat,
                longitude: centerPoint.lng,
                radius: 5000,
                categories: 'cafes,coffee',
                sort_by: 'distance'
            }

        }).then(function (res) {

            // Clear out carosuel in prep for new cards
            $('#innerCaro').empty();

            // Remove old result markers, if exist, and clear out array
            $.each(resultMarkers, function (i) {
                resultMarkers[i].setMap(null)
            })

            resultMarkers = [];

            // Currently limiting to 10 businesses returned
            for (var i = 0; i <= 9; i++) {

                var results = res.businesses[i];
                var resultLatLong = new google.maps.LatLng(results.coordinates.latitude, results.coordinates.longitude)
                var contentString = '<div class="mapInfo">' + results.name + '</div>';

                // Each business has marker created at it position with the name stored on marker
                var newMarker = new google.maps.Marker({
                    animation: google.maps.Animation.DROP,
                    icon: {
                        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                        strokeColor: "#ee7b3c",
                        scale: 5
                    },
                    position: resultLatLong,
                    map: map,
                    content: contentString,
                    id: 'card' + i
                });

                // Adding both mouseover and click events to ensure mobile responsiveness, changes which card is displayed
                newMarker.addListener("mouseover", function () {
                    infoWindow.setContent(this.content);
                    infoWindow.open(map, this);

                    for (var i = 0; i <= 9; i++) {
                        $('#card' + i).removeClass('active');
                    }

                    $('#' + this.id).addClass('active');
                    $('#yelpCaro').carousel('pause');
                });

                newMarker.addListener("click", function () {
                    infoWindow.setContent(this.content);
                    infoWindow.open(map, this);

                    for (var i = 0; i <= 9; i++) {
                        $('#card' + i).removeClass('active');
                    }

                    $('#' + this.id).addClass('active');
                    $('#yelpCaro').carousel('pause');
                });

                // Add to array containing all business markers
                resultMarkers.push(newMarker);

                // Building new cards for all business returned
                var cardItem = $('<div>').addClass('carousel-item').attr('id', 'card' + i);
                var cardInfo = $('<div>').addClass('card text-center');
                var cardText = $('<div>').addClass('card-body rounded text-center');

                var name = $('<h5>').addClass('card-title').text(results.name);
                var rating = $('<h6>').addClass('card-subtitle mb-2').text(results.rating + ' out of 5 stars')
                var addressOne = $('<div>').addClass('address').text(results.location.display_address[0]);
                var addressTwo = $('<div>').addClass('address').text(results.location.display_address[1]);
                var yelpLink = $('<a>').attr({
                    'href': results.url,
                    'target': '_blank'
                }).text('Click here to visit on Yelp');

                cardText.append(name, rating, addressOne, addressTwo, yelpLink);
                cardText.appendTo(cardInfo);
                cardInfo.appendTo(cardItem);
                cardItem.appendTo('#innerCaro');

            };

            // Adding active class to first card
            $('#card0').addClass('active');

        });


    };

    //=================================================================================================================================================
    // CHAT FUNCTIONALITY
    //=================================================================================================================================================

    // Creating chat message from form on page ========================================================================================================
    function newChat() {

        user = firebase.auth().currentUser;

        event.preventDefault();

        // If the user has been added to database, allow them to use chat
        if (user) {

            // Format message then push to chat on database
            var message = {
                'text': userName + ': ' + $('#chatMessage').val().trim(),
            }
            chat.push(message);

        } else {
            var message = {
                'text': 'Anonymous : ' + $('#chatMessage').val().trim(),
            }
            chat.push(message);
        }

        // Reset the form
        $('#chatMessage').val('');

    }

    // Listens to messages added to chat, pushes to page ==============================================================================================
    chat.on('child_added', function (snap) {

        // When message comes in, grab it's content, and push that into a new div
        var message = snap.val().text;
        var newChat = $('<div>').text(message)

        // Check for alert messages, if none are found, determine if message is from local player or not and apply appropriate class for style
        if (message.startsWith(userName)) {
            newChat.addClass('yourChat');
        } else {
            newChat.addClass('chatMessage');
        }

        newChat.appendTo('#chatWindow');

        // Automatically move the scroll position as the messages extend past what can be seen in initial window
        $('#chatWindow').scrollTop($('#chatWindow')[0].scrollHeight)
    })

    // Listens to any value change on chat, limits total messages allowed ============================================================================
    chat.on('value', function (snap) {

        var userChat = snap.val();
        var keys = Object.keys(userChat);

        // If more than 50 messages stored in database, remove to that level to limit database memory and load time
        if (keys.length > 50) {

            chat.child(keys[0]).remove();

        };

    })

    //=================================================================================================================================================
    // FUNCTIONS CALLED ON PAGE LOAD
    //=================================================================================================================================================

    makeMap();

    statusChecker();

    //=================================================================================================================================================
    // ON CLICK EVENTS
    //=================================================================================================================================================

    // Fires newLocations function when user enters location address
    $('#addLocation').on('click', newLocation);

    // Fires findCenter functions when user searches for meetup locations
    $('#submitLocations').on('click', findCenter);

    // Fires newChat function when user adds a chat message
    $('#newChat').on('click', newChat);

    // Fires clearLocations function when user clears all
    $('#clearAllSpots').on('click', clearLocations);



    // all buttons used for signIn, logout, and login functionality
    $("#signInBtn").on("click", function (e) {
        e.preventDefault();
        passFix = true;
        if (passFix) {
            var input = document.getElementById("formPassword");
            // Execute a function when the user releases a key on the keyboard
            input.addEventListener("keyup", function (event) {
                // Cancel the default action, if needed
                event.preventDefault();
                // Number 13 is the "Enter" key on the keyboard
                if (event.keyCode === 13) {
                    // Trigger the button element with a click
                    document.getElementById("loginBtn").click();
                }
            });
        }
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

    $("#backBtn").on("click", function (e) {
        e.preventDefault();
        statusChecker(false, false);
    })

    /* // Opens the info window related to clicked card
    $(document).on('click', '.carousel-item', function () {
        event.preventDefault();

        var clickedCard = $(this).attr('id');

        for (var i = 0; i < resultMarkers.length; i++) {
            if (resultMarkers[i].id === clickedCard) {
                console.log(resultMarkers[i].id);
                infoWindow.close();
                infoWindow.setContent(resultMarkers[i].content);
                infoWindow.open(map, resultMarkers[i]);
            }
        }

        $('#yelpCaro').carousel('pause');

    }) */

    // Closing tag for document.ready
});