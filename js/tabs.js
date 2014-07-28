/* global $ */
$(window).ready(function() {

    var $tabs   = $("#tabs");
    var $editor = $("#editor");

    var current = 0;
    var prev    = 0;
    var docs    = {};

    docs["example.rb"] = window.editor.getValue();

    window.docs = docs;

    $tabs.on("mousedown", ".tab", function(e) {
        var $this   = $(this);
        var $target = $(e.target);
        if ($target.hasClass("x") || $this.hasClass("active")) {
            return;
        }
        var name = $tabs.children(".active").attr("title");
        docs[name] = window.editor.getValue();
        $tabs.children().removeClass("active");
        $this.addClass("active");
        prev    = current;
        current = $this.attr("title");
        window.editor.setValue(docs[current]);
        window.editor.clearSelection();
    });

    $tabs.on("click", ".x", function() {
        var $this   = $(this);
        var $parent = $this.parent();
        var name    = $parent.attr("title");
        if ($parent.hasClass("active")) {
            docs[name] = window.editor.getValue();
        }
        // TODO: save a refference directly to the element on the tab or something like
        $('#projects .browser .project:contains("'+name+'")').children(".open").remove();
        $parent.remove();
        var $prev = $tabs.children('[title*="'+prev+'"]');
        if ($prev[0]) {
            $prev.mousedown();
        } else
        if ($tabs.children()[0]){
            $tabs.children().first().mousedown();
        } else {
            $editor.hide();
        }
    });

});
