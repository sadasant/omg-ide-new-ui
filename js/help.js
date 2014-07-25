$(window).ready(function() {

    $help = $("#help");
    $tabs = $help.find(".tabs li");

    $tabs.click(function() {
        $tabs.removeClass("active");
        var $this = $(this);
        $this.addClass("active");
        var text = $this.text().toLowerCase().replace(/ /g, "-");
        console.log(text);
        $help.find('[class*="help-content-"]').removeClass("active");
        $help.find(".help-content-"+text).addClass("active");
    });

});
