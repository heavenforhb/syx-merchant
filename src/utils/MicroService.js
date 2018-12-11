import {Eureka} from 'eureka-js-client'
import fetch from 'node-fetch'
import FormData from 'form-data'
import {Eureka as EurekaConfig, System as SystemConfig} from '../config'

import {getLocalIp, getHostName, getClientIp} from './utils'

let localIp = getLocalIp(), hostName = getHostName()

import returnCode from '../constants/returnCode'

// eureka 实例
const client = new Eureka({
	instance: {
		app: EurekaConfig.app,
		hostName: localIp,
		ipAddr: localIp,
		statusPageUrl: `http://${localIp}:${SystemConfig.serverPort}/eurekaStatus`,
		port: EurekaConfig.port,
		vipAddress: EurekaConfig.vipAddress,
		dataCenterInfo: EurekaConfig.dataCenter,
	},
	eureka: EurekaConfig.serviceCenter
})

// 服务缓存
const _EUREKA_COUNT = {}
const _EUREKA_SERVICES = {}

function synServInstances(serviceName) {
	const tmpInstances = client.getInstancesByAppId(serviceName)
	_EUREKA_SERVICES[serviceName] = tmpInstances

	return _EUREKA_SERVICES[serviceName]
}

function synServInstances(serviceName) {
	const tmpInstances = client.getInstancesByAppId(serviceName)
	_EUREKA_SERVICES[serviceName] = tmpInstances

	return _EUREKA_SERVICES[serviceName]
}

function sunServInstances(serviceName) {
	const tmpInstances = client.getInstancesByAppId(serviceName)
}

function syncInstances(serviceName) {
	const tmpInstances = client.get
}

// 获取服务下的所有实例
function getServInstances(serviceName) {
	let tmpInstances = _EUREKA_SERVICES[serviceName]
	if (!tmpInstances) tmpInstances = synServInstances(serviceName)
	return tmpInstances
}

// 根据服务名分配实例
function getInstance(serviceName) {
	const tmpInstances = getServInstances(serviceName)
	if (!tmpInstances || !tmpInstances.length) return null
	//负载实例，节点均匀分配
	let total = tmpInstances.length
	let count = incrEurekaCount(serviceName)
	let tmpValue = count % total
	return tmpInstances[tmpValue]
}

function incrEurekaCount(serviceName) {
	if (!_EUREKA_COUNT[serviceName]) {
		return _EUREKA_COUNT[serviceName] = 1
	} else {
		return _EUREKA_COUNT[serviceName]++
	}
}

function request(service, data, url,header) {
	return new Promise((resolve, reject) => {
		let instanceUrl;
		let serviceName,servicePath;
		if(!service){
			if(url) instanceUrl = url
			else {
				reject('服务不能为空')
			}
		}else{
			let tmpArr = service.split(':')
			if (tmpArr.length <= 0) reject('Service Error!')
			serviceName = tmpArr[0], servicePath = tmpArr[1]
			
			servicePath[0] == '/' && (servicePath = servicePath.slice(1))
			let logStr = `Request Service: ${serviceName}, Path: ${servicePath}, Content: ${JSON.stringify(data)}`
			
			if (!_EUREKA_STARTED) reject('发现服务未开启')
			const instance = getInstance(serviceName)
			
			if (!instance) reject('服务实例不存在')
			
			instanceUrl = `http://${instance.ipAddr}:${instance.port.$}/${servicePath}`;
		}
		let	hasContent = false
		
		const form = new FormData()
    // console.log(data)
		if (data && typeof data == 'object' && Object.keys(data).length > 0) {
			hasContent = true
			Object.keys(data).filter(key => {
				return data[key] != null && data[key] !== '' && data[key] != undefined
			}).map(key => {
				form.append(key, data[key])
			})
		}
		// console.log('form', form)
		let method = "POST"
		if(header){
			method = header.method?header.method:'POST'
		}
		fetch(instanceUrl, {
			method ,
			body: hasContent ? form : null
		}).then(response => {
			return response.json()
		}).then(data => {
			if (data && data.status) {
				reject(`Service Provider Error! Service Name: ${serviceName}, Status: ${data.status}, Message: ${data.message}`)
			}
			if (data.returnCode == '00' || data.returnCode == '0000') {
				resolve(data.returnData)
			} else {
				reject(data.returnInfo)
			}
		})
			.catch(err => {
			reject(`请求服务出错: ${err.toString()}`)
		})
	})
}

let _EUREKA_STARTED = false
client.on('started', function () {
	_EUREKA_STARTED = true
})

client.on('registryUpdated', function () {
	// 同步服务列表
	console.log('Service List Updated!')
	for (let serName in _EUREKA_SERVICES) {
		synServInstances(serName)
	}
})

export default {
	start: function () {
		client.start()
	},
	stop: function () {
		client.stop()
	},
	request
}