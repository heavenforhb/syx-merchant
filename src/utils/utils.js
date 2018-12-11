const os = require('os')

export function getHostName() {
	const {hostname} = os
	return hostname() || 'Computer'
}

export function getLocalIp() {
	const interfaces = os.networkInterfaces()
	for (let devName in interfaces) {
		const iface = interfaces[devName]
		for (let i = 0; i < iface.length; i++) {
			const alias = iface[i]
			if (
				alias.family === 'IPv4' &&
				alias.address !== '127.0.0.1' &&
				!alias.internal
			) {
				return alias.address
			}
		}
	}
}

export function getClientIp(req) {
	let ip = req.headers['x-forwarded-for'] ||
		(req.connection ? req.connection.remoteAddress : '') ||
		(req.socket ? req.socket.remoteAddress : '') ||
		(req.connection && req.connection.socket ? req.connection.socket.remoteAddress : '')
	return ip ? ip.split(':').pop() : '0.0.0.0'
}