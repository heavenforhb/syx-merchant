import Koa from 'koa'

import json from 'koa-json'
// import onerror from 'koa-onerror'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'

import Routes from './routes/'

import ErrorRoutesCatch from './middleware/ErrorRoutesCatch'

import MicroService from './utils/MicroService'

import {getClientIp} from './utils/utils'

import {
	System as SystemConfig
} from './config'

const app = new Koa()
const path = require('path')
const fs = require('fs')

// error handler
// onerror(app)

// middlewares
app.use((ctx, next) => {
	let hostArr = ctx.request.header.host.split(':')
	if (hostArr[0] === 'localhost' || hostArr[0] === '127.0.0.1') {
		ctx.set('Access-Control-Allow-Origin', '*')
	}
	ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
	ctx.set('Access-Control-Allow-Credentials', true) // 允许带上 cookie
	return next()
})
	.use((ctx, next) => {
		return next()
	})
	.use(ErrorRoutesCatch())
	.use(bodyparser({
		enableTypes: ['json', 'form', 'text']
	}))
	// .use(views(__dirname + '/views', {
	//   extension: 'pug'
	// }))
	.use(json())
	.use(logger())
	.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(Routes.routes())
	.use(Routes.allowedMethods())

console.log('Now start API server on port ' + SystemConfig.serverPort + '...')
app.listen(SystemConfig.serverPort)

MicroService.start()

export default app