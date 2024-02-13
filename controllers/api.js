exports.install = function() {
	ROUTE('+POST  ?upload/ @upload <100MB', upload);
	ROUTE('FILE   /download/*.*', download);
};

async function upload($) {

	var arr = [];

	for (var file of $.files) {
		var response = await file.fs('files', UID());
		arr.push(response);
		response.url = '/download/{0}.{1}'.format(response.id.sign(CONF.salt), response.ext);
	}

	$.json(arr);

}

function download($) {
	var id = $.split[1];
	id = id.substring(0, id.lastIndexOf('.'));
	id = id.split('-')[0];
	$.filefs('files', id, $.query.download ? true : false);
}