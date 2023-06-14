$(document).ready(function () {
    $("pre").css("max-height", $(window).height() / 1.5);
    var e = $(".back-to-top");
    var navbar = $(".entry-navbar");
    var titles = document.querySelectorAll(".entry-article-title");
    var lastYOffset = window.pageYOffset;
    $(window).on("scroll", function () {
        var height = navbar.height();
        var scrollTop = window.pageYOffset;
        // 整个文档的高度 - navbar高度 > 显示高度
        // navbar高度110， margin-bottom高度20
        if (navbar.hasClass("entry-navbar-fixed")) {
            if (scrollTop < lastYOffset && scrollTop <= 10) {
                navbar.removeClass("entry-navbar-fixed");
            }
        } else {
            if (scrollTop > lastYOffset && scrollTop >= height && document.body.scrollHeight - document.body.offsetHeight - height > 10) {
                navbar.addClass("entry-navbar-fixed");
            }
        }

        if (window.innerWidth >= 1280) {
            var currentTitle = document.getElementById("navbar-title");
            if (scrollTop > height) {
                for (var i = titles.length - 1; i >= 0; i--) {
                    if (scrollTop > titles[i].offsetTop - titles[i].offsetHeight) {
                        if (!currentTitle) {
                            currentTitle = document.createElement("li");
                            currentTitle.id = "navbar-title"
                            $(".entry-navbar-menu").prepend(currentTitle);
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
        lastYOffset = window.pageYOffset;
        // back to top
        e.toggleClass("on", window.pageYOffset >= 120);
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
    $(".encrypt-container .encrypt-form input").keyup(function (e) {
        if (e.keyCode == 13) {
            decrypt($(this).get(0));
        }
    });
    $(".encrypt-container .encrypt-form i").click(function (e) {
        decrypt($(this).get(0));
    });
});

document.addEventListener("DOMContentLoaded", () => {
    let elements = document.querySelectorAll('[data-toggle="collapse"]');
    elements.forEach((element, index) => {
        if (element.dataset.target) {
            element.addEventListener("click", () => {
                let target = document.querySelector(element.dataset.target);
                if (target) {
                    target.classList.toggle('in');
                }
            })
        }
    });
});
