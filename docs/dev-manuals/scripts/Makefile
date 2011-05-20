.PHONY: test docs gh-pages
.SILENT: test docs

test:
	@if test ! `which vows` ; then \
		echo "You need vows in order to run tests. To install it run:" >&2 ; \
		echo "  $ npm install vows" >&2 ; \
		exit 128 ;\
		fi
	NODE_ENV=test vows --spec

docs:
	./support/generate-docs.rb

gh-pages:
	@if test `git status -s | wc -l` -ne 0 ; then \
		echo "Unclean working copy. Can't continue." >&2 ; \
		echo "Please, commit changes:" ; \
		git status -s ; \
		exit 128 ; \
		fi
	$(MAKE) docs
	rm -rf /tmp/doc \
		&& mv doc /tmp/doc \
		&& git reset --hard HEAD \
		&& git checkout gh-pages \
		&& rm -rf ./* \
		&& git rm -rf ./* \
		&& mv /tmp/doc/* . \
		&& git add . \
		&& git commit -m 'Update docs' \
		&& git checkout master
