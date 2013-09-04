/*global window:false*/

(function() {
    "use strict";

    var win = window, doc = win.document;

    var default_text = 'We use cookies to enhance your experience. ' +
        'By continuing to visit this site you agree to our use of cookies.';

    var default_link = 'Learn more';

    var script = (function() {
        var scripts = doc.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].id == 'cookiebanner') return scripts[i];
        }
    })();

    if (script === undefined) return;

    function on(el, ev, fn) { el.addEventListener(ev, fn, false); }

    function onReady(fn) {
        on(doc, 'readystatechange', function() {
            if (doc.readyState == 'complete') fn();
        });
    }

    function getScriptData(key, dfl) {
        var val = script.dataset[key];
        if (val === undefined) val = dfl;
        return val;
    }

    function getCookie() {
        var cookie_name = getScriptData('cookie', 'cookiebanner-accepted');

        var cookies = doc.cookie.split(/;\s+/);
        for (var i = 0; i < cookies.length; i++) {
            var pair = cookies[i].split('=');
            if (pair[0] == cookie_name) {
                return true;
            }
        }
        return false;
    }

    function setCookie() {
        var cookie_name = getScriptData('cookie', 'cookiebanner-accepted');
        doc.cookie = cookie_name + "=true";
    }

    function show_el() {
        var el = doc.createElement('div');
        el.class = "cookiebanner";
        el.style.position = "fixed";
        el.style.left = 0;
        el.style.right = 0;
        el.style.height = getScriptData('height', '32px');
        el.style.zIndex = 255;
        el.style.background = getScriptData('bg', '#000');
        el.style.color = getScriptData('fg', '#ddd');
        el.style.lineHeight = el.style.height;
        el.style.paddingLeft = '16px';
        el.style.paddingRight = '16px';
        el.style.fontFamily = "arial, sans-serif";
        el.style.fontSize = '14px';

        if (getScriptData('position', 'bottom') == 'top') {
            el.style.top = 0;
        } else {
            el.style.bottom = 0;
        }

        el.innerHTML = '<span>' + getScriptData('message', default_text) +
            ' <a>' + getScriptData('linkmsg', default_link) + '</a></span>' +
            '<div style="float: right;">&#10006;</div>';

        var el_a = el.getElementsByTagName('a')[0];
        el_a.href = getScriptData('moreinfo', 'http://aboutcookies.org/');
        el_a.target = '_blank';
        el_a.style.textDecoration = 'none';
        el_a.style.color = getScriptData('link', '#aaa');

        var el_x = el.getElementsByTagName('div')[0];
        el_x.style.float = 'right';
        el_x.style.cursor = 'pointer';

        doc.body.appendChild(el);

        if (getScriptData('effect') == 'fade') {
            el.style.opacity = 0;
            var fadeIn = function() {
                if (el.style.opacity < 1) {
                    el.style.opacity = parseFloat(el.style.opacity) + 0.05;
                    win.setTimeout(fadeIn, 50);
                }
            };
            fadeIn();
        } else {
            el.style.opacity = 1;
        }

        on(el_x, 'click', function() {
            setCookie();
            doc.body.removeChild(el);
        });
    }

    if (!getCookie()) {
        onReady(show_el);
    }
})();
