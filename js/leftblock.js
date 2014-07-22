$(window).ready(function() {

    var $window        = $(window);
    var $block         = $("#left-block");
    var $bar           = $("#left-bar");
    var $panel         = $("#left-panel");
    var $buttons       = $bar.find('[class*="entypo-"]');

    $window.resize(resize);

    function resize() {
        $bar.height($window.height());
        $panel.height($window.height());
    }

    resize();

    var busy    = false;
    var is_open = false;

    $buttons.click(function() {
        if (busy) return;
        busy = true;

        var $this = $(this);
        var is_active = $this.hasClass("active");

        $panel.find('.content').hide();
        $buttons.removeClass("active");

        if (is_active) {
            closePanel();
            return;
        }

        var text = $this.find(".tooltip-right").text();

        $this.toggleClass("active");

        if (is_open) {
            $panel.find(".content-"+text).show();
            busy = false;
        } else {
            openPanel(text);
        }
    });

    function openPanel(text) {
        $block.css({ borderRight: "1px solid #37a"});
        $panel.animate({ width: 300 }, 300, function() {
            $panel.find(".content-"+text).show();
            is_open = true;
            busy    = false;
        });
    }

    function closePanel() {
        $panel.animate({ width: 0 }, 300, function() {
            $block.css({ borderRight: "none"});
            is_open = false;
            busy    = false;
        });
    }

});
