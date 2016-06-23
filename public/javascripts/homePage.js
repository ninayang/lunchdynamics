$(document).ready(function() {
    console.log("hi there");
    var findFoodBtn = $("#find-food");
    var list = $("#restaurant-list");

    findFoodBtn.click(function() {
        $.get("/yelp/search", function(data) {
            createRestaurantBlocks(data);
        });
    });

    function createRestaurantBlocks(data) {
        console.log(data);
        var counter = 1;
        var rowId = 1;
        var row = $("<div></div>");
        row.addClass("row");
        row.attr("id", rowId + "");
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

            var thumbNail = $("<div></div>");
            thumbNail.addClass("thumbnail");

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
    }

    function startNewRow(rowId) {
        var row = $("<div></div>");
        row.addClass("row");
        row.attr("id", rowId + "");
        return row;
    }

});