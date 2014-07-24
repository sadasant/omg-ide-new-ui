$(window).ready(function() {
    setTimeout(function() {
        $("#loading-animation").fadeOut(function() {
            var $loading = $("#loading");
            $loading.animate({
                width: 50
            }, 300, function() {
                $loading.remove();
            });
        });
    }, 3000);
});
