exports.icon = 'ti ti-cog';
exports.name = '@(Settings)';
exports.permissions = [{ id: 'settings', name: 'Settings' }];
exports.position = 100;
exports.visible = user => user.sa || user.permissions.includes('settings');

exports.install = function() {
	ROUTE('+API   ?   -account         --> Settings/account');
	ROUTE('+API   ?   -settings_read   --> Settings/read');
	ROUTE('+API   ?   +settings_save   --> Settings/save');
};