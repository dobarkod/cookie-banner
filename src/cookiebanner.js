/*global window:false*/

(function() {
    'use strict';

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

    /*!
     * contentloaded.js
     *
     * Author: Diego Perini (diego.perini at gmail.com)
     * Summary: cross-browser wrapper for DOMContentLoaded
     * Updated: 20101020
     * License: MIT
     * Version: 1.2
     *
     * URL:
     * http://javascript.nwbox.com/ContentLoaded/
     * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
     *
     */
    // @win window reference
    // @fn function reference
    function contentLoaded(win, fn) {

        var done = false, top = true,
        doc = win.document, root = doc.documentElement,

        add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
        rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
        pre = doc.addEventListener ? '' : 'on',

        init = function(e) {
            if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
            (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
            if (!done && (done = true)) fn.call(win, e.type || e);
        },

        poll = function() {
            try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
            init('poll');
        };

        if (doc.readyState == 'complete') fn.call(win, 'lazy');
        else {
            if (doc.createEventObject && root.doScroll) {
                try { top = !win.frameElement; } catch(e) { }
                if (top) poll();
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }

    }
    
    var Cookies = {
        get: function (key) {
            return decodeURIComponent(doc.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
        },
        set: function (key, val, end, path, domain, secure) {
            if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
                return false;
            }
            var expires = '';
            if (end) {
                switch (end.constructor) {
                    case Number:
                        expires = end === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + end;
                        break;
                    case String:
                        expires = '; expires=' + end;
                    break;
                    case Date:
                        expires = '; expires=' + end.toUTCString();
                    break;
                }
            }
            doc.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(val) + expires + (domain ? '; domain=' + domain : '') + (path ? '; path=' + path : '') + (secure ? '; secure' : '');
            return true;
        },
        has: function (key) {
            return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(doc.cookie);
        }
        /*remove: function (key, path, domain) {
            if (!key || !this.has(key)) { return false; }
            doc.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + ( domain ? '; domain=' + domain : '') + ( path ? '; path=' + path : '');
            return true;
        },*/
    };

    function get_script_data(key, dfl) {
        var val;

        if (script.hasOwnProperty('dataset')) {
            val = script.dataset[key];
        } else {
            val = script.attributes['data-' + key];
            if (val !== undefined) val = val.value;
        }

        if (val === undefined) val = dfl;
        return val;
    }
    
    function str2bool(str) {
        str = '' + str;
        switch (str.toLowerCase()) {
            case 'false':
            case 'no':
            case '0':
            case '':
                return false; 
            default: 
                return true;
            }
    }
    
    function fade_in(el) {
        if (el.style.opacity < 1) {
            el.style.opacity = (parseFloat(el.style.opacity) + 0.05).toFixed(2);
            win.setTimeout(function(){
                fade_in(el);
            }, 50);
        }
    }

    var cookie_name = get_script_data('cookie', 'cookiebanner-accepted');
    var z_idx = parseInt(get_script_data('zindex', 255), 10);   

    function build_viewport_mask() {
        var create_mask = str2bool(get_script_data('mask', false));
        var mask = null;
        if (true === create_mask) {
            var mask_opacity = get_script_data('mask-opacity', 0.5);
            var bg = get_script_data('mask-background', '#000');
            var mask_markup = '<div id="cookiebanner-mask" style="' +
                'position:fixed;top:0;left:0;width:100%;height:100%;' + 
                'background:' + bg + ';zoom:1;filter:alpha(opacity=' + 
                (mask_opacity * 100) +');opacity:' + mask_opacity +';' +
                'z-index:' + z_idx +';"></div>';
            var el = doc.createElement('div');
            el.innerHTML = mask_markup;
            mask = el.firstChild;
        }
        return mask;
    }

    function inject_notice() {

        var mask = build_viewport_mask();
        if (mask) {
            // bump notice element's z-index so it's above the mask
            z_idx += 1;
        }

        var el = doc.createElement('div');
        el.className = 'cookiebanner';
        el.style.position = 'fixed';
        el.style.left = 0;
        el.style.right = 0;
        el.style.height = get_script_data('height', 'auto');
        el.style.minHeight = get_script_data('min-height', '21px');
        el.style.zIndex = z_idx;
        el.style.background = get_script_data('bg', '#000');
        el.style.color = get_script_data('fg', '#ddd');
        el.style.lineHeight = el.style.minHeight;
        el.style.padding = '5px 16px';
        el.style.fontFamily = 'arial, sans-serif';
        el.style.fontSize = '14px';

        if (get_script_data('position', 'bottom') == 'top') {
            el.style.top = 0;
        } else {
            el.style.bottom = 0;
        }

        el.innerHTML = '<div style="float:right;padding-left:5px;">&#10006;</div>' +
            '<span>' + get_script_data('message', default_text) +
            ' <a>' + get_script_data('linkmsg', default_link) + '</a></span>';

        var el_a = el.getElementsByTagName('a')[0];
        el_a.href = get_script_data('moreinfo', 'http://aboutcookies.org/');
        el_a.target = '_blank';
        el_a.style.textDecoration = 'none';
        el_a.style.color = get_script_data('link', '#aaa');

        var el_x = el.getElementsByTagName('div')[0];
        el_x.style.cursor = 'pointer';
        
        function agree() {
            Cookies.set(cookie_name, 1, Infinity, '/');
            doc.body.removeChild(el);
            if (mask) {
                doc.body.removeChild(mask);
            }
        }
        
        on(el_x, 'click', agree);

        if (mask) {
            on(mask, 'click', agree);
            doc.body.appendChild(mask);
        }

        doc.body.appendChild(el);
        
        if (get_script_data('effect') == 'fade') {
            el.style.opacity = 0;
            fade_in(el);
        } else {
            el.style.opacity = 1;
        }

    }

    if (!Cookies.has(cookie_name)) {
        contentLoaded(win, inject_notice);
    }

})();
