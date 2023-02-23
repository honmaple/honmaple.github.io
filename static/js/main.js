$(document).ready(function(){
    $("pre").css("max-height", $(window).height());
    var e = $(".back-to-top");
    $(window).on("scroll", function() {
        var offsetHeight = document.body.offsetHeight;
        var scrollHeight = document.body.scrollHeight;
        var navbarFixed = scrollHeight > offsetHeight && scrollHeight - offsetHeight > 243;
        e.toggleClass("back-to-top-on", window.pageYOffset > 120);
        if (navbarFixed) {
            $(".navbar").toggleClass("navbar-fixed", window.pageYOffset > 120);
            if (!$("#navbar-title").length && window.pageYOffset > 120 && window.innerWidth > 1280 && $(".entry-title").length == 1) {
                $(".navbar-header").after('<div class="navbar-text" id="navbar-title">' + $(".entry-title").text() + '</div>');
            }
            if ($("#navbar-title").length && window.pageYOffset < 120) {
                $("#navbar-title").remove();
            }
        }
        // scrollbar
        if ($(".scrollbar").length) {
            var a = $(window).scrollTop();
            var b = $(window).height();
            var c = $(document).height();
            if (c === b) {
                $(".scrollbar").width("100%");
            }else {
                $(".scrollbar").width(a / (c - b) * 100 + "%");
            }
        }
    });
    e.click(function() {
        window.scrollTo(0, 0);
    });
    $('[data-fancybox]').fancybox({
        protect: true
    });
    $("#entry-cover").click(function() {
        $(".entry-cover-left").fadeOut(600);
        $(".entry-cover").slideUp(600);
    });

    $(".entry-comment").click(function() {
        var dsq = document.createElement('script');
        var thr = document.getElementById('comment_thread')
        dsq.type = 'text/javascript';
        dsq.src = 'https://utteranc.es/client.js';
        dsq.setAttribute('repo', 'honmaple/honmaple.github.io');
        dsq.setAttribute('issue-term', thr.getAttribute('issue-term'));
        dsq.setAttribute('label', 'comment');
        dsq.setAttribute('theme', 'github-light');
        dsq.setAttribute('crossorigin', 'anonymous');

        thr.appendChild(dsq);
        $(".entry-comment").parent().fadeToggle(800);
    });
    $(".entry-switch-theme").click(function() {
        switchTheme();
    });
    $(".navbar-logo").error(function() {
        var content = '<span class="navbar-title">' + $(".navbar-logo").attr("alt") + '</span>';
        $(".navbar-logo").parent().html(content);
    });

    $(".encrypt-container .encrypt-form input").keyup(function(e){
      if(e.keyCode == 13) {
        decrypt($(this).get(0));
      }
    });
    $(".encrypt-container .encrypt-form i").click(function(e) {
        decrypt($(this).get(0));
    });
});
