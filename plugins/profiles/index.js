exports.icon = 'ti ti-totaljs';
exports.name = '@(Profiles)';
exports.position = 2;
exports.permissions = [{ id: 'profiles', name: 'Profiles' }];
exports.visible = user => user.sa || user.permissions.includes('profiles');
// exports.hidden = true; // hides item in the menu
exports.routes = [
	{ url: '/profiles/{id}/', html: 'detail' }
];

exports.install = function() {
	ROUTE('+API   ?   -profiles    --> Profiles/list');
};