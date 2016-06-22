$(document).ready(function() {
    console.log("hi there");
    $.get("/yelp/search", function(data) {
        console.log(data);
    })
});