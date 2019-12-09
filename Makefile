PATH := ./node_modules/.bin:${PATH}

build:
	rm -rf ./dist
	mkdir dist
	rollup index.js -f iife > dist/md2json.js
	terser dist/md2json.js > dist/md2json.min.js

test:
	mocha

lint:
	standard
