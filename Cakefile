mainInputFiles = [
	'js/src/Space.coffee',
	'js/src/Counters.coffee',
	'js/src/Speedometer.coffee',
	'js/src/Ship.coffee',
	'js/src/Artifacts.coffee'
	'js/src/Scene.coffee'
]
#---------------------------------------------------------------------------------------------------

option '-w', '--watch', 'Watch and compile on file change'
task 'build', 'compile source', (options) ->
	options.watch or= off
	build(mainInputFiles, 			'js/Main.js', 		options.watch)
	build('js/src/Hopalong.coffee', 'js/Hopalong.js', 	options.watch)

task 'minify', 'minify compiles js files', ->
	launch('uglifyjs', ['-o', 'js/Main.min.js', 'js/Main.js'])
	launch('uglifyjs', ['-o', 'js/Hopalong.min.js', 'js/Hopalong.js'])

task 'clean', 'clean generated files', -> 
	fs.unlink 'js/Main.js'
	fs.unlink 'js/Hopalong.js'
	fs.unlink 'js/Main.min.js'
	fs.unlink 'js/Hopalong.min.js'

#---------------------------------------------------------------------------------------------------

fs = require 'fs'
print = require 'util'
{spawn, exec} = require 'child_process'

try
	which = require('which').sync
catch err
	if process.platform.match(/^win/)?
		console.log 'WARNING: the which module is required for windows\ntry: npm install which'
	which = null

launch = (cmd, options=[]) ->
	cmd = which(cmd) if which
	app = spawn cmd, options
	app.stdout.pipe(process.stdout)
	app.stderr.pipe(process.stderr)

build = (inputFiles, outputFile, watch) ->
	options = ['-b' ,'-j', outputFile, '-c']
	options = options.concat inputFiles
	options.unshift '-w' if watch 
	launch 'coffee', options
