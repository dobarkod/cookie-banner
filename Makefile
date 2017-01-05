MINIFY = uglifyjs --lint -c -m toplevel=true
LINT = jshint --show-non-errors
UPLOAD = s3cmd put -P

define GetFromPkg
$(shell node -p "require('./package.json').$(1)")
endef

VERSION := $(call GetFromPkg,version)
TITLE := $(call GetFromPkg,title)
HOMEPAGE := $(call GetFromPkg,homepage)
MINILICENSE = "/*! (C) $(TITLE) v$(VERSION) - MIT License - $(HOMEPAGE) */"

.PHONY: all clean license

all: src/cookiebanner.min.js

lint: src/cookiebanner.js
	$(LINT) $<

src/cookiebanner.min.js: src/cookiebanner.js
	echo $(MINILICENSE) > $@
	$(MINIFY) < $< >> $@

clean:
	rm -f src/cookiebanner.min.js

publish: src/cookiebanner.min.js
	$(UPLOAD) src/cookiebanner.min.js s3://cookiebanner.eu/js/cookiebanner.min.js

test:
	$(MAKE) lint
	phantomjs ./tests/runner.js ./tests/tests.html
