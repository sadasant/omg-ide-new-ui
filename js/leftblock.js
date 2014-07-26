/* global $ */
$(window).ready(function() {

    var $window  = $(window);
    var $body    = $(document.body);
    var $block   = $("#left-block");
    var $bar     = $("#left-bar");
    var $panel   = $("#left-panel");
    var $buttons = $bar.find('[class*="entypo-"]');
    var $popup   = $panel.find(".entypo-popup");
    var $editor  = $("#editor");
    var $tabs    = $("#tabs");

    var $compile = $("#compile");
    var $deploy  = $("#deploy");

    var $logs      = $("#logs");
    var $open_logs = $("#open-logs");
    var $ide_logs  = $(".logs-content-ide");

    var $popup_scroll_corner = $("<div class='scroll_corner'>");
    var $popup_scroll_top    = $("<div class='scroll_top'>");
    var $popup_scroll_bottom = $("<div class='scroll_bottom'>");
    var $popup_scroll_right  = $("<div class='scroll_right'>");
    var $popup_scroll_left   = $("<div class='scroll_left'>");

    var bar_width        = 50;
    var panel_open_width = 350;

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

        $content.data("text", text);

        $panel.find(".content:not(.popup)").hide();
        $popup.hide();
        $buttons.removeClass("active");

        if (is_popup) {
            is_open = true;
            $content.find(".unpop").remove();
            $content.removeClass("popup");
            $content.off("mousedown", onMouseDown);
            $panel.css({ width: 300 }, 300);
            $tabs.css({ left: panel_open_width });
            $editor.css({ left: panel_open_width, borderLeft: css_blue_border });
        }

        if (is_active) {
            closePanel();
            return;
        }

        $this.toggleClass("active");
        $this.removeClass("alert");

        if (is_open) {
            $panel.find(".content-"+text).show();
            $popup.show();
            busy = false;
        } else {
            openPanel(text);
        }
    });

    function openPanel(text) {
        $tabs.animate({ left: panel_open_width }, {
            duration: 300,
            queue: false
        });
        $editor.animate({ left: panel_open_width }, {
            duration: 300,
            queue: false
        });
        $panel.animate({ width: 300 }, 300, function() {
            $editor.css({ borderLeft: css_blue_border });
            $panel.find(".content-"+text).show();
            $popup.show();
            is_open = true;
            busy    = false;
        });
    }

    function closePanel() {
        $tabs.animate({ left: bar_width }, {
            duration: 300,
            queue: false
        });
        $editor.animate({ left: bar_width }, {
            duration: 300,
            queue: false
        });
        $panel.animate({ width: 0 }, 300, function() {
            $editor.css({ borderLeft: 0 });
            is_open = false;
            busy    = false;
        });
    }

    $popup.click(function() {
        is_open      = false;
        var $content = $panel.find(".content:visible:not(.popup)");
        var text     = $content.data("text");
        var $unpop   = $("<div class='unpop entypo-left-open'/>");
        $panel.css({ width: 0 });
        $tabs.offset({ left: bar_width });
        $editor.offset({ left: bar_width, borderLeft: 0 });
        $panel.find('.entypo-popup').hide();
        $content.prepend($unpop);
        $content.on("click", ".unpop", function() {
            $content.data("width", $content.width());
            $content.data("height", $content.height());
            $content.css({ width: "", height: "" });
            $content.find('[class*="scroll_"]').remove();
            $content.data("scroll-styles", $content.find('[class*="scroll-"]').map(function(_,e) { return $(e).attr("style"); }));
            $content.find('[class*="scroll-"]').attr("style", "");
            $bar.find(".tooltip-right:contains("+text+")").parent().click();
        });
        $content.addClass("popup");
        $content.mousedown(onMouseDown);
        $buttons.removeClass("active");
        $content.append($popup_scroll_corner.clone());
        $content.append($popup_scroll_top.clone());
        $content.append($popup_scroll_bottom.clone());
        $content.append($popup_scroll_right.clone());
        $content.append($popup_scroll_left.clone());
        $content.css({
            width:  $content.data("width"),
            height: $content.data("height")
        });
        var styles = $content.data("scroll-styles") || [];
        $content.find('[class*="scroll-"]').each(function(i, e) {
            if (styles[i]) {
                $(e).attr("style", styles[i]);
            }
        });
    });

    function onMouseDown(e) {
        var $this   = $(this);
        var $target = $(e.target);

        if ($target.hasClass("select") ||
            $target.parents(".select").length ||
            $this.hasClass("resizing") ||
            $target.hasClass("scroll_corner") ||
            $target.hasClass("scroll_top")    ||
            $target.hasClass("scroll_bottom") ||
            $target.hasClass("scroll_right")  ||
            $target.hasClass("scroll_left")) {
            return;
        }

        $(".popup").css({ zIndex: 9 });
        $this.css({ zIndex: 10 });
        $this.data("stopMouseMove", false);
        $this.addClass("dropshadow");
        $this.addClass("no-select-childs");
        $window.mouseup(function() {
            $this.data("stopMouseMove", true);
            $this.removeClass("dropshadow");
            $this.removeClass("no-select-childs");
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
            if (!$logs.hasClass("popup") && !$logs.is(":visible")) {
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

    $body.on("mousedown", ".scroll_corner", function(e) {
        var $this  = $(this);
        var $popup = $this.parent();

        $popup.addClass("resizing");
        $popup.addClass("no-select-childs");

        $this.data("stopMouseMove", false);
        $window.mouseup(function() {
            $this.data("stopMouseMove", true);
            $this.removeClass("dropshadow");
        });

        var x = e.clientX;
        var y = e.clientY;

        var width   = $popup.width();
        var height  = $popup.height();

        var $scrollYs = $popup.find(".scroll-y");
        var $scrollXs = $popup.find(".scroll-x");
        var heights = $scrollYs.map(function(_,e){return $(e).height(); });
        var widths  = $scrollXs.map(function(_,e){return $(e).width(); });

        $window.off("mousemove", onMouseMove);
        $window.on("mousemove", onMouseMove);
        var mouse = { x: 0, y: 0 };
        function onMouseMove(e) {
            if ($this.data("stopMouseMove")) {
                $window.off("mousemove", onMouseMove);
                $popup.removeClass("resizing");
                $popup.removeClass("no-select-childs");
                return;
            }
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            var popup_width  = width  + mouse.x - x;
            var popup_height = height + mouse.y - y;

            var do_x = popup_width  <= $window.width()*0.8  || popup_width  < $popup.width();
            var do_y = popup_height <= $window.height()*0.8 || popup_height < $popup.height();

            if (do_x)  $popup.css("width", popup_width);
            if (do_y) $popup.css("height", popup_height);

            var link_x_i = $scrollXs.index($scrollXs.filter(".link-scroll.active"));
            var link_y_i = $scrollYs.index($scrollYs.filter(".link-scroll.active"));

            if (do_x) $scrollXs.each(function(i, e) {
                var $e = $(e);
                var has_link = $e.hasClass("link-scroll");
                if (has_link && i > -1) i = link_x_i;
                $e.width(widths[i] + mouse.x - x);
            });

            if (do_y) $scrollYs.each(function(i, e) {
                var $e = $(e);
                var has_link = $e.hasClass("link-scroll");
                if (has_link && i > -1) i = link_y_i;
                $e.height(heights[i] + mouse.y - y);
            });
        }
    });

    $body.on("mousedown", ".scroll_top", function(e) {
        var $this  = $(this);
        var $popup = $this.parent();

        $popup.addClass("resizing");
        $popup.addClass("no-select-childs");

        $this.data("stopMouseMove", false);
        $window.mouseup(function() {
            $this.data("stopMouseMove", true);
            $this.removeClass("dropshadow");
        });

        var y      = e.clientY;
        var height = $popup.height();
        var offset = $popup.offset();

        var $scrollYs = $popup.find(".scroll-y");
        var heights   = $scrollYs.map(function(_,e){return $(e).height(); });

        var min_height = parseInt($popup.css("min-height"));

        $window.off("mousemove", onMouseMove);
        $window.on("mousemove", onMouseMove);
        var mouse = { y: 0 };
        function onMouseMove(e) {
            if ($this.data("stopMouseMove")) {
                $window.off("mousemove", onMouseMove);
                $popup.removeClass("resizing");
                $popup.removeClass("no-select-childs");
                return;
            }
            mouse.y = e.clientY;

            var popup_height = height - mouse.y + y;

            var do_y = popup_height >= min_height &&
                       (popup_height <= $window.height()*0.8 ||
                       popup_height < $popup.height());

            if (!do_y) return;

            $popup.css("height", popup_height);
            $popup.offset({ top: offset.top + mouse.y - y });

            var link_y_i = $scrollYs.index($scrollYs.filter(".link-scroll.active"));

            $scrollYs.each(function(i, e) {
                var $e = $(e);
                var has_link = $e.hasClass("link-scroll");
                if (has_link && i > -1) i = link_y_i;
                $e.height(heights[i] - mouse.y + y);
            });
        }
    });

    $body.on("mousedown", ".scroll_bottom", function(e) {
        var $this  = $(this);
        var $popup = $this.parent();

        $popup.addClass("resizing");
        $popup.addClass("no-select-childs");

        $this.data("stopMouseMove", false);
        $window.mouseup(function() {
            $this.data("stopMouseMove", true);
            $this.removeClass("dropshadow");
        });

        var y      = e.clientY;
        var height = $popup.height();

        var $scrollYs = $popup.find(".scroll-y");
        var heights   = $scrollYs.map(function(_,e){return $(e).height(); });

        var min_height = parseInt($popup.css("min-height"));

        $window.off("mousemove", onMouseMove);
        $window.on("mousemove", onMouseMove);
        var mouse = { y: 0 };
        function onMouseMove(e) {
            if ($this.data("stopMouseMove")) {
                $window.off("mousemove", onMouseMove);
                $popup.removeClass("resizing");
                $popup.removeClass("no-select-childs");
                return;
            }
            mouse.y = e.clientY;

            var popup_height = height + mouse.y - y;

            var do_y = popup_height >= min_height &&
                       (popup_height <= $window.height()*0.8 ||
                       popup_height < $popup.height());

            if (!do_y) return;

            $popup.css("height", popup_height);

            var link_y_i = $scrollYs.index($scrollYs.filter(".link-scroll.active"));

            $scrollYs.each(function(i, e) {
                var $e = $(e);
                var has_link = $e.hasClass("link-scroll");
                if (has_link && i > -1) i = link_y_i;
                $e.height(heights[i] + mouse.y - y);
            });
        }
    });

    $body.on("mousedown", ".scroll_right", function(e) {
        var $this  = $(this);
        var $popup = $this.parent();

        $popup.addClass("resizing");
        $popup.addClass("no-select-childs");

        $this.data("stopMouseMove", false);
        $window.mouseup(function() {
            $this.data("stopMouseMove", true);
            $this.removeClass("dropshadow");
        });

        var x     = e.clientX;
        var width = $popup.width();

        var $scrollXs = $popup.find(".scroll-x");
        var widths    = $scrollXs.map(function(_,e){return $(e).width(); });

        var min_width = parseInt($popup.css("min-width"));

        $window.off("mousemove", onMouseMove);
        $window.on("mousemove", onMouseMove);
        var mouse = { x: 0 };
        function onMouseMove(e) {
            if ($this.data("stopMouseMove")) {
                $window.off("mousemove", onMouseMove);
                $popup.removeClass("resizing");
                $popup.removeClass("no-select-childs");
                return;
            }
            mouse.x = e.clientX;

            var popup_width = width + mouse.x - x;

            var do_x = popup_width >= min_width &&
                       (popup_width <= $window.width()*0.8 ||
                       popup_width < $popup.width());

            if (!do_x) return;

            $popup.css("width", popup_width);

            var link_x_i = $scrollXs.index($scrollXs.filter(".link-scroll.active"));

            $scrollXs.each(function(i, e) {
                var $e = $(e);
                var has_link = $e.hasClass("link-scroll");
                if (has_link && i > -1) i = link_x_i;
                $e.width(widths[i] + mouse.x - x);
            });
        }
    });


    $body.on("mousedown", ".scroll_left", function(e) {
        var $this  = $(this);
        var $popup = $this.parent();

        $popup.addClass("resizing");
        $popup.addClass("no-select-childs");

        $this.data("stopMouseMove", false);
        $window.mouseup(function() {
            $this.data("stopMouseMove", true);
            $this.removeClass("dropshadow");
        });

        var x      = e.clientX;
        var width  = $popup.width();
        var offset = $popup.offset();

        var $scrollXs = $popup.find(".scroll-x");
        var widths    = $scrollXs.map(function(_,e){return $(e).width(); });

        var min_width = parseInt($popup.css("min-width"));

        $window.off("mousemove", onMouseMove);
        $window.on("mousemove", onMouseMove);
        var mouse = { x: 0 };
        function onMouseMove(e) {
            if ($this.data("stopMouseMove")) {
                $window.off("mousemove", onMouseMove);
                $popup.removeClass("resizing");
                $popup.removeClass("no-select-childs");
                return;
            }
            mouse.x = e.clientX;

            var popup_width = width - mouse.x + x;

            var do_x = popup_width >= min_width &&
                       (popup_width <= $window.width()*0.8 ||
                       popup_width < $popup.width());

            if (!do_x) return;

            $popup.css("width", popup_width);
            $popup.offset({ left: offset.left + mouse.x - x });

            var link_x_i = $scrollXs.index($scrollXs.filter(".link-scroll.active"));

            $scrollXs.each(function(i, e) {
                var $e = $(e);
                var has_link = $e.hasClass("link-scroll");
                if (has_link && i > -1) i = link_x_i;
                $(e).width(widths[i] - mouse.x + x);
            });
        }
    });

});
