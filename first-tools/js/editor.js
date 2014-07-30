/* global $   */
/* global ace */
$(window).ready(function() {

    var $window     = $(window);
    var $body       = $(document.body);
    var $editor     = $("#editor");
    var $bottom_bar = $("#bottom_bar");
    var $compile    = $("#compile");
    var $deploy     = $("#deploy");
    var $tabs       = $("#tabs");
    var $block      = $("#left-block");

    var editor  = ace.edit("editor");
    var session = editor.getSession();

    window.editor  = editor;
    window.session = session;

    editor.setTheme("ace/theme/github");
    editor.setFontSize("13px");
    editor.setShowPrintMargin(false);
    session.setUseSoftTabs(true);
    session.setTabSize(2);

    session.setMode("ace/mode/ruby");

    $window.resize(resize);

    function resize() {
        var b_height = $body.height();
        var w_height = $window.height();
        var height   = b_height > w_height ? b_height : w_height;
        $editor.height(height - $tabs.height());
        var b_width     = $body.width();
        var w_width     = $window.width();
        var width       = b_width > w_width ? b_width : w_width;
        var block_width = $block.width();
        $editor.width(width - block_width);
        $editor.height($(".ace_gutter").height() - 22);
        $bottom_bar.width(width - block_width - 40);
    }

    resize();

    editor.setValue(
"#!/usr/bin/ruby\n"+
"\n"+
"# Program to find the factorial of a number\n"+
"def fact(n)\n"+
"    if n == 0\n"+
"        1\n"+
"    else\n"+
"        n * fact(n-1)\n"+
"    end\n"+
"end\n"+
"\n"+
"puts fact(ARGV[0].to_i)\n"+
"\n"+
"class Range\n"+
"  def to_json(*a)\n"+
"    {\n"+
"      'json_class'   => self.class.name, # = 'Range'\n"+
"      'data'         => [ first, last, exclude_end? ]\n"+
"    }.to_json(*a)\n"+
"  end\n"+
"end\n"+
"\n"+
"{:id => 34, :key => \"value\"}\n"+
"\n"+
"\n"+
"    herDocs = [<<'FOO', <<BAR, <<-BAZ, <<-`EXEC`] #comment\n"+
"  FOO #{literal}\n"+
"FOO\n"+
"  BAR #{fact(10)}\n"+
"BAR\n"+
"  BAZ indented\n"+
"    BAZ\n"+
"        echo hi\n"+
"    EXEC\n"+
"puts herDocs");

    editor.clearSelection();

    editor.on("change", function() {
        if (!$compile.hasClass("entypo-check")) return;
        $compile.removeClass("entypo-check");
        $compile.addClass("entypo-attention");
        $compile.find(".tooltip-right").text("Compile");
    });

    editor.moveCursorTo(0, 0);

    // BOTTOM BAR

    setInterval(update, 500);

    function update() {
        var pos     = editor.getCursorPosition();
        var name    = $tabs.children(".active").attr("title");
        var changed = $compile.hasClass("entypo-attention") ? "*" : "";

        var left = $("<div class='left' />");
        left.html([
            name+changed,
            pos.row+","+pos.column,
            name.indexOf(".rb") === name.length - 3 ? "Ruby" : "POSXML"
        ].join("&nbsp;&nbsp;&nbsp;"));

        var right = $("<div class='right' />");
        right.text([
            $compile.find(".tooltip-right").text() === "Compiling..." ? "Compiling..." : "",
            $deploy.find(".tooltip-right").text() === "Deploying..." ? "Deploying..." : "",
        ].join(" "));

        $bottom_bar.html("").append(left, right);
    }

    update();

});
