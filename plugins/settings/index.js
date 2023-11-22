exports.icon = 'ti ti-cog';
exports.name = '@(Settings)';
exports.permissions = [{ id: 'settings', name: 'Settings' }];
exports.position = 100;
exports.visible = user => user.sa || user.permissions.includes('settings');

exports.install = function() {
	ROUTE('+API    /admin/    -account         --> Settings/account');
	ROUTE('+API    /admin/    -settings_read   --> Settings/read');
	ROUTE('+API    /admin/    +settings_save   --> Settings/save');
};