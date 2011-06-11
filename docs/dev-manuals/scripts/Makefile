.PHONY: test docs gh-pages todo
.SILENT: test docs


PATH := ./node_modules/.bin:${PATH}

PROJECT =  $(notdir ${PWD})
TMP_DIR = /tmp/${PROJECT}-$(shell date +%s)

REMOTE_NAME ?= origin
REMOTE_REPO ?= $(shell git config --get remote.${REMOTE_NAME}.url)


test:
	if test ! `which vows` ; then \
		echo "You need vows installed in order to run tests." >&2 ; \
		echo "  $ npm install vows" >&2 ; \
		exit 128 ; \
		fi
	NODE_ENV=test vows --spec

docs:
	./support/generate-docs.rb

gh-pages:
	@if test -z ${REMOTE_REPO} ; then \
		echo 'Remote repo URL not found' >&2 ; \
		exit 128 ; \
		fi
	mkdir ${TMP_DIR}
	cp -r doc/* ${TMP_DIR}
	touch ${TMP_DIR}/.nojekyll
	cd ${TMP_DIR} && \
		git init && \
		git add . && \
		git commit -q -m 'Recreated docs'
	cd ${TMP_DIR} && \
		git remote add remote ${REMOTE_REPO} && \
		git push --force remote +master:gh-pages 
	rm -rf ${TMP_DIR}

todo:
	@grep 'TODO' -n -r ./app ./lib 2>/dev/null
