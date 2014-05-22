var script_src = '../src/cookiebanner.js';

var unsupported_features = function(){
    /**
    * Cookies don't work on Chromium-based browsers whilst
    * running the tests via the file:/// protocol
    * https://code.google.com/p/chromium/issues/detail?id=535
    *
    * Either start your Chromium-based browser with the
    * --enable-file-cookies flag or run the tests using a web server
    * https://code.google.com/p/chromium/issues/detail?id=535
    */
    if (window.chrome) {
        if ('file:' === window.location.protocol) {
            return 'Cookies cannot be tested on Chromium-based browsers whilst using the file:/// protocol';
        }
    }
};

var inject_script = function(e, id, data_attrs, where, t) {
    var n = document.createElement('script');
    n.type = 'text/javascript';
    n.async = true;
    if ('body' !== where) {
        where = 'head';
    }
    if (id) {
        n.id = id;
    }
    if (typeof data_attrs !== 'undefined') {
        for (var attr in data_attrs) {
            if (data_attrs.hasOwnProperty(attr)) {
                n.setAttribute('data-' + attr, data_attrs[attr]);
            }
        }
    }
    n.src = e;
    if (typeof n !== 'undefined') {
        if (t) {
            n.onloadDone = false;
            n.onload = function(){
                n.onloadDone = true;
                t();
            };
            n.onreadystatechange = function(){
                if (n.readyState === 'loaded' && !n.onloadDone) {
                    n.onloadDone = true;
                    t(n.innerHTML);
                }
            };
        }
        document.getElementsByTagName(where)[0].appendChild(n);
    }
};

var get_el = function(id) {
    return document.getElementById && document.getElementById(id);
};

var remove_el = function(id) {
    var el = get_el(id);
    if (el) {
        el.parentNode.removeChild(el);
    }
};

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
        document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(val) + expires + (domain ? '; domain=' + domain : '') + (path ? '; path=' + path : '') + (secure ? '; secure' : '');
        return true;
    },
    has: function (key) {
        return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
    },
    remove: function (key, path, domain) {
        if (!key || !this.has(key)) { return false; }
        document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + ( domain ? '; domain=' + domain : '') + ( path ? '; path=' + path : '');
        return true;
    }
};


QUnit.module('Basics');

QUnit.test('Default options', function(assert) {
    this.banner = new Cookiebanner();
    assert.deepEqual(this.banner.default_options, this.banner.options, 'Default options equal effective options');
});

QUnit.test('Options override / merge / normalization', function(assert) {
    window.expires_callback = function(){
        return 300;
    };
    var opts = {
        // simulates a `<script data-expires="expires_callback"...>` situation
        expires: 'expires_callback',
        closeText: 'Custom close text',
        cookie: 'testname',
        cookiePath: '/non-existing-path/',
        zindex: 10,
        mask: true,
        linkmsg: 'Testing',
        message: 'Lorem ipsum dolor sit amet...',
        position: 'top',
        effect: 'fade',
        'dashed-option-name': 'Something',
        camelCasedWinsOverDashed: 'winning',
        'camel-cased-wins-over-dashed': 'loosing',
        'camel-cased-wins-over-dashed-regardless-of-order': 'loosing',
        camelCasedWinsOverDashedRegardlessOfOrder: 'winning',
    };
    var banner = new Cookiebanner(opts);

    opts.expires = expires_callback();

    for (var opt in opts) {
        if (opts.hasOwnProperty(opt)) {
            assert.notEqual(opts[opt], banner.default_options[opt], 'option: `' + opt + '` properly overrides any potential default value');
        }
    }

    assert.strictEqual(banner.options.dashedOptionName, opts['dashed-option-name'], 'dashed-option-name properly camelCased to dashedOptionName');
    assert.strictEqual(banner.options['dashed-option-name'], undefined, 'dashed-option-name not present in banner.options');
    assert.strictEqual(banner.options.camelCasedWinsOverDashed, 'winning', 'option specified as camelCased wins over the dashed version');
    assert.strictEqual(banner.options.camelCasedWinsOverDashedRegardlessOfOrder, 'winning', 'option specified as camelCased wins regardless of which was specified "first"');
    window.expires_callback = undefined;
});


QUnit.module('Invocations', {
    setup: function(){},
    teardown: function(){}
});

QUnit.test('Inserted automatically if called via <script id="cookiebanner"> + cleanup via global window.cbinstance.cleanup()', function(assert){
    stop();
    inject_script(script_src, 'cookiebanner', {}, 'head', function(){
        assert.ok(window.cbinstance, 'script loaded and window.cbinstance is truthy');
        assert.ok(window.cbinstance.inserted, 'window.cbinstance.inserted = true');
        window.cbinstance.cleanup();
        assert.strictEqual(undefined, window.cbinstance, 'global window.cbinstance is undefined (meaning cleanup() was successfull)');
        start();
    });
});

QUnit.test('Not inserted automatically unless called with <script id="cookiebanner"...>', function(assert){
    stop();
    inject_script(script_src, 'different-on-purpose', {}, 'head', function(){
        assert.strictEqual(undefined, window.cbinstance, 'script loaded and window.cbinstance is undefined (meaning we did not instantiate and inject automatically)');
        start();
    });
    remove_el('different-on-purpose');
});


QUnit.module('Cookies');

var not_supported = unsupported_features();
if (not_supported) {

    QUnit.test('SKIPPED: ' + not_supported, function(assert){
        assert.ok(1, not_supported);
    });

} else {

    QUnit.test('Called automatically but should not be inserted in the DOM as the cookie should already exist', function(assert){
        var opts = {
            cookie: 'accepted-already',
            expires: 600,
            'cookie-path': '/',
            'close-text': 'noooo!'
        };
        Cookies.set(opts.cookie, 1, opts.expires, opts['cookie-path']);
        stop();
        // now testing the actual scenario
        inject_script(script_src, 'cookiebanner', opts, 'body', function(){
            assert.ok(window.cbinstance, 'script loaded and window.cbinstance is truthy');
            assert.ok(window.cbinstance.agreed(), 'agreed() returns true');
            assert.ok(!window.cbinstance.inserted, 'window.cbinstance.inserted != true');
            window.cbinstance.cleanup();
            assert.strictEqual(undefined, window.cbinstance, 'global window.cbinstance is undefined (meaning cleanup() was successfull)');
            Cookies.remove(opts.cookie);
            start();
        });
    });

}
