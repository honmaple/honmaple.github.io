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
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'? args[number]: match;
            });
        };
    }
    if ($(window).width() > 600) {
        $.ajax({
            type: "GET",
            url: "https://poem.honmaple.com/api/poem/random",
            dataType: "json",
            success: function (response) {
                var title = '<h3>{0}</h3>'.format(response.data.title);
                var author = '<p>{0}</p>'.format(response.data.author);
                var paragraphs = '<div>{0}</div>'.format(response.data.paragraphs.map(function(item) {
                    return "<p>{0}</p>".format(item);
                }).join(""));
                $(".entry-cover > .entry-cover-right > .entry-center").fadeOut(500, function() {
                    $(this).html(title + author + paragraphs).fadeIn(500);
                });
            }
        });
    }
    function scrollUp() {
        if ($(window).scrollTop() < $(window).height() && $(".entry-cover").length && !$(".entry-cover").is(":hidden")) {
            $("html, body").animate({
                scrollTop: 0
            }, 600);
        }
    }
    function scrollDown() {
        if ($(window).scrollTop() < $(window).height() && $(".entry-cover").length && !$(".entry-cover").is(":hidden")) {
            $(".entry-cover-left").fadeOut(300);
            $(".entry-cover").slideUp(600);
        }
    }
    $(document).keydown(function(e) {
        if (e.keyCode == 40) { scrollDown(); }
        if (e.keyCode == 34) { scrollDown(); }
    });
    $(window).on('wheel', function(event) {
        if (event.originalEvent.deltaY > 0) {
            scrollDown();
        }else {
            scrollUp();
        }
    });
    var startPos = {
        Top:-1,
        Y:0
    };
    $("body").on('touchstart', function(e) {
        startPos = {
            Top: $(window).scrollTop(),
            Y: e.originalEvent.changedTouches[0].pageY
        };
    });
    $("body").on("touchend", function(e) {
        var pageY = e.originalEvent.changedTouches[0].pageY - startPos.Y;
        if (pageY > 0) {
            scrollUp();
        }else if (pageY  < 0) {
            scrollDown();
        }
    });
}
