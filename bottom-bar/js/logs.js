/* global $ */
$(window).ready(function() {

    var $logs = $("#logs");
    var $tabs = $logs.find(".tabs li");

    $tabs.click(function() {
        $tabs.removeClass("active");
        var $this = $(this);
        $this.addClass("active");
        var text = $this.text().toLowerCase();
        $logs.find('[class*="logs-content-"]').removeClass("active");
        $logs.find(".logs-content-"+text).addClass("active");
    });

});
