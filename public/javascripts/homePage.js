$(document).ready(function() {
    console.log("hi there");
    var closeBtn = $(".close-button");

    closeBtn.click(function() {
        $(".overlay").hide(200);
    });

    console.log($(".thumbnail"));

});
