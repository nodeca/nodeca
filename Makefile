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
