.PHONY: test docs
.SILENT: test docs config/application.yml


PATH := ./node_modules/.bin:${PATH}


test:
	if test ! `which vows` ; then \
		echo "You need vows installed in order to run tests." >&2 ; \
		echo "  $ npm install vows" >&2 ; \
		exit 128 ;\
		fi
	NODE_ENV=test vows --spec

docs:
	./support/generate-docs.rb

config/application.yml:
	echo 'CLI for config creation is not implemented yet.' >&2
	echo 'Please copy config/application.example.yml to config/application.yml' \
		 'and edit your settings to match your needs.' >&2
	exit 128

app: config/application.yml
	node ./index.js
