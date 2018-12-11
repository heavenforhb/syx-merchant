import * as base from '../base'
import {commonApi as apiConfig, System as systemConfig} from '../../config'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

export async function upload(ctx) {
	try {
		const {files} = ctx.request.body
		const {file} = files || {}
		if (!files || !file) {
			return ctx.body = base.error('请提交文件')
		}
		if (systemConfig.uploadFileExt.indexOf(file.type) < 0) {
			return ctx.body = base.error('文件格式不支持')
		}
		const {type, size} = file
		let tmpPath = path.normalize(file.path)

		let result = await fetch(apiConfig.fileServer, {
			method: 'POST',
			headers: {
				'Content-Type': type,
				'Content-Length': size
			},
			body: fs.createReadStream(tmpPath)
		}).then(response => response.json())
		if (result.ret) {
			const {info} = result
			ctx.body = base.success(info.md5)
			// 1秒后删除临时文件
			setTimeout(() => fs.unlink(tmpPath), 1000)
		} else {
			ctx.body = base.error(result.error.message)
		}

	} catch (err) {

		ctx.body = base.error(err)
	}
}

