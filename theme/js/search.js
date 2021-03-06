(function($) {
    var tipuesearch_stop_words = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];
    var tipuesearch_replace = {'words': [
        {'word': 'tipua', 'replace_with': 'tipue'},
        {'word': 'javscript', 'replace_with': 'javascript'},
        {'word': 'jqeury', 'replace_with': 'jquery'}
    ]};
    var tipuesearch_weight = {'weight': [
        {'url': 'http://www.tipue.com', 'score': 200},
        {'url': 'http://www.tipue.com/search', 'score': 100},
        {'url': 'http://www.tipue.com/about', 'score': 100}
    ]};
    var tipuesearch_stem = {'words': [
        {'word': 'e-mail', 'stem': 'email'},
        {'word': 'javascript', 'stem': 'jquery'},
        {'word': 'javascript', 'stem': 'js'}
    ]};
    var tipuesearch_string_1 = 'No title';
    var tipuesearch_string_2 = 'Showing results for';
    var tipuesearch_string_3 = 'Search instead for';
    var tipuesearch_string_4 = '1 result';
    var tipuesearch_string_5 = 'results';
    var tipuesearch_string_6 = '&laquo;';
    var tipuesearch_string_7 = '&raquo;';
    var tipuesearch_string_8 = 'Nothing found';
    var tipuesearch_string_9 = 'Common words are largely ignored';
    var tipuesearch_string_10 = 'Search too short';
    var tipuesearch_string_11 = 'Should be one character or more';
    var tipuesearch_string_12 = 'Should be';
    var tipuesearch_string_13 = 'characters or more';

    $.fn.tipuesearch = function(options) {
        var set = $.extend( {
            'show'                   : 7,
            'newWindow'              : false,
            'showTitleCount'         : false,
            'showResultCount'        : true,
            'minimumLength'          : 2,
            'descriptiveWords'       : 25,
            'highlightTerms'         : true,
            'highlightEveryTerm'     : false,
            'mode'                   : 'static',
            'liveDescription'        : '*',
            'liveContent'            : '*',
            'form'                   : 'tipue_search_input',
            'debug'                  : false
        }, options);
        return this.each(function() {
            var tipuesearch_in = {
                pages: []
            };
            $.ajaxSetup({
                async: false
            });
            var tipuesearch_t_c = 0;
            if (set.mode == 'static') {
                tipuesearch_in = $.extend({}, tipuesearch);
            }
            var tipue_search_w = '';
            if (set.newWindow) {
                tipue_search_w = ' target="_blank"';
            }
            function getURLP(name) {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) || null;
            }
            if (getURLP('q')) {
                $('#' + set.form).val(getURLP('q'));
                getTipueSearch(0, true);
            }

            $(this).keyup(function(event) {
                if(event.keyCode == '13') {
                    getTipueSearch(0, true);
                }
            });

            function getTipueSearch(start, replace) {
                var out = '';
                var out1 = '';
                var results = '';
                var show_replace = false;
                var show_stop = false;
                var standard = true;
                var c = 0;
                found = [];

                var d = $('#' + set.form).val().toLowerCase();
                d = $.trim(d);

                if ((d.match("^\"") && d.match("\"$")) || (d.match("^'") && d.match("'$"))) {
                    standard = false;
                }

                if (standard) {
                    var d_w = d.split(' ');
                    d = '';
                    for (var i = 0; i < d_w.length; i++) {
                        var a_w = true;
                        for (var f = 0; f < tipuesearch_stop_words.length; f++) {
                            if (d_w[i] == tipuesearch_stop_words[f])
                            {
                                a_w = false;
                                show_stop = true;
                            }
                        }
                        if (a_w) {
                            d = d + ' ' + d_w[i];
                        }
                    }
                    d = $.trim(d);
                    d_w = d.split(' ');
                } else {
                    d = d.substring(1, d.length - 1);
                }

                if (d.length >= set.minimumLength) {
                    if (standard) {
                        if (replace) {
                            var d_r = d;
                            for (var i = 0; i < d_w.length; i++) {
                                for (var f = 0; f < tipuesearch_replace.words.length; f++) {
                                    if (d_w[i] == tipuesearch_replace.words[f].word) {
                                        d = d.replace(d_w[i], tipuesearch_replace.words[f].replace_with);
                                        show_replace = true;
                                    }
                                }
                            }
                            d_w = d.split(' ');
                        }

                        var d_t = d;
                        for (var i = 0; i < d_w.length; i++) {
                            for (var f = 0; f < tipuesearch_stem.words.length; f++) {
                                if (d_w[i] == tipuesearch_stem.words[f].word) {
                                    d_t = d_t + ' ' + tipuesearch_stem.words[f].stem;
                                }
                            }
                        }
                        d_w = d_t.split(' ');

                        for (var i = 0; i < tipuesearch_in.pages.length; i++) {
                            var score = 0;
                            var s_t = tipuesearch_in.pages[i].text;
                            for (var f = 0; f < d_w.length; f++) {
                                var pat = new RegExp(d_w[f], 'gi');
                                if (tipuesearch_in.pages[i].title.search(pat) != -1) {
                                    var m_c = tipuesearch_in.pages[i].title.match(pat).length;
                                    score += (20 * m_c);
                                }
                                if (tipuesearch_in.pages[i].text.search(pat) != -1) {
                                    var m_c = tipuesearch_in.pages[i].text.match(pat).length;
                                    score += (20 * m_c);
                                }

                                if (set.highlightTerms) {
                                    if (set.highlightEveryTerm) {
                                        var patr = new RegExp('(' + d_w[f] + ')', 'gi');
                                    }
                                    else {
                                        var patr = new RegExp('(' + d_w[f] + ')', 'i');
                                    }
                                    s_t = s_t.replace(patr, "<span class=\"h01\">$1</span>");
                                }

                                if (tipuesearch_in.pages[i].tags.search(pat) != -1) {
                                    var m_c = tipuesearch_in.pages[i].tags.match(pat).length;
                                    score += (10 * m_c);
                                }

                                if (tipuesearch_in.pages[i].url.search(pat) != -1) {
                                    score += 20;
                                }

                                if (score != 0) {
                                    for (var e = 0; e < tipuesearch_weight.weight.length; e++) {
                                        if (tipuesearch_in.pages[i].url == tipuesearch_weight.weight[e].url) {
                                            score += tipuesearch_weight.weight[e].score;
                                        }
                                    }
                                }

                                if (d_w[f].match('^-')) {
                                    pat = new RegExp(d_w[f].substring(1), 'i');
                                    if (tipuesearch_in.pages[i].title.search(pat) != -1 || tipuesearch_in.pages[i].text.search(pat) != -1 || tipuesearch_in.pages[i].tags.search(pat) != -1) {
                                        score = 0;
                                    }
                                }
                            }

                            if (score != 0) {
                                found.push({
                                    "score": score,
                                    "title": tipuesearch_in.pages[i].title,
                                    "desc": s_t,
                                    "url": tipuesearch_in.pages[i].url
                                });
                                c++;
                            }
                        }
                    } else {
                        for (var i = 0; i < tipuesearch_in.pages.length; i++) {
                            var score = 0;
                            var s_t = tipuesearch_in.pages[i].text;
                            var pat = new RegExp(d, 'gi');
                            if (tipuesearch_in.pages[i].title.search(pat) != -1) {
                                var m_c = tipuesearch_in.pages[i].title.match(pat).length;
                                score += (20 * m_c);
                            }
                            if (tipuesearch_in.pages[i].text.search(pat) != -1) {
                                var m_c = tipuesearch_in.pages[i].text.match(pat).length;
                                score += (20 * m_c);
                            }

                            if (set.highlightTerms) {
                                if (set.highlightEveryTerm) {
                                    var patr = new RegExp('(' + d + ')', 'gi');
                                } else {
                                    var patr = new RegExp('(' + d + ')', 'i');
                                }
                                s_t = s_t.replace(patr, "<span class=\"h01\">$1</span>");
                            }

                            if (tipuesearch_in.pages[i].tags.search(pat) != -1) {
                                var m_c = tipuesearch_in.pages[i].tags.match(pat).length;
                                score += (10 * m_c);
                            }

                            if (tipuesearch_in.pages[i].url.search(pat) != -1) {
                                score += 20;
                            }

                            if (score != 0) {
                                for (var e = 0; e < tipuesearch_weight.weight.length; e++) {
                                    if (tipuesearch_in.pages[i].url == tipuesearch_weight.weight[e].url) {
                                        score += tipuesearch_weight.weight[e].score;
                                    }
                                }
                            }

                            if (score != 0) {
                                found.push({
                                    "score": score,
                                    "title": tipuesearch_in.pages[i].title,
                                    "desc": s_t,
                                    "url": tipuesearch_in.pages[i].url
                                });
                                c++;
                            }
                        }
                    }

                    if (c != 0) {
                        if (set.showTitleCount && tipuesearch_t_c == 0) {
                            var title = document.title;
                            document.title = '(' + c + ') ' + title;
                            tipuesearch_t_c++;
                        }
                        found.sort(function(a, b) { return b.score - a.score } );

                        if (show_replace == 1) {
                            out1 += '<div id="entry-search-warning">' + tipuesearch_string_2 + ' ' + d + '. ' + tipuesearch_string_3 + ' <a id="entry-search-replaced">' + d_r + '</a></div>';
                        }
                        if (set.showResultCount) {
                            if (c == 1) {
                                out1 += '<div>' + tipuesearch_string_4 + '</div>';
                            } else {
                                c_c = c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                out1 += '<div>' + c_c + ' ' + tipuesearch_string_5 + '</div>';
                            }
                        }

                        out += '<ul class="entry-list" style="margin:0;padding:0;">';
                        var l_o = 0;
                        for (var i = 0; i < found.length; i++) {
                            if (l_o >= start && l_o < set.show + start) {
                                out += '<li><article>';
                                out += '<div class="entry-header"><h1 class="entry-title"><a href="' + found[i].url + '"' + tipue_search_w + '>' +  found[i].title + '</a></h1></div>';
                                // if (set.debug) {
                                //     out += '<div class="entry-search-content_debug">Score: ' + found[i].score + '</div>';
                                // }
                                if (found[i].desc) {
                                    var t = found[i].desc;
                                    var t_d = '';
                                    var t_w = t.split(' ');
                                    if (t_w.length < set.descriptiveWords) {
                                        t_d = t;
                                    } else {
                                        for (var f = 0; f < set.descriptiveWords; f++) {
                                            t_d += t_w[f] + ' ';
                                        }
                                    }
                                    t_d = $.trim(t_d);
                                    if (t_d.charAt(t_d.length - 1) != '.') {
                                        t_d += ' ...';
                                    }
                                    out += '<div class="entry-content">' + t_d + '</div>';
                                    out += '<div class="text-center"><a class="btn entry-read-more" href="' + found[i].url +'">read more »</a></div>';
                                }
                                out += '</article></li>';
                            }
                            l_o++;
                        }

                        if (c > set.show) {
                            var pages = Math.ceil(c / set.show);
                            var page = (start / set.show);
                            out += '<ul class="entry-pagination">';

                            if (start > 0) {
                                out += '<li><a class="pre entry-pagination-ref" id="' + (start - set.show) + '_' + replace + '">' + tipuesearch_string_6 + '</a></li>';
                            }

                            if (page <= 2) {
                                var p_b = pages;
                                if (pages > 3) {
                                    p_b = 3;
                                }
                                for (var f = 0; f < p_b; f++) {
                                    if (f == page) {
                                        out += '<li class="active"><a>' + (f + 1) + '</a></li>';
                                    } else {
                                        out += '<li><a class="entry-pagination-ref" id="' + (f * set.show) + '_' + replace + '">' + (f + 1) + '</a></li>';
                                    }
                                }
                            } else {
                                var p_b = page + 2;
                                if (p_b > pages) {
                                    p_b = pages;
                                }
                                for (var f = page - 1; f < p_b; f++) {
                                    if (f == page)
                                    {
                                        out += '<li class="active"><a>' + (f + 1) + '</a></li>';
                                    }
                                    else
                                    {
                                        out += '<li><a class="entry-pagination-ref" id="' + (f * set.show) + '_' + replace + '">' + (f + 1) + '</a></li>';
                                    }
                                }
                            }

                            if (page + 1 != pages) {
                                out += '<li><a class="next entry-pagination-ref" id="' + (start + set.show) + '_' + replace + '">' + tipuesearch_string_7 + '</a></li>';
                            }

                            out += '</ul>';
                        }
                        out += '</ul>';
                    } else {
                        out1 += '<div id="entry-search-warning">' + tipuesearch_string_8 + '</div>';
                    }
                } else {
                    if (show_stop) {
                        out1 += '<div id="entry-search-warning">' + tipuesearch_string_8 + '. ' + tipuesearch_string_9 + '</div>';
                    } else {
                        out1 += '<div id="entry-search-warning">' + tipuesearch_string_10 + '</div>';
                        if (set.minimumLength == 1) {
                            out1 += '<div id="entry-search-warning">' + tipuesearch_string_11 + '</div>';
                        } else {
                            out1 += '<div id="entry-search-warning">' + tipuesearch_string_12 + ' ' + set.minimumLength + ' ' + tipuesearch_string_13 + '</div>';
                        }
                    }
                }
                $('#entry-search-count').hide();
                $('#entry-search-count').html(out1);
                $('#entry-search-count').slideDown(200);

                $('#entry-search-content').hide();
                $('#entry-search-content').html(out);
                $('#entry-search-content').slideDown(200);

                if (out) {
                    $(".entry-search-count").css("padding-bottom", "0");
                }

                $('#entry-search-replaced').click(function() {
                    getTipueSearch(0, false);
                });

                $('.entry-pagination-ref').click(function() {
                    var id_v = $(this).attr('id');
                    var id_a = id_v.split('_');
                    getTipueSearch(parseInt(id_a[0]), id_a[1]);
                });
            }

        });
    };

    $('#entry-search-content').tipuesearch({
        form: "entry-search",
        show: 10,
        showURL:false,
        mode: 'static'
    });
})(jQuery);
