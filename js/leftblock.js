$(window).ready(function() {

    var $window  = $(window);
    var $body    = $(document.body);
    var $block   = $("#left-block");
    var $bar     = $("#left-bar");
    var $panel   = $("#left-panel");
    var $buttons = $bar.find('[class*="entypo-"]');
    var $popup   = $panel.find(".entypo-popup");
    var $editor  = $("#editor");

    var $compile = $("#compile");
    var $deploy  = $("#deploy");

    var $logs      = $("#logs");
    var $open_logs = $("#open-logs");
    var $ide_logs  = $(".logs-content-ide");

    var bar_width        = 50;
    var panel_open_width = 351;

    var css_blue_border = "1px solid #a1b8ca";

    $window.resize(resize);

    function resize() {
        var b_height = $body.height();
        var w_height = $window.height();
        var height   = b_height > w_height ? b_height : w_height;
        $block.height(height);
        $bar.height(height);
        $panel.height(height);
        $body.height(height);
    }

    resize();

    var busy    = false;
    var is_open = false;

    $buttons.click(function() {
        if (busy) return;

        var $this     = $(this);
        var is_active = $this.hasClass("active");
        var text      = $this.find(".tooltip-right").text();
        var $content  = $panel.find(".content-"+text);
        var is_popup  = $content.hasClass("popup");

        if (!$content[0]) return;
        busy = true;

        $panel.find(".content:not(.popup)").hide();
        $popup.hide();
        $buttons.removeClass("active");

        if (is_popup) {
            is_open = true;
            $content.find(".unpop").remove();
            $content.removeClass("popup");
            $content.off("mousedown", onMouseDown);
            $block.css({ borderRight: css_blue_border});
            $panel.css({ width: 300 }, 300);
            $editor.css({ left: panel_open_width });
        }

        if (is_active) {
            closePanel();
            return;
        }

        $this.toggleClass("active");
        $this.removeClass("alert");

        if (is_open) {
            $panel.find(".content-"+text).show();
            $popup.show().data("active", text);
            busy = false;
        } else {
            openPanel(text);
        }
    });

    function openPanel(text) {
        $block.css({ borderRight: css_blue_border});
        $editor.animate({ left: panel_open_width }, {
            duration: 300,
            queue: false
        });
        $panel.animate({ width: 300 }, 300, function() {
            $panel.find(".content-"+text).show();
            $popup.show().data("active", text);
            is_open = true;
            busy    = false;
        });
    }

    function closePanel() {
        $editor.animate({ left: bar_width }, {
            duration: 300,
            queue: false
        });
        $panel.animate({ width: 0 }, 300, function() {
            $block.css({ borderRight: "none"});
            is_open = false;
            busy    = false;
        });
    }

    $popup.click(function() {
        $panel.css({ width: 0 });
        $editor.offset({ left: bar_width });
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
        $window.off("mousemove", onMouseMove);
        $window.on("mousemove", onMouseMove);
        var mouse = { x: 0, y: 0 };
        function onMouseMove(e) {
            if ($this.data("stopMouseMove")) {
                $window.off("mousemove", onMouseMove);
                return;
            }
            var $target = $(e.target);
            if ($target.hasClass("select") || $target.parents(".select").length || getSelectedText()) {
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

    $compile.click(function(e) {
        $compile.removeClass("entypo-check");
        $compile.removeClass("entypo-attention");
        $compile.addClass("entypo-flash alert");
        $compile.find(".tooltip-right").text("Compiling...");
        setTimeout(function() {
            $ide_logs.append([
                "",
                "Compiling, please Wait...",
                "<div style='color:cyan'>size:</div> 22",
                "<div style='color:cyan'>posxml:</div> ZDAKMApIRVkgUE9TWE1MIQoNdQ0xDQxC106D3A15==",
                "<div style='color:cyan'>integers:</div> 0",
                "<div style='color:cyan'>strings:</div> 0",
                "<div style='color:cyan'>functions:</div> 0",
                "<div style='color:cyan'>maxvars:</div> 512",
                "<div style='color:cyan'>maxfuncs:</div> 128",
                "Compilation successful!",
            ].map(function(e) {
                return $("<li/>").html(e);
            }));
            if (!$logs.hasClass("popup")) {
                $open_logs.addClass("alert");
            }
            $compile.removeClass("entypo-flash alert");
            $compile.addClass("entypo-check");
            $compile.find(".tooltip-right").text("Compiled");
        }, 3000);
    });

    $deploy.click(function(e) {
        $deploy.removeClass("entypo-check");
        $deploy.addClass("entypo-cloud-thunder alert");
        $deploy.find(".tooltip-right").text("Deploying...");
        setTimeout(function() {
            $deploy.removeClass("entypo-cloud-thunder alert");
            $deploy.addClass("entypo-check");
            $deploy.find(".tooltip-right").text("Deployed!");
            setTimeout(function() {
                $deploy.find(".tooltip-right").text("Deploy");
            }, 1500);
        }, 3000);
    });

    function getSelectedText() {
        var text = "";
        if (typeof window.getSelection != "undefined") {
            text = window.getSelection().toString();
        } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
            text = document.selection.createRange().text;
        }
        return text;
    }

});
