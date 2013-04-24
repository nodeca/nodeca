PATH          := ./node_modules/.bin:${PATH}

NPM_PACKAGE   := $(shell node -e 'process.stdout.write(require("./package.json").name)')
NPM_VERSION   := $(shell node -e 'process.stdout.write(require("./package.json").version)')

TMP_PATH      := /tmp/${NPM_PACKAGE}-$(shell date +%s)

REMOTE_NAME   ?= origin
REMOTE_REPO   ?= $(shell git config --get remote.${REMOTE_NAME}.url)

CURR_HEAD     := $(firstword $(shell git show-ref --hash HEAD | cut --bytes=-6) master)
GITHUB_PROJ   := nodeca/${NPM_PACKAGE}
SRC_URL_FMT   := https://github.com/${GITHUB_PROJ}/blob/${CURR_HEAD}/{file}\#L{line}

APPLICATIONS   = nodeca.core nodeca.users nodeca.forum nodeca.blogs
NODE_MODULES   = $(foreach app,$(APPLICATIONS),node_modules/$(app))
CONFIG_FILES   = $(basename $(wildcard ./config/*.yml.example))

INSTALL_DEPS  := $(shell test -d ./node_modules ; echo $$?)


help:
	echo "make help       - Print this help"
	echo "make lint       - Lint sources with JSHint"
	echo "make test       - Lint sources and run all tests"
	echo "make doc        - Build API docs"
	echo "make dev-deps   - Install developer dependencies"
	echo "make gh-pages   - Build and push API docs into gh-pages branch"
	echo "make publish    - Set new version tag and publish npm package"
	echo "make todo       - Find and list all TODOs"
	echo "make pull       - Updates all sub-apps"


lint:
	if test ! `which jshint` ; then \
		echo "You need 'jshint' installed in order to run lint." >&2 ; \
		echo "  $ make dev-deps" >&2 ; \
		exit 128 ; \
		fi
	jshint . --show-non-errors


$(CONFIG_FILES):
	test -f $@.example && ( test -f $@ || cp $@.example $@ )


test: lint $(CONFIG_FILES)
	NODECA_ENV=test node nodeca.js migrate --all
	NODECA_ENV=test node nodeca.js test $(NODECA_APP)


doc:
	@if test ! `which ndoc` ; then \
		echo "You need 'ndoc' installed in order to generate docs." >&2 ; \
		echo "  $ npm install -g ndoc" >&2 ; \
		exit 128 ; \
		fi
	rm -rf ./doc
	ndoc --output ./doc --linkFormat "${SRC_URL_FMT}" ./lib


dev-deps:
	npm install


dev-server:
	if test ! `which inotifywait` ; then \
		echo "You need 'inotifywait' installed in order to run dev-server." >&2 ; \
		echo "   sudo apt-get install inotify-tools" >&2 ; \
		exit 128 ; \
		fi
	./support/forever.sh


gh-pages:
	@if test -z ${REMOTE_REPO} ; then \
		echo 'Remote repo URL not found' >&2 ; \
		exit 128 ; \
		fi
	$(MAKE) doc && \
		cp -r ./doc ${TMP_PATH} && \
		touch ${TMP_PATH}/.nojekyll
	cd ${TMP_PATH} && \
		git init && \
		git add . && \
		git commit -q -m 'Recreated docs'
	cd ${TMP_PATH} && \
		git remote add remote ${REMOTE_REPO} && \
		git push --force remote +master:gh-pages 
	rm -rf ${TMP_PATH}


publish:
	@if test 0 -ne `git status --porcelain | wc -l` ; then \
		echo "Unclean working tree. Commit or stash changes first." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git tag -l ${NPM_VERSION} | wc -l` ; then \
		echo "Tag ${NPM_VERSION} exists. Update package.json" >&2 ; \
		exit 128 ; \
		fi
	git tag ${NPM_VERSION} && git push origin ${NPM_VERSION}
	npm publish https://github.com/${GITHUB_PROJ}/tarball/${NPM_VERSION}


todo:
	grep 'TODO' -n -r ./lib 2>/dev/null || test true


node_modules/nodeca.core:     REPO_RW=git@github.com:nodeca/nodeca.core.git
node_modules/nodeca.users:    REPO_RW=git@github.com:nodeca/nodeca.users.git
node_modules/nodeca.forum:    REPO_RW=git@github.com:nodeca/nodeca.forum.git
node_modules/nodeca.blogs:    REPO_RW=git@github.com:nodeca/nodeca.blogs.git


node_modules/nodeca.core:     REPO_RO=git://github.com/nodeca/nodeca.core.git
node_modules/nodeca.users:    REPO_RO=git://github.com/nodeca/nodeca.users.git
node_modules/nodeca.forum:    REPO_RO=git://github.com/nodeca/nodeca.forum.git
node_modules/nodeca.blogs:    REPO_RO=git://github.com/nodeca/nodeca.blogs.git


$(NODE_MODULES):
	mkdir -p node_modules
	echo "*** $@"
	if test ! -d $@/.git && test -d $@ ; then \
		echo "Module already exists. Remove it first." >&2 ; \
		exit 128 ; \
		fi
	if test ! -d $@/.git ; then \
		rm -rf $@ && \
		git clone $($(shell echo ${REPO})) $@ && \
		cd $@ && \
		npm install ; \
		fi
	cd $@ && git pull


pull-ro: REPO="REPO_RO"
pull-ro: $(NODE_MODULES)
	git pull
	@if test $(INSTALL_DEPS) -ne 0 ; then \
		npm install ; \
		fi


pull: REPO="REPO_RW"
pull: $(NODE_MODULES)
	git pull
	@if test $(INSTALL_DEPS) -ne 0 ; then \
		npm install ; \
		fi


.PHONY: $(NODE_MODULES) publish lint test doc dev-deps gh-pages todo
.SILENT: $(NODE_MODULES) help lint test doc todo
