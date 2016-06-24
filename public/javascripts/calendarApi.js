// Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
var apiKey = 'AIzaSyAsSBV7mQ4kJP9GxEoD_DINPyMpr-eFldk';
var CLIENT_ID = '13429585263-mpjhd2i1tjavcbu4nf334npv0gskunm5.apps.googleusercontent.com';


var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
var YELP_DISTANCE = 10000;
var METERS_PER_MINUTE = 83;

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadCalendarApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', findNextEvent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function findNextEvent() {
  $("#currentTime").text(moment().format("LT"));
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;
    var twoHoursFromNow = moment().add(2, 'hours');
    var eventFound = false;
    var timeToNextEvent;
    var eventStartTime;
    for (i=0; i < events.length; i++) {
      var event = events[i];
      console.log(event.summary);
      eventStartTime = moment(event.start.dateTime);
      if (eventStartTime.isAfter(moment()) && eventStartTime.isBefore(twoHoursFromNow)) {
        console.log("what");
        eventFound = true;
        timeToNextEvent = moment().to(moment(eventStartTime));
        $("#nextEvent").append("Your next event, <span id='teal'>" + event.summary + "</span>, is " + timeToNextEvent+ ".");
        $("#lastLine").css("display", "block");
        break;
      }
    }

    if (eventFound) {
        console.log(timeToNextEvent);
        console.log(eventStartTime.diff(moment()));
      
        var timeToWalkOneWay = eventStartTime.diff(moment()) / 60000 / 2;
        YELP_DISTANCE = timeToWalkOneWay * METERS_PER_MINUTE;
        console.log("time to walk:", timeToWalkOneWay);
        console.log(YELP_DISTANCE);
        
      } else {
        $("#nextEvent").append("Looks like you have no events in the next two hours, have a nice meal!");

      }
    $.post("/yelp/search", {distance : YELP_DISTANCE})
        .done(function(data) {
          console.log(data);
          createRestaurantBlocks(data);
        });
  });
}
function createRestaurantBlocks(data) {
  console.log(data);
  var counter = 1;
  var rowId = 1;
  var row = $("<div></div>");
  row.addClass("row");
  row.attr("id", rowId + "");
  row.css({
    "width" : "60%",
    "margin" : "auto"
  });
  for (var i = 0; i < data.length; i++) {

    var restaurant = data[i];

    if (counter > 3) {
      $("body").append(row);
      counter = 1;
      rowId += 1;
      row = startNewRow(rowId);
    }

    var thumbNailCtn = $("<div></div>");
    thumbNailCtn.addClass("col-sm-6 col-md-4");
    //thumbNailCtn.css({
    //"box-shadow" : "rgba(0, 0, 0, 0.21961) 0px 1px 2px 0px"
    //});

    var thumbNail = $("<div></div>");
    thumbNail.addClass("thumbnail");
    thumbNail.css({
      "padding" : "6px"
    });

    var img = $('<img />', {
      src: restaurant.image_url
    });

    thumbNail.append(img);

    var caption = $("<div></div>");
    caption.addClass("caption");

    var restaurantName = $("<h3></h3>");
    restaurantName.addClass("list-group-item-heading");
    console.log(restaurant.name);
    restaurantName.text(restaurant.name);

    var snippetText = $("<p></p>");
    snippetText.text(restaurant.snippet_text);

    caption.append(restaurantName);
    caption.append(snippetText);
    thumbNail.append(caption);
    thumbNailCtn.append(thumbNail);
    row.append(thumbNailCtn);

    counter += 1;
  }
  $("body").append(row);
}

function startNewRow(rowId) {
  var row = $("<div></div>");
  row.addClass("row");
  row.attr("id", rowId + "");
  row.css({
    "width" : "60%",
    "margin" : "auto"
  });
  return row;
}
