function ISPC() {
    var userAgentInfo = navigator.userAgent;
    var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < agents.length; v++) {
        if (userAgentInfo.indexOf(agents[v]) > -1) {
            flag = false;
            break;
        }
    }
    return flag;
}
function Cover() {
    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    };
    if ($(window).width() > 768) {
        $.ajax({
            type: "GET",
            url: "https://shici.honmaple.com/api/poems?sort=random&limit=1",
            dataType: "json",
            success: function (response) {
                if (response.data.list.length > 0) {
                    var data = response.data.list[0];
                    var title = '<h3>{0}</h3>'.format(data.title);
                    var author = '<p>{0}</p>'.format(data.author.name);
                    var content = '<div>{0}</div>'.format(data.content.split("\n").map(function (item) {
                        return "<p>{0}</p>".format(item);
                    }).join(""));
                    $(".entry-cover > .entry-cover-right").fadeOut(500, function () {
                        $(this).html(title + author + content).fadeIn(500);
                    });
                }
            }
        });
    };

    function scrollDown() {
        if ($(window).scrollTop() < $(window).height() && !$(".entry-cover").is(":hidden")) {
            $(".entry-cover-left").fadeOut(300);
            $(".entry-cover").slideUp(600);
        }
    }
    $(document).keydown(function (e) {
        if (e.keyCode == 40) { scrollDown(); }
        if (e.keyCode == 34) { scrollDown(); }
    });
    $(window).on('wheel', function (event) {
        if (event.originalEvent.deltaY > 0) {
            scrollDown();
        }
    });
    $("#entry-cover").click(function () {
        $(".entry-cover-left").fadeOut(600);
        $(".entry-cover").slideUp(600);
    });
    var startPos = {
        Top: -1,
        Y: 0
    };
    $("body").on('touchstart', function (e) {
        startPos = {
            Top: $(window).scrollTop(),
            Y: e.originalEvent.changedTouches[0].pageY
        };
    });
    $("body").on("touchend", function (e) {
        var pageY = e.originalEvent.changedTouches[0].pageY - startPos.Y;
        if (pageY < 0) {
            scrollDown();
        }
    });
}

$(document).ready(function () {
    if (document.querySelector(".entry-cover")) {
        Cover();
    }
});
