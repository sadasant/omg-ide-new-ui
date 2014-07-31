/* global $ */
$(window).ready(function() {

    var $help = $("#help");
    var $tabs = $help.find(".tabs li");

    $tabs.click(function() {
        $tabs.removeClass("active");
        var $this = $(this);
        $this.addClass("active");
        var text = $this.text().toLowerCase().replace(/ /g, "-");
        $help.find('[class*="help-content-"]').removeClass("active");
        $help.find(".help-content-"+text).addClass("active");
    });

});
