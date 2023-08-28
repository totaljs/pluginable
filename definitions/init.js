if (!CONF.name)
	CONF.name = 'App';

if (!CONF.cdn)
	CONF.cdn = '//cdn.componentator.com';

CONF.allow_custom_titles = true;
CONF.version = '1';
CONF.op_icon = 'ti ti-totaljs';

FUNC.reconfigure = async function() {
	var config = await DATA.find('cl_config').fields('id,value,type').promise();
	LOADCONFIG(config);
	EMIT('configure');
};

ON('ready', async function() {

	// UI components
	COMPONENTATOR('ui', 'exec,locale,aselected,page,breadcrumb,navlayout,virtualwire,viewbox,input,importer,box,validate,loading,selected,intranetcss,notify,message,errorhandler,empty,menu,ready,fileuploader,colorpicker,approve,icons,directory,edit,markdown,info,datepicker,shortcuts,dropfiles,properties2,configuration,datagrid', true);

	var keys = Object.keys(F.plugins);
	var config = {};

	// Permissions
	for (let key of keys) {

		let item = F.plugins[key];
		if (item.permissions)
			OpenPlatform.permissions.push.apply(OpenPlatform.permissions, item.permissions);

		if (item.config) {
			for (let m of item.config)
				config[m.id] = m.value;
		}

	}

	var run = function() {
		LOADCONFIG(config);
		EMIT('reload');
		FUNC.reconfigure();
	};

	var isconfig = await DATA.query("SELECT FROM pg_tables WHERE schemaname='public' AND tablename='cl_config' LIMIT 1").promise();

	if (isconfig.length) {
		run();
	} else {
		await DATA.query(F.Fs.readFileSync(PATH.root('database.sql'), 'utf8')).promise();
		run();
	}

});

ON('service', function(counter) {

	if (counter % 10 === 0)
		FUNC.reconfigure();

});
