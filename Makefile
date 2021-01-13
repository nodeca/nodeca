NPM_PACKAGE   := $(shell node -e 'process.stdout.write(require("./package.json").name)')
NPM_VERSION   := $(shell node -e 'process.stdout.write(require("./package.json").version)')

GITHUB_PROJ   := nodeca/${NPM_PACKAGE}

APPLICATIONS   = nodeca.core nodeca.users nodeca.forum nodeca.blogs
NODE_MODULES   = $(foreach app,$(APPLICATIONS),node_modules/$(app))
CONFIG_FILES   = $(basename $(wildcard ./config/*.yml.example))

INSTALL_DEPS  := $(shell test -d ./node_modules ; echo $$?)


help:
	echo "make help       - Print this help"
	echo "make lint       - Lint sources with JSHint"
	echo "make test       - Lint sources and run all tests"
	echo "make todo       - Find and list all TODOs"
	echo "make pull       - Updates all sub-apps"
	echo "make pull-ro    - Updates all sub-apps in read-only mode"
	echo "make push       - Push all working repos"


lint:
	./node_modules/.bin/eslint .

$(CONFIG_FILES):
	test -f $@.example && ( test -f $@ || cp $@.example $@ )


test: lint $(CONFIG_FILES)
	mongo nodeca-test --eval "printjson(db.dropDatabase())"
	redis-cli -n 2 flushdb
	NODECA_ENV=test node server.js migrate --all
	NODECA_ENV=test ./server.js test $(NODECA_APP)

test-ci: lint $(CONFIG_FILES)
	NODECA_ENV=test node server.js migrate --all
	NODECA_ENV=test ./server.js test

deps-ci:
	./support/run.js pull-ro ${GITHUB_BRANCH}

repl:
	rlwrap socat ./repl.sock stdin

todo:
	grep 'TODO' -n -r --exclude-dir=public --exclude-dir=\.cache --exclude-dir=\.git --exclude-dir=node_modules --exclude=Makefile . 2>/dev/null || test true

pull:
	./support/run.js pull

pull-ro:
	./support/run.js pull-ro

push:
	./support/run.js push

status:
	./support/run.js status

.PHONY: $(NODE_MODULES) lint test todo
.SILENT: $(NODE_MODULES) help todo
