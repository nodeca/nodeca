PATH          := ./node_modules/.bin:${PATH}

NPM_PACKAGE   := $(shell node -e 'process.stdout.write(require("./package.json").name)')
NPM_VERSION   := $(shell node -e 'process.stdout.write(require("./package.json").version)')

TMP_PATH      := /tmp/${NPM_PACKAGE}-$(shell date +%s)

REMOTE_NAME   ?= origin
REMOTE_REPO   ?= $(shell git config --get remote.${REMOTE_NAME}.url)

CURR_HEAD     := $(firstword $(shell git show-ref --hash HEAD | sed 's/^\(.\{6\}\).*$$/\1/') master)
GITHUB_PROJ   := nodeca/${NPM_PACKAGE}
SRC_URL_FMT   := https://github.com/${GITHUB_PROJ}/blob/${CURR_HEAD}/{file}\#L{line}

APPLICATIONS   = nodeca.core nodeca.users nodeca.forum nodeca.blogs nodeca.editor
NODE_MODULES   = $(foreach app,$(APPLICATIONS),node_modules/$(app))
CONFIG_FILES   = $(basename $(wildcard ./config/*.yml.example))

INSTALL_DEPS  := $(shell test -d ./node_modules ; echo $$?)


help:
	echo "make help       - Print this help"
	echo "make lint       - Lint sources with JSHint"
	echo "make test       - Lint sources and run all tests"
	echo "make publish    - Set new version tag and publish npm package"
	echo "make todo       - Find and list all TODOs"
	echo "make pull       - Updates all sub-apps"
	echo "make pull-ro    - Updates all sub-apps in read-only mode"


lint:
	if test ! `which jshint` ; then \
		echo "You need 'jshint' installed in order to run lint." >&2 ; \
		echo "  $ npm install" >&2 ; \
		exit 128 ; \
		fi
	jshint . --show-non-errors


$(CONFIG_FILES):
	test -f $@.example && ( test -f $@ || cp $@.example $@ )


test: lint $(CONFIG_FILES)
	NODECA_ENV=test node nodeca.js migrate --all
	NODECA_ENV=test NODECA_NOMINIFY=1 ./nodeca.js test $(NODECA_APP)


dev-server:
	if test ! `which inotifywait` ; then \
		echo "You need 'inotifywait' installed in order to run dev-server." >&2 ; \
		echo "   sudo apt-get install inotify-tools" >&2 ; \
		exit 128 ; \
		fi
	./support/forever.sh


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
	grep 'TODO' -n -r --exclude-dir=public --exclude-dir=\.cache --exclude-dir=\.git --exclude-dir=node_modules --exclude=Makefile . 2>/dev/null || test true


node_modules/nodeca.core:     REPO_RW=git@github.com:nodeca/nodeca.core.git
node_modules/nodeca.users:    REPO_RW=git@github.com:nodeca/nodeca.users.git
node_modules/nodeca.forum:    REPO_RW=git@github.com:nodeca/nodeca.forum.git
node_modules/nodeca.blogs:    REPO_RW=git@github.com:nodeca/nodeca.blogs.git
node_modules/nodeca.editor:   REPO_RW=git@github.com:nodeca/nodeca.editor.git


node_modules/nodeca.core:     REPO_RO=git://github.com/nodeca/nodeca.core.git
node_modules/nodeca.users:    REPO_RO=git://github.com/nodeca/nodeca.users.git
node_modules/nodeca.forum:    REPO_RO=git://github.com/nodeca/nodeca.forum.git
node_modules/nodeca.blogs:    REPO_RO=git://github.com/nodeca/nodeca.blogs.git
node_modules/nodeca.editor:   REPO_RO=git://github.com/nodeca/nodeca.editor.git


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


.PHONY: $(NODE_MODULES) publish lint test todo
.SILENT: $(NODE_MODULES) help lint test todo
