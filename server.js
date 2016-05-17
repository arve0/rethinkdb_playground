const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const open = require('open');
const r = require('rethinkdb');

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
http.listen(3000);

r.connect({}).then((conn) => {
	this.c = conn;
	return r.tableDrop('test').run(this.c);
}).then(() => {
	return r.tableCreate('test').run(this.c);
}).then(() => {
	return r.table('test').insert({a: 1}).run(this.c);
}).then(() => {
	return r.table('test').changes().run(this.c);
}).then((cursor) => {
	return new Promise((_, reject) => {
		cursor.each((err, item) => {
			if (err) reject(err);
			if (item && item.new_val) {
				// send change to everyone
				io.emit('change', item.new_val);
			}
		});

		io.on('connection', (socket) => {
			// store connection to db
			// subscribe to something
			console.log('user connected');
			r.table('test').run(this.c).then((result) => {
				result.each((_, item) => {
					// send initial table
					socket.emit('change', item);
				});
			}).catch(reject);
		});

		open('http://localhost:3000/');
	});
}).catch((e) => {
	console.log(e);
	process.exit(1);
});