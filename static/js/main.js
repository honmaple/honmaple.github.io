$(document).ready(function () {
    $("pre").css("max-height", $(window).height() / 1.5);
    var e = $(".back-to-top");
    var titles = document.getElementsByClassName("entry-title");
    $(window).on("scroll", function () {
        var navbar = $(".navbar");
        var height = $(".navbar").height();
        // 整个文档的高度 - navbar高度 > 显示高度
        // navbar高度110， margin-bottom高度20
        var toggle = height == 110 ? document.body.scrollHeight - document.body.offsetHeight > 130 : true;

        e.toggleClass("back-to-top-on", window.pageYOffset >= 120);
        navbar.toggleClass("navbar-fixed", window.pageYOffset >= height && toggle);

        if (window.innerWidth >= 1280) {
            var scrollTop = window.pageYOffset;
            var currentTitle = document.getElementById("navbar-title");
            if (scrollTop > height) {
                for (var i = titles.length - 1; i >= 0; i--) {
                    if (scrollTop > titles[i].offsetTop - titles[i].offsetHeight) {
                        if (!currentTitle) {
                            currentTitle = document.createElement("li");
                            currentTitle.id = "navbar-title"
                            $(".navbar-nav").prepend(currentTitle);
                        }
                        currentTitle.innerHTML = `<a>${titles[i].innerText}</a>`;
                        break
                    }
                }
            } else {
                if (currentTitle) {
                    currentTitle.remove();
                }
            }
        }
        // scrollbar
        if ($(".scrollbar").length) {
            var a = $(window).scrollTop();
            var b = $(window).height();
            var c = $(document).height();
            if (c === b) {
                $(".scrollbar").width("100%");
            } else {
                $(".scrollbar").width(a / (c - b) * 100 + "%");
            }
        }
    });
    e.click(function () {
        window.scrollTo(0, 0);
    });
    $('[data-fancybox]').fancybox({
        protect: true
    });
    $(".entry-comment").click(function () {
        var dsq = document.createElement('script');
        var thr = document.getElementById('comment_thread');
        var theme = localStorage.getItem("theme") == "theme-tree" ? "dark_dimmed" : "light";
        dsq.type = 'text/javascript';
        dsq.src = 'https://giscus.app/client.js';
        dsq.setAttribute('data-repo', 'honmaple/honmaple.github.io');
        dsq.setAttribute('data-repo-id', 'MDEwOlJlcG9zaXRvcnk0MTY4ODc2MQ==');
        dsq.setAttribute('data-category', 'Announcements');
        dsq.setAttribute('data-category-id', 'DIC_kwDOAnweuc4CVokl');
        dsq.setAttribute('data-mapping', 'specific');
        dsq.setAttribute('data-term', thr.getAttribute('issue-term'));
        dsq.setAttribute('data-strict', '0');
        dsq.setAttribute('data-reactions-enabled', '0');
        dsq.setAttribute('data-emit-metadata', '0');
        dsq.setAttribute('data-input-position', 'bottom');
        dsq.setAttribute('data-theme', theme);
        dsq.setAttribute('data-lang', 'zh-CN');
        dsq.setAttribute('crossorigin', 'anonymous');

        thr.appendChild(dsq);
        $(".entry-comment").parent().fadeToggle(800);
    });
    $(".navbar-logo").error(function () {
        var content = '<span class="navbar-title">' + $(".navbar-logo").attr("alt") + '</span>';
        $(".navbar-logo").parent().html(content);
    });
    $(".encrypt-container .encrypt-form input").keyup(function (e) {
        if (e.keyCode == 13) {
            decrypt($(this).get(0));
        }
    });
    $(".encrypt-container .encrypt-form i").click(function (e) {
        decrypt($(this).get(0));
    });
});
