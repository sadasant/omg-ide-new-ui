/* global $ */
$(window).ready(function() {
    var $projects = $("#projects");
    var $browser  = $projects.find(".browser");
    var $tabs     = $("#tabs");

    $browser.on("click", ".project:not(.active) .entypo-folder", function(e) {
        var $this = $(this);
        $browser.children(".project").attr("style", "");
        $this.parent().addClass("active");
    });

    $browser.on("click", ".project.active .entypo-folder", function(e) {
        var $this = $(this);
        $this.parent().removeClass("active");
        $browser.children(".project").show();
    });

    $browser.on("click", ".project", function(e) {
        var $this = $(this);
        if (!$this.children(".entypo-doc-text")[0]) {
            return;
        }
        var text = $this.text().trim();
        if ($this.children(".open")[0]) {
            $tabs.find('[title*="'+text+'"]').mousedown();
        } else {
            var name = $tabs.children(".active").attr("title");
            window.docs[name] = window.editor.getValue();
            $tabs.append(''+
                '<div class="tab" title="'+text+'">'+
                    '<div class="text">'+text+'</div>'+
                    '<div class="x">✖</div>'+
                '</div>'
            ).children().last().mousedown();
            $this.prepend('<div class="open"><div class="entypo-eye"></div></div>');
        }
    });
});
