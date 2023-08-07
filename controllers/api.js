exports.install = function() {
	ROUTE('+POST    /admin/upload/',   upload, ['upload'], 1024 * 100);
	ROUTE('FILE     /download/*.*',    download);
};

async function upload() {

	var $ = this;
	var arr = [];

	for (var file of $.files) {
		var response = await file.fs('files', UID());
		arr.push(response);
		response.url = '/download/{0}.{1}'.format(response.id.sign(CONF.salt), response.ext);
	}

	$.json(arr);

}

function download(req, res) {
	var id = req.split[1];
	id = id.substring(0, id.lastIndexOf('.'));
	id = id.split('-')[0];
	res.filefs('files', id, req.url.lastIndexOf('download=1') !== -1);
}