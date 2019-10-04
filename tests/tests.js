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
        return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
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
    banner.cleanup();
});

QUnit.test('expires option as a number/numeric', function(assert) {
    var banner = new Cookiebanner({expires: "10"});
    assert.strictEqual(typeof banner.options.expires, 'number', 'expires option is of number type');
    assert.strictEqual(banner.options.expires, 10, 'numeric string converted to number');

    var banner = new Cookiebanner({expires: "7890000"});
    assert.strictEqual(typeof banner.options.expires, 'number', 'expires option is of number type');
    assert.strictEqual(banner.options.expires, 7890000, 'numeric string converted to number');
});

QUnit.test('rel opener noreferrer option', function(assert) {
    this.banner = new Cookiebanner();
    assert.deepEqual(this.banner.options.moreinfoRel, 'noopener noreferrer', 'moreinfoRel option defaults to "noopener noreferrer"');
    this.banner = new Cookiebanner({moreinfoRel: ''});
    assert.deepEqual(this.banner.options.moreinfoRel, '', 'rel="noopener noreferrer" is overridden');
    this.banner = new Cookiebanner({moreinfoRel: false});
    assert.deepEqual(this.banner.options.moreinfoRel, false, 'rel="noopener noreferrer" is overridden');
});

QUnit.test('close-precedes option parsing', function(assert) {
    this.banner = new Cookiebanner();
    assert.deepEqual(this.banner.options.closePrecedes, true, 'closePrecedes defaults to true');
    this.banner = new Cookiebanner({closePrecedes: null});
    assert.deepEqual(this.banner.options.closePrecedes, true, 'closePrecedes is true when explicitly set as null');
    this.banner = new Cookiebanner({closePrecedes: ''});
    assert.deepEqual(this.banner.options.closePrecedes, false, 'closePrecedes is false when specified as empty string');
    this.banner = new Cookiebanner({closePrecedes: false});
    assert.deepEqual(this.banner.options.closePrecedes, false, 'closePrecedes is false when given as false');
    this.banner = new Cookiebanner({closePrecedes: 'false'});
    assert.deepEqual(this.banner.options.closePrecedes, false, 'closePrecedes is false when given as "false"');
});

QUnit.test('close-precedes option actually builds different markup', function(assert) {
    // Default/true closePrecedes creates .cookiebanner-close as firstChild of .cookiebanner
    this.banner = new Cookiebanner({closePrecedes: true});
    this.banner.insert();

    assert.strictEqual(this.banner.inserted, true);
    var el = document.querySelector('.cookiebanner');
    assert.strictEqual(el.firstChild.className, 'cookiebanner-close', '.cookiebanner-close is the first child of .cookiebanner');
    assert.strictEqual(el.lastChild.tagName.toLowerCase(), 'span', '<span> is the last child of .cookiebanner');

    this.banner.cleanup();

    // False closePrecedes reverses the above
    this.banner = new Cookiebanner({closePrecedes: false});
    this.banner.insert();

    assert.strictEqual(this.banner.inserted, true);
    var el = document.querySelector('.cookiebanner');
    assert.strictEqual(el.firstChild.tagName.toLowerCase(), 'span', '<span> is the first child of .cookiebanner');
    assert.strictEqual(el.lastChild.className, 'cookiebanner-close', '.cookiebanner-close is the last child of .cookiebanner');

    this.banner.cleanup();
});


QUnit.module('Invocations', {
    setup: function(){},
    teardown: function(){}
});

QUnit.test('Inserted automatically if called via <script id="cookiebanner"> + cleanup via global window.cbinstance.cleanup()', function(assert){
    stop();
    inject_script(script_src, 'cookiebanner', {}, 'head', function(){
        assert.ok(window.cbinstance, 'script loaded and window.cbinstance is truthy');
        if (!window.cbinstance.agreed()) {
            assert.ok(window.cbinstance.inserted, 'window.cbinstance.inserted = true (not agreed, notice inserted)');
        } else {
            assert.ok(!window.cbinstance.inserted, 'window.cbinstance.inserted = false (agreed already, notice not inserted');
        }
        window.cbinstance.cleanup();
        assert.strictEqual(undefined, window.cbinstance, 'global window.cbinstance is undefined (meaning cleanup() was successfull)');
        start();
    });
});

QUnit.test('Testing debug option', function(assert) {
    var opts = {
        debug: true
    };
    var banner = new Cookiebanner(opts);
    banner.agree_and_close();
    var hasCookie = Cookies.has('cookiebanner-accepted');
    assert.strictEqual(hasCookie, false, 'the cookie is not present');
});

QUnit.test('Testing on-inserted handler', function(assert) {
    var handlerGotExecuted = false;
    var opts = {
        onInserted: function(obj) {
            handlerGotExecuted = true;
            assert.ok(obj instanceof Cookiebanner, 'onInserted handler got passed the banner instance.')
        }
    };
    var banner = new Cookiebanner(opts);
    banner.insert();
    banner.agree_and_close();
    assert.strictEqual(handlerGotExecuted, true, "Handler didn't execute or banner was not inserted.");
});

QUnit.test('Testing link in message is detected as the moreinfo link (backwards compatibility)', function(assert) {
    var opts = {
        message: '<a id="messagelink"></a>',
        moreinfo: 'http://localhost/cookie-url'        
    };
    var banner = new Cookiebanner(opts);
    banner.insert();
    var link = window.document.getElementById('messagelink');
    assert.notEqual(link, null);
    assert.strictEqual(link.href, 'http://localhost/cookie-url');
    banner.agree_and_close();
});

QUnit.test('Testing link with a provided class', function(assert) {
    var opts = {
        message: '<a id="messagelink"></a>',
        moreinfo: 'http://localhost/cookie-url',
        moreinfoClass: 'cookie-banner-class'
    };
    var banner = new Cookiebanner(opts);
    banner.insert();
    var link = window.document.getElementById('messagelink');
    assert.notEqual(link, null);
    assert.strictEqual(link.href, '');
    var moreInfoLink = window.document.getElementsByClassName('cookie-banner-class')[0];
    assert.notEqual(moreInfoLink, null);
    assert.strictEqual(moreInfoLink.href, 'http://localhost/cookie-url');
    banner.agree_and_close();
});

QUnit.test('Testing on-closed handler', function(assert) {
    var handlerGotExecuted = false;
    var opts = {
        onClosed: function(obj) {
            handlerGotExecuted = true;
            assert.ok(obj instanceof Cookiebanner, 'onInserted handler got passed the banner instance.')
        }
    };
    var banner = new Cookiebanner(opts);
    banner.insert();
    banner.agree_and_close();
    assert.strictEqual(handlerGotExecuted, true, "Handler didn't execute or banner was inserted/closed.");
});

QUnit.test('Empty linkmsg option does not throw an error', function(assert) {
    var opts = {
        linkmsg: ''
    };
    var banner = new Cookiebanner(opts);
    assert.ok(true, 'empty linkmsg option did not throw an error');
});

QUnit.test('Delay before close option', function(assert) {
    stop();
    var opts = {
        linkmsg: '',
        delayBeforeClose: 3000
    };
    var banner = new Cookiebanner(opts);
    banner.insert();
    banner.agree_and_close();
    assert.strictEqual(banner.closed, false, 'still not closed fully due to delay');
    setTimeout(function() {
        assert.strictEqual(banner.closed, true, 'closed after delay passed');
        start();
    }, 4000);
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
