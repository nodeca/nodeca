app-start:
	node ./index.js


dev-setup:
	mkdir -p node_modules
	cd node_modules && rm -rf nlib nodeca.core nodeca.forum
	git clone git@github.com:nodeca/nlib.git node_modules/nlib
	git clone git@github.com:nodeca/nodeca.core.git node_modules/nodeca.core
	git clone git@github.com:nodeca/nodeca.forum.git node_modules/nodeca.forum
