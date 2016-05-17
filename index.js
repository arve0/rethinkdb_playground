const r = require('rethinkdb');

r.connect({}).then((connection) => {
	return new Promise((_, reject) => {
		setInterval(() => {
			r.table('test').insert({ n: Math.random() }).run(connection).catch(reject);
			process.stdout.write('.');
		}, 1000);
	});
}).catch((e) => {
	console.log('Error: ' + e);
	process.exit(1);
});
