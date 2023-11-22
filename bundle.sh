#!/usr/bin/env node

require('total4');

var path = '--bundles--';

function buildplugin(name, callback) {
	console.log('| |--', name + '.bundle');
	BACKUP(path + '/' + name + '.bundle', PATH.root(), callback, function(path, isdir) {
		return path === '/' || path === '/plugins/' || (path.indexOf('plugins/' + name) !== -1);
	});
}

console.log('|-- Total.js bundle compiler');
console.time('|-- Compilation');

console.log('| |--', 'app.bundle');
BACKUP(path + '/app.bundle', PATH.root(), function() {
	F.Fs.readdir(PATH.root('plugins'), function(err, response) {
		response.wait(function(key, next) {

			switch (key) {
				case 'settings':
					next();
					return;
				default:
					buildplugin(key, next);
					return;
			}

		}, function() {
			console.timeEnd('|-- Compilation');
		});
	});
}, function(path, isdir) {

	if (!isdir)
		return path.split('/').length > 2;

	var p = path.split('/').trim();

	if (!p[0] || (p.length === 1 && p[0] === 'plugins'))
		return true;

	var allowed = ['controllers', 'definitions', 'modules', 'public', 'views', 'plugins/settings'];

	for (var m of allowed) {
		if (path.indexOf(m) === 1)
			return true;
	}

	return false;
});