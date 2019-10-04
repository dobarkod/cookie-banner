# Cookie Banner [![Build Status](https://img.shields.io/travis/dobarkod/cookie-banner.svg?style=flat-square)](https://travis-ci.org/dobarkod/cookie-banner)

Cookie Banner is a super-easy way to ensure you're complying with the EU
cookie law. Just reference the `cookiebanner.min.js` script from your page
and you're done.

Cookie Banner script is very lightweight and depends on no JavaScript
libraries, css files or images.

## Demo

To see the script in action [download the files](https://github.com/dobarkod/cookie-banner/archive/master.zip) and open/serve [tests/demo.html](tests/demo.html) and/or [tests/tests.html](tests/tests.html).

## Quickstart

Add a single line to your web page, just before the closing `</body>` tag:

```html
<script type="text/javascript" id="cookiebanner"
  src="https://cdn.jsdelivr.net/gh/dobarkod/cookie-banner@1.2.2/dist/cookiebanner.min.js"></script>
```

or via [cdnjs](https://cdnjs.com/):
```html
<script type="text/javascript" id="cookiebanner"
  src="https://cdnjs.cloudflare.com/ajax/libs/cookie-banner/1.2.2/cookiebanner.min.js"></script>
```

This will display a black-and-white floating banner at the bottom of your
web page, informing the user that the site is using cookies, and giving them
the link to a page with more information.

When the user clicks the "close" button, the banner will set a cookie
(oh, the irony!) remembering that the banner was acknowledged, so the same
user will not be bothered again.

## Options

If you don't like the defaults, you can modify the banner content and
style. The following options are settable through a `data-` property on the
`script` tag:

* `height` - Banner/notice height (default: `32px`)
* `fg` - Banner/notice text color (default: `#ddd`)
* `bg` - Banner/notice background color (default: `#000`)
* `link` - Link text color (default: `#aaa`)
* `position` - Banner/notice position, `top` or `bottom` (default: `bottom`)
* `padding` - Set custom padding (default: `5px 16px`)
* `message` - Notice message text
* `linkmsg` - Link text content (default: `Learn more`)
* `close-text` - Text/symbol for the `.cookiebanner-close` element (default: `&#10006;`)
* `close-style` - CSS style for `.cookiebanner-close` element (default: `float:right;padding-left:5px;`)
* `close-precedes` - Controls whether `.cookiebanner-close` element precedes or follows the `<span>` containing the message (default: `true`)
* `font-size` - Text/font size for the .cookiebanner (container) element (default: `14px`)
* `font-family` - Font family for the .cookiebanner (container) element (default: `arial, sans-serif`)
* `text-align` - Text align/position for the .cookiebanner (container) element (default: `center`)
* `effect` - Effect used when inserting the notice, currently only `fade` is supported (triggered when cookiebanner is displayed and when it is closed) (default: `null`)
* `fade-out-duration-ms` - Duration in milliseconds of fade-out effect (only if `fade` effect is specified, default: `2000`)
* `cookie` - Name for the cookie that stores acceptance info (default: `cookiebanner-accepted`)
* `expires` - Cookie expiry date/time (defaults to `Infinity` aka `Fri, 31 Dec 9999 23:59:59 GMT`). There's basic support for specifying a callback function (more flexibility, must return one of `Number`, `String`, or `Date` -- see `Cookies.set()`). You can also just specify a valid UTC string. When specified as a "numeric string", it is treated as number of seconds
from now. So, `expires: '90'` or `data-expires="90"` would expire the cookie in 90
seconds.
* `cookie-path` - Path to set for the cookie
* `cookie-domain` - Set a custom cookie domain (default: `null`)
* `cookie-secure` - Set (`true`/`false`) secure cookie for HTTPS (default: `false`)
* `moreinfo` - Link where the visitor can read more about cookies (default: [http://aboutcookies.org](http://aboutcookies.org))
* `moreinfo-target` - Target for `moreinfo` link (default: `_blank`)
* `moreinfo-decoration` - Text decoration for `moreinfo` link (default: `none`)
* `moreinfo-font-weight` - Font weight for `moreinfo` link (default: `normal`)
* `moreinfo-font-size` - Font size (i.e 12px) for `moreinfo` link (default: `null`)
* `moreinfo-rel` - Rel attribute value for `moreinfo` link (default: `noopener noreferrer`). Set to `false` or `` if you wish to disable it.
* `moreinfo-class` - CSS class for `moreinfo` link (default: `null`). If present, it will be used to detect the `moreinfo` link (instead of getting the first `a` element within `message`). Use when your `message` has more than one link and you do not want the first one to have `moreinfo` link set.
* `mask` - Controls whether a mask is created over the viewport (default: `false`). Clicking anywhere on the mask is considered as acceptance.
* `mask-opacity` - Opacity used for the window `mask` (default: `0.5`)
* `mask-background` - CSS background style applied to the `mask` <div> (default: `#000`)
* `zindex` - Z-index set on the notice (default: `255`). If `mask` is used, the notice <div>'s z-index is automatically incremented by 1 so it appears above the mask.
* `accept-on-scroll` - When `true`, agrees and closes the notice when window is scrolled. (default: `false`)
* `accept-on-click` - When `true`, agrees and closes the notice when clicking anywhere on the page. (default: `false`)
* `accept-on-first-visit` - When `true`, agrees automatically (which stops showing the notice for subsequent requests), but the notice is not automatically closed. (default: `false`)
* `accept-on-timeout` - Automatically agrees and closes the notice after specified number of milliseconds. (default: `null`)
* `on-inserted` - A function which gets executed after the banner is inserted in the DOM (default: `null`)
* `on-closed` - A function which gets executed after the banner is closed (default: `null`)
* `delay-before-close` - Wait N milliseconds before closing the notice. (default: `null`)
* `debug` - When `true`, closes the banner without setting the cookie (default: `false`)

Here's an example:

```html
<script type="text/javascript" id="cookiebanner"
    src="https://cdn.jsdelivr.net/gh/dobarkod/cookie-banner@1.2.2/dist/cookiebanner.min.js"
    data-height="20px" data-position="top"
    data-message="We use cookies to improve your browsing experience.">
</script>
```

## Self-hosting

If you don't want to depend on `cdnjs` or `jsdelivr`, copy
the `cookiebanner.min.js` file directly to your site and serve it yourself.

If you want to compile cookiebanner with the rest of your application's javascript,
you can call it with options as follows:

```html
<script type="text/javascript">
      var options = { message: "We use cookies to enhance your experience.", moreinfo: "/about/cookies" };
      var cb = new Cookiebanner(options); cb.run();
</script>
```

## Internals and more options

If the banner needs to be shown, the script will create the following DOM
subtree by default and add it just before the closing `</body>` tag:

```html
<div class="cookiebanner">
    <div class="cookiebanner-close" style="float: right; padding-left:5px;">&#10006;</div>
    <span>Message. <a rel="noopener noreferrer" href=".." target="_blank">Learn more</a></span>
</div>
```

If the `close-precedes` option is sto to `false` (added in 1.2.1), the DOM looks
slightly different:
```html
<div class="cookiebanner">
    <span>Message. <a rel="noopener noreferrer" href=".." target="_blank">Learn more</a></span>
    <div class="cookiebanner-close" style="float: right; padding-left:5px;">&#10006;</div>
</div>
```

You can use CSS with `div.cookiebanner > span` and `div.cookiebanner > a` to
further modify the banner appearance.

You can also try customizing the close button via the `.cookiebanner-close` CSS class.
Keep in mind that you might have to override and/or reset certain properties by using `!important` CSS rules.


## Event-Handlers (Callbacks)

There are two ways you can utilize event handlers like i.e. `on-inserted`.

Within JS (recommended):

```html
<script type="text/javascript">
      var options = { onInserted: function (instance) { console.log('Hey, I got inserted!') } };
      var cb = new Cookiebanner(options); cb.run();
</script>
```

As a `data`-attribute:

```html
<script type="text/javascript" id="cookiebanner"
    src="https://cdn.jsdelivr.net/gh/dobarkod/cookie-banner/dist/cookiebanner.min.js"
    data-on-inserted="function (instance) { console.log('Hey, I got inserted!'); }">
</script>
```


## Hacking

Get the newest and the freshest from GitHub:
```sh
git clone https://github.com/dobarkod/cookie-banner.git
```

If you've modified the code, it's recommended you run it through linter
to catch potential errors, and minifier to minimize its footprint.

We're old-school here so we just use Makefile for the tasks:

```sh
make lint  # run jshint to check the code
make test  # run the tests
make # minify it
```

You'll need `jshint`, `eslint` and `uglifyjs` (v2) tools installed for this, and also
`phantomjs` if you want to run the automated tests.

Pull requests are welcome! In order to get your pull-request accepted,
please follow these simple rules:

* all code submissions must pass cleanly (no errors) with `make test`
* there should be no external JavaScript, CSS, image files or any other
  dependencies
* the code should work with no errors or warnings on recent Chrome, Firefox,
  Safari, Internet Explorer browsers and iOS and Android platforms
* if you want to add significant features, file an issue about it first so
  we can discuss whether the addition makes sense for the project

## [License (MIT)](LICENSE.md)
