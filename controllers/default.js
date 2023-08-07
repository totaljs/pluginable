exports.install = function() {
	ROUTE('+GET /admin/*', index);
};

function index() {

	var $ = this;
	var plugins = [];

	if (!TEMP.url) {
		TEMP.url = CONF.url = $.hostname();
		DATA.modify('cl_config', { id: 'url', value: CONF.url, type: 'string' }, true).id('url').callback(ERROR('cl_config'));
	}

	for (var key in F.plugins) {
		var item = F.plugins[key];
		if ($.user.sa || !item.visible || item.visible($.user)) {
			var obj = {};
			obj.id = item.id;
			obj.routes = item.routes;
			obj.position = item.position;
			obj.name = TRANSLATOR($.user.language || '', item.name);
			obj.icon = item.icon;
			obj.import = item.import;
			obj.hidden = item.hidden;
			plugins.push(obj);
		}
	}

	plugins.quicksort('position');
	$.view('admin', plugins);

}