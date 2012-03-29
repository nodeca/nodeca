NODE_MODULES = $(wildcard node_modules/*)


app-start:
	node ./index.js


dev-setup:
	mkdir -p node_modules
	cd node_modules \
		&& rm -rf nlib nodeca.core nodeca.users nodeca.forum nodeca.blogs
	git clone git@github.com:nodeca/nlib.git node_modules/nlib
	git clone git@github.com:nodeca/nodeca.core.git node_modules/nodeca.core
	git clone git@github.com:nodeca/nodeca.users.git node_modules/nodeca.users
	git clone git@github.com:nodeca/nodeca.forum.git node_modules/nodeca.forum
	git clone git@github.com:nodeca/nodeca.blogs.git node_modules/nodeca.blogs
	cd node_modules/nlib && npm install
	cd node_modules/nodeca.core && npm install
	cd node_modules/nodeca.users && npm install
	cd node_modules/nodeca.forum && npm install
	cd node_modules/nodeca.blogs && npm install
	npm install -g jshint ndoc


node_modules/nlib:
	cd $@ && git pull


node_modules/nodeca.core:
	cd $@ && git pull


node_modules/nodeca.users:
	cd $@ && git pull


node_modules/nodeca.forum:
	cd $@ && git pull


node_modules/nodeca.blogs:
	cd $@ && git pull


pull: $(NODE_MODULES)


.PHONY: $(NODE_MODULES)
