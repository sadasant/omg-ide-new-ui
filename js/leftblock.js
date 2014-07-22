$(window).ready(function() {

    var $window        = $(window);
    var $block         = $("#left-block");
    var $bar           = $("#left-bar");
    var $panel         = $("#left-panel");
    var $buttons       = $bar.find('[class*="entypo-"]');
    var $popup         = $panel.find(".entypo-popup");

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

        var $this     = $(this);
        var is_active = $this.hasClass("active");
        var text      = $this.find(".tooltip-right").text();
        var $content  = $panel.find(".content-"+text);
        var is_popup  = $content.hasClass("popup");

        $panel.find(".content:not(.popup)").hide();
        $popup.hide();
        $buttons.removeClass("active");

        if (is_popup) {
            is_open = true;
            $content.find(".unpop").remove();
            $content.removeClass("popup");
            $content.off("mousedown", onMouseDown);
            $block.css({ borderRight: "1px solid #37a"});
            $panel.css({ width: 300 }, 300);
        }

        if (is_active) {
            closePanel();
            return;
        }

        $this.toggleClass("active");

        if (is_open) {
            $panel.find(".content-"+text).show();
            $popup.show().data("active", text);
            busy = false;
        } else {
            openPanel(text);
        }
    });

    function openPanel(text) {
        $block.css({ borderRight: "1px solid #37a"});
        $panel.animate({ width: 300 }, 300, function() {
            $panel.find(".content-"+text).show();
            $popup.show().data("active", text);
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

    $popup.click(function() {
        $panel.css({ width: 0 });
        $block.css({ borderRight: "none"});
        $panel.find('.entypo-popup').hide();
        is_open  = false;
        var text = $popup.data("active");
        $content = $panel.find(".content-"+text);
        var $unpop = $("<div class='unpop entypo-left-open'/>");
        $unpop.click(function() {
            $bar.find(".tooltip-right:contains("+text+")").parent().click();
        });
        $content.prepend($unpop);
        $content.addClass("popup");
        $content.mousedown(onMouseDown);
        $buttons.removeClass("active");
    });

    function onMouseDown(e) {
        $this = $(this);
        $this.data("stopMouseMove", false);
        $this.addClass("dropshadow");
        $this.mouseup(function() {
            $this.data("stopMouseMove", true);
            $this.removeClass("dropshadow");
        });
        var x = e.clientX;
        var y = e.clientY;
        var offset = $this.offset();
        $this.off("mousemove", onMouseMove);
        $this.on("mousemove", onMouseMove);
        var mouse = { x: 0, y: 0 };
        function onMouseMove(e) {
            if ($this.data("stopMouseMove")) {
                $window.off("mousemove", onMouseMove);
                return;
            }
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            $this.offset({
                left: offset.left + mouse.x - x,
                top:  offset.top  + mouse.y - y
            });
        }
    }

});
