/* global $ */
$(window).ready(function() {

    var $tabs = $("#tabs .tab");
    var $xs   = $("#tabs .x");

    var current = 0;
    var prev    = 0;
    var docs    = {};

    $tabs.mousedown(function(e) {
        var $this   = $(this);
        var $target = $(e.target);
        if ($target.hasClass("x") || $this.hasClass("active")) {
            return;
        }
        docs[$tabs.index($tabs.filter(".active"))] = window.editor.getValue();
        $tabs.removeClass("active");
        $this.addClass("active");
        prev    = current;
        current = $tabs.index($this);
        window.editor.setValue(docs[current]);
        window.editor.clearSelection();
    });

    $xs.click(function() {
        var $this   = $(this);
        var $parent = $this.parent();
        docs[$tabs.index($parent)] = "";
        $parent.remove();
        $($tabs[prev]).mousedown();
    });

});
