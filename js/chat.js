/* global $ */
$(window).ready(function() {
    var $chat = $("#chat");
    var $conv = $chat.find(".conversation");
    var $form = $chat.find(".submit-form");
    var $txta = $form.find("textarea");

    var count    = 0;
    var colors   = ["3f3","f33"];
    var my_color = "33f";
    var flag     = 0;

    function scrollBottom() {
        var $messages = $conv.find(".message");
        $conv[0].scrollTop = (20 + $messages.height()) * $messages.length;
    }

    setInterval(function() {
        $conv.append('<div class="message select" style="border-left-color:#'+colors[flag * -1]+';">Random message '+count+'</div>');
        flag = ~flag;
        count++;
        scrollBottom();
        if ($chat.is(":visible")) return;
        $("#left-bar .entypo-comment").addClass("alert");
    }, 15000); // 15 seconds

    $form.find("button").click(function() {
        var text = $txta.val();
        var msg  = $('<div class="message select" style="border-left-color:#'+my_color+';"></div>');
        msg.text(text);
        $txta.val("");
        $conv.append(msg);
        scrollBottom();
    });
});
