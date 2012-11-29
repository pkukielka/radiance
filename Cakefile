mainInputFiles = [
	'js/src/Ship.coffee',
	'js/src/Space.coffee',
	'js/src/Scene.coffee'
]
#---------------------------------------------------------------------------------------------------

task 'build', 'compile source', -> 
	build(mainInputFiles, 			'js/main.js', 		false)
	build('js/src/Hopalong.coffee', 'js/Hopalong.js', 	false)

task 'watch', 'compile and watch', ->
	build(mainInputFiles, 			'js/main.js', 		true)
	build('js/src/Hopalong.coffee', 'js/Hopalong.js', 	true)

task 'clean', 'clean generated files', -> fs.unlink outputFile

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
