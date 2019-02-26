function dispatch() {
    var q = document.getElementById("search");
    if (q.value !== "") {
        var url = 'https://www.google.com/search?q=site:honmaple.me%20' + q.value;
        if (navigator.userAgent.indexOf('iPad') > -1 || navigator.userAgent.indexOf('iPod') > -1 || navigator.userAgent.indexOf('iPhone') > -1) {
            location.href = url;
        } else {
            window.open(url, "_blank");
        }
        return false;
    } else {
        return false;
    }
}

function decrypt(_this) {
    var _next = _this.next();
    if (_this.prev().val() === "" ){
        _next.css("color","#C74451");
        _next.text("密码不能为空 !");
    }else {
        $.post("https://honmaple.com/api/encrypt", {
            password:_this.prev().val(),
            content:_this.parent().next().text()
        }, function(response){
            var _parent = _this.parent().parent();
            _parent.hide();
            _parent.after(response.data);
        }, 'json').fail(function() {
            _next.css("color","#C74451");
            _next.text("密码错误 !");
        });
    }
}

$(document).ready(function(){
    $("pre").css("max-height", $(window).height());
    var e = $(".back-to-top");
    var offsetHeight = document.body.offsetHeight;
    var scrollHeight = document.body.scrollHeight;
    var navbarFixed = scrollHeight > offsetHeight && scrollHeight - offsetHeight > 243;
    // if (scrollHeight > offsetHeight && scrollHeight - offsetHeight < 243) {
    //     $(".footer").css("margin-top", 3 + (offsetHeight - scrollHeight + 243) + "px");
    // }
    $(window).on("scroll", function() {
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
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = 'https://honmaple.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        $(".entry-comment").parent().fadeToggle(800);
    });
    $(".entry-theme").click(function() {
        toggleTheme();
    });
    $(".navbar-logo").error(function() {
        var content = '<span class="navbar-title">' + $(".navbar-logo").attr("alt") + '</span>';
        $(".navbar-logo").parent().html(content);
    });

    $('#entry-decrypt-password').keyup(function(e){
        if(e.keyCode == 13)
        {
            decrypt($(this).next());
        }
    });

    $(".entry-decrypt").click(function(e) {
        decrypt($(this));
    });

    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 100,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ddd"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                },
                "image": {
                    "src": "img/github.svg",
                    "width": 100,
                    "height": 100
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 36,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 120,
                "color": "#999",
                "opacity": 0.6,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 15,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "window",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "repulse"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 200,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 800,
                    "size": 80,
                    "duration": 2,
                    "opacity": 0.8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
});
