MINIFY = npx uglifyjs --lint -c -m toplevel=true
LINT = npx jshint --show-non-errors
ESLINT = npx eslint
UPLOAD = s3cmd put -P

define GetFromPkg
$(shell node -p "require('./package.json').$(1)")
endef

VERSION := $(call GetFromPkg,version)
TITLE := $(call GetFromPkg,title)
HOMEPAGE := $(call GetFromPkg,homepage)
MINILICENSE = "/*! (C) $(TITLE) v$(VERSION) - MIT License - $(HOMEPAGE) */"

.PHONY: all clean license

all: dist/cookiebanner.min.js

lint: src/cookiebanner.js
	$(LINT) $<
	$(ESLINT) $<

dist/cookiebanner.min.js: src/cookiebanner.js
	echo $(MINILICENSE) > $@
	$(MINIFY) < $< >> $@

clean:
	rm -f dist/cookiebanner.min.js
	rm -f src/cookiebanner.min.js

publish: dist/cookiebanner.min.js
	$(UPLOAD) dist/cookiebanner.min.js s3://cookiebanner.eu/js/cookiebanner.min.js

test:
	$(MAKE) lint
	npx phantomjs ./tests/runner.js ./tests/tests.html
