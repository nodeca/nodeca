.SILENT: config/application.yml

app-start: config/application.yml
	node ./index.js

config/application.yml:
	echo 'CLI for config creation is not implemented yet.' >&2
	echo 'Please copy config/application.example.yml to config/application.yml' \
		 'and edit your settings to match your needs.' >&2
	exit 128
