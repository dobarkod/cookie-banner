# Cookie Banner

Cookie Banner is a super-easy way to ensure you're complying with the EU
cookie law. Just reference the `cookiebanner.min.js` script from your page
and you're done.

Cookie Banner script is very lightweight and depends on no JavaScript
libraries, css files or images.

## Demo

To see the script in action, visit the [Good Code web page](http://goodcode.io/).

## Quickstart

Add a single line to your web page, just before the closing `</body>` tag:

    <script type="text/javascript" id="cookiebanner"
        src="http://cookiebanner.eu/js/cookiebanner.min.js"></script>

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

* `height` - banner height (default: 32 pixels)
* `fg` - banner text color (default: `#ddd`)
* `bg` - banner background color (default: `#000`)
* `link` - link text color (default: `#aaa`)
* `position` - banner position, `top` or `bottom` (default: `bottom`)
* `message` - the message text
* `linkmsg` - the link text content (default: `Learn more`)
* `close-text` - the text/symbol for the close button (default: `&#10006;`)
* `font-size` - the text size of the message and the link (default: `14px`)
* `font-family` - the font family of the message and the link (default: `arial, sans-serif`)
* `text-align` - The position of the text (default: `center`)
* `effect` - effect to use
* `cookie` - name for the cookie to store the cookiebanner acceptance
  information (default: `cookiebanner-accepted`)
* `expires` - cookie expiry date/time (defaults to `Infinity` aka `Fri, 31 Dec 9999 23:59:59 GMT`). There's basic support for specifying a callback function (more flexibility, must return one of `Number`, `String`, or `Date` -- see `Cookies.set()`). You can also just specify a valid UTC string.
* `cookie-path` - Path to set for the cookie
* `moreinfo` - where the visitor can read more about cookies
  (default: [http://aboutcookies.org](http://aboutcookies.org))
* `mask` - whether to create a mask over the viewport (default: `false`). Clicking anywhere on the mask is considered as acceptance.
* `mask-opacity` - the opacity to use for the window mask (default: `0.5`)
* `mask-background` - optional background style you wish to apply to the `mask` <div> (default: `#000`)
* `zindex` - z-index to set on the notice (default: `255`). If `mask` is used, the notice <div>'s z-index is automatically incremented by 1 so it appears above the mask)

Here's an example:

    <script type="text/javascript" id="cookiebanner"
        src="//cookiebanner.eu/js/cookiebanner.js"
        data-height="20px" data-position="top"
        data-message="We use cookies to improve your browsing experience.">
    </script>

## Self-hosting

If you don't want to depend on the `cookiebanner.eu` site, you can copy
the `cookiebanner.min.js` directly to your site.

If you're using SSL, you'll also need to host the file yourself, as Amazon S3
service that we're using for hosting doesn't support adding custom SSL
certificates.

## Internals and more options

If the banner needs to be shown, the script will create the following DOM
subtree and add it just before the closing `</body>` tag:

    <div class="cookiebanner">
        <div class="cookiebanner-close" style="float: right; padding-left:5px;">x</div>
        <span>Message</span>
        <a href=".." target="_blank">Learn more</a>
    </div>

You can use CSS with `div.cookiebanner > span` and `div.cookiebanner > a` to
further modify the banner appearance.

You can also try customizing the close button via the `.cookiebanner-close` CSS class.
Keep in mind that you might have to override and/or reset certain properties by using `!important` CSS rules.

## Hacking

Get the newest and the freshest from GitHub:

    git clone https://github.com/dobarkod/cookie-banner.git

If you've modified the code, it's recommended you run it through linter
to catch potential errors, and minifier to minimize its footprint.

We're old-school here so we just use Makefile for the tasks:

    make check  # run jshint to check the code
    make # minify it

You'll need `jshint` and `uglifyjs` tools installed for this.

Pull requests are welcome! In order to get your pull-request accepted,
please follow these simple rules:

* all code submissions must pass cleanly (no errors) with `make check`
* there should be no external JavaScript, CSS, image files or any other
  dependencies
* the code should work with no errors or warnings on recent Chrome, Firefox,
  Safari, Internet Explorer browsers and iOS and Android platforms
* if you want to add significant features, file an issue about it first so
  we can discuss whether the addition makes sense for the project

## License

Copyright (C) 2013 Good Code

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
