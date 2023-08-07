NEWSCHEMA('Settings', function(schema) {

	schema.action('read', {
		name: 'Read settings',
		permissions: 'settings',
		action: async function($) {

			var model = {};
			var language = $.user.language;
			var data = await DATA.find('cl_config').fields('id,value,type').promise($);
			var keys = 'name,secret_tms,allow_tms,url,icon,op_reqtoken,op_restoken,totalapi'.split(',');
			var config = {};

			for (var item of data) {

				switch (item.type) {
					case 'number':
						item.value = item.value == null ? '' : item.value.parseFloat();
						break;
					case 'boolean':
						item.value = item.value === 'true' ? true : false;
						break;
				}

				config[item.id] = item.value;
			}

			for (var key of keys)
				model[key] = config[key];

			model.items = [];

			for (let key in F.plugins) {

				let plugin = F.plugins[key];
				let cfg = plugin.config;

				if (cfg) {
					var name = TRANSLATOR(language, plugin.name);
					model.items.push({ type: 'group', name: name });
					for (let m of cfg) {
						var type = m.type;
						if (!type) {
							if (m.value instanceof Date)
								type = 'date';
							else
								type = typeof(m.value);
						}
						var item = CLONE(m);
						item.name = TRANSLATOR(language, m.name);
						item.value = config[m.id];

						item.type = type;
						model.items.push(item);
					}
				}

			}

			$.callback(model);
		}
	});

	schema.action('save', {
		name: 'Save settings',
		input: 'name:String, url:URL, icon:String, allow_tms:Boolean, secret_tms:String, op_reqtoken:String, op_restoken:String, totalapi:String, items:[*id:String, value:Object]',
		permissions: 'settings',
		action: async function($, model) {

			for (var key in model) {
				if (key !== 'items')
					model.items.push({ id: key, value: model[key] });
			}

			for (let m of model.items) {

				if (m.value instanceof Date) {
					m.value = m.value.toISOString();
					m.type = 'date';
				} else {
					if (m.value == null) {
						m.value = '';
						m.type = 'string';
					} else {
						var type = typeof(m.value);
						if (type === 'object') {
							type = 'json';
							m.value = JSON.stringify(m.value);
						} else
							m.value = m.value == null ? '' : m.value.toString();
						m.type = type;
					}
				}

				m.dtupdated = NOW;
				await DATA.modify('cl_config', m, true).id(m.id).promise();
			}

			FUNC.reconfigure();
			$.success();
		}
	});

	schema.action('account', {
		id: 'Read account data',
		action: async function($) {
			$.callback($.user.json ? $.user.json() : $.user);
		}
	});

});