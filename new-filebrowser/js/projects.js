/* global $ */
$(window).ready(function() {
    var $projects = $("#projects");
    var $browser  = $projects.find(".browser");
    var $tabs     = $("#tabs");
    var $editor   = $("#editor");

    $browser.on("click", ".project:not(.open) .entypo-folder, .project:not(.open) .entypo-plus", function(e) {
        var $this = $(this);
        $browser.children(".project").attr("style", "");
        $this.parent().addClass("open")
        .find(".entypo-plus").removeClass("entypo-plus").addClass("entypo-minus");
    });

    $browser.on("click", ".project.open .entypo-folder, .project.open .entypo-minus", function(e) {
        var $this = $(this);
        $this.parent().removeClass("open")
        .find(".entypo-minus").removeClass("entypo-minus").addClass("entypo-plus");
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
            var name = $tabs.children(".open").attr("title");
            window.docs[name] = window.editor.getValue();
            if (!$tabs.children()[0]) {
                $editor.show();
            }
            $tabs.append(''+
                '<div class="tab" title="'+text+'">'+
                    '<div class="text">'+text+'</div>'+
                    '<div class="x">✖</div>'+
                '</div>'
            ).children().last().mousedown();
            var $pencil = $('<div class="open"><div class="entypo-pencil"></div></div>');
            $this.find('[class*="entypo-"]').first().after($pencil);
        }
    });
});
