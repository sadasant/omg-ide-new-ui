$(window).ready(function() {

    var $window        = $(window);
    var $block         = $("#left-block");
    var $bar           = $("#left-bar");
    var $panel         = $("#left-panel");
    var $panel_content = $("#left-panel .content");
    var $buttons       = $bar.find('[class*="entypo-"]');

    $window.resize(resize);

    function resize() {
        $bar.height($window.height());
        $panel.height($window.height());
    }

    resize();

    $buttons.click(function() {
        var $this = $(this);

        if ($this.hasClass("active")) {
            $buttons.removeClass("active");
            closePanel();
            return;
        }

        $buttons.removeClass("active");
        $this.toggleClass("active");
        openPanel();
    });

    function openPanel() {
        $block.css({ borderRight: "1px solid #37a"});
        $panel.animate({ width: 300 }, 300, function() {
            $panel_content.show();
        });
    }

    function closePanel() {
        $panel_content.hide();
        $panel.animate({ width: 0 }, 300, function() {
            $block.css({ borderRight: "none"});
        });
    }

});
