;(function (w, d) {

	// w.$ = function (cls) {
	// 	var elements = d.querySelectorAll(cls), len = elements.length,
	// 		arr = []
	// 	if (len > 0) {
	// 		if (len == 1) {
	// 			return elements[0]
	// 		} else {
	// 			for (var i = 0; i < len; i++) {
	// 				arr.push(elements[i])
	// 			}
	// 			return arr
	// 		}
	// 	}
	// 	return null
	// }

	// pollyfill
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (elt) {
			var len = this.length >>> 0,
				from = Number(arguments[1]) || 0
			from = (from < 0) ? Math.ceil(from) : Math.floor(from)
			if (from < 0) from += len
			for (; from < len; from++) {
				if (from in this && this[from] === elt) return from
			}
			return -1
		}
	}

	if (!Array.prototype.each) {
		Array.prototype.each = function (fn) {
			for (var i = 0, len = this.length; i < len; i++) {
				fn(this[i], i)
			}
		}
	}

	var e = w.HTMLElement || w.Element,
		noClassList = !('classList' in document.documentElement)
	e.prototype.find = function (target) {
		return this.querySelector(target) || null
	}
	e.prototype.on = function (event, fn, fn2) {
		var that = this, isIe = that.addEventListener ? false : true,
			addEventListener = isIe ? that.attachEvent : that.addEventListener

		if (isIe) {
			if (event == 'input') {
				event = 'propertychange'
			}
		}

		event = isIe ? 'on' + event : event
		addEventListener.call(that, event, function (e) {
			var target = e.target || e.srcElement,
				parent = target.parentNode

			if (e.type == 'propertychange') {
				if (e.propertyName.toLowerCase() != 'value') {
					return false
				}
			}

			if (typeof fn == 'function') {
				fn.call(that, e)
			} else {
				var reg = new RegExp(fn, 'i')
				if (target && reg.test(target.nodeName)) {
					if (fn2) {
						fn2.call(target, e)
					}
				} else if (parent && reg.test(parent.nodeName)) {
					if (fn2) {
						fn2.call(parent, e)
					}
				}
			}
		})
	}
	e.prototype.each = function (fn) {
		var arr = []
		arr.push(this)
		Array.prototype.each.call(arr, fn)
	}
	
	$.prototype.appendChild = $.prototype.append;
	
	e.prototype.hasClass = function (cls) {
		var clsList = noClassList ? this.getAttribute('class') || '' : (
			this.className ? this.className :
				(this.classList.value ? this.classList.value : '')
		)
		return clsList.indexOf(cls) >= 0 ? true : false
	}
	e.prototype.addClass = function (cls) {
		if (noClassList) {
			var clas = this.getAttribute('class'),
				clasArr = clas ? clas.split(' ') : []
			if (clasArr.indexOf(cls) < 0) {
				clasArr.push(cls)
			}
			this.setAttribute('class', clasArr.join(' '))
		} else {
			var clsList = this.classList
			clsList.add(cls)
		}
	}
	e.prototype.removeClass = function (cls) {
		if (noClassList) {
			var clas = this.getAttribute('class'),
				clasArr = clas ? clas.split(' ') : [],
				clasIdx = clasArr.indexOf(cls)
			if (clasIdx >= 0) clasArr.splice(clasIdx, 1)
			this.setAttribute('class', clasArr.join(' '))
		} else {
			var clsList = this.classList
			clsList.remove(cls)
		}
	}
	e.prototype.trigger = function (eventName) {
		var oldBrowser = this.attachEvent ? true : false
		if (oldBrowser) {
			var event = document.createEventObject()
			event.msg = 'by trigger'
			eventName = 'on' + eventName

			this.fireEvent(eventName, event)
		} else {
			var e = document.createEvent('MouseEvents')
      e.initMouseEvent(eventName, true, true, document.defaultView, 0, 0, 0, 0, 0,false, false, false, false, 0, null);
			// e.initMouseEvent(eventName, true)
			e.msg = 'by trigger'
			this.dispatchEvent(e)
		}
	}
	e.prototype.next = function () {
		return this.nextSibling || this.nextElementSibling
	}
	e.prototype.attr = function (attr, val) {
		if (val === null) {
			this.removeAttribute(attr)
		} else if (val === undefined) {
			return this.getAttribute(attr)
		} else {
			this.setAttribute(attr, val)
		}
	}
	e.prototype.val = function () {
		var val = this.value, placeholder = this.getAttribute('data-placeholder')
		return placeholder == this.value ? '' : val
	}

	$.ajax = function (opt) {
		//var tokenName = "token" ;
		opt.timeout = opt.timeout || (10 * 1000)
		var requestType = opt.callback ? jsonpType : ajaxType

		requestType({
			url: opt.url,
			async: opt.async,
			type: opt.type || 'GET',
			dataType: opt.dataType || 'JSON',
			scriptCharset: 'UTF-8',
			data: opt.data,
			timeout: opt.timeout,
			callback: opt.callback,
			headers: {
				//"token" : getToken()
			},
			beforeSend: function () {
				if (typeof(opt.beforeSend) == 'function') {
					opt.beforeSend()
				}
			},
			success: function (sucData) {
				if (opt.success) opt.success.call(this, sucData)
			},
			error: function (errData) {
				if (opt.error) {
					opt.error.call(this, errData)
				}
			},
			complete: function () {
				if (typeof(opt.complete) == 'function') {
					opt.complete()
				}
			}
		})

		function jsonpType(options) {
			options = options || {}
			if (!options.url || !options.callback) {
				throw new Error('参数错误')
			}

			var callbackName = ('jQuery' + Math.random()).replace('.', '')
			var oHead = document.getElementsByTagName('head')[0]
			options.data = options.data || {}
			options.data[options.callback] = callbackName

			var params = formatParams(options.data)
			var oS = document.createElement('script')
			oHead.appendChild(oS)

			window[callbackName] = function (json) {
				oHead.removeChild(oS)
				clearTimeout(oS.timer)
				window[callbackName] = null
				options.success && options.success(json)
			}

			oS.src = options.url + '?' + params

			if (options.timeout) {
				oS.timer = setTimeout(function () {
					window[callbackName] = function () {
						oHead.removeChild(oS);
					}
					options.error && options.error({
						return_info: '请求超时'
					})
				}, options.timeout)
			}
		}

		function ajaxType(options) {
			options = options || {};
			options.type = (options.type || "GET").toUpperCase()
			options.dataType = options.dataType || "json"
			var params = formatParams(options.data)

			if (window.XMLHttpRequest) {
				var xhr = new XMLHttpRequest();
			} else {
				var xhr = new ActiveXObject('Microsoft.XMLHTTP')
			}

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					var status = xhr.status;
					if (status >= 200 && status < 300) {
						options.success && options.success(xhr.responseText, xhr.responseXML)
					} else {
						options.error && options.error(status)
					}
				}
			};

			if (options.type == 'GET') {
				xhr.open('GET', options.url + "?" + params, true)
				xhr.send(null)
			} else if (options.type == 'POST') {
				xhr.open('POST', options.url, true)
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
				xhr.send(params)
			}
		}

		function formatParams(data) {
			var arr = []
			for (var name in data)
				arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
			return arr.join('&')
		}
	}

	$.notify = function (message) {
		var container = $('.pay-wrap.active .notify')
		if (!container) return false
		container.html("")
		if (!message) return false
		console.log(message)
		var item = document.createElement('div')
		item.className = 'notify__item'
		item.innerHTML = '<span class="message">' + message + '</span><a class="closer">&times;</a>'
		container.append(item)
		// item.style.opacity = '0'
		// item.style.background = '#ccc'
		// setTimeout(function () {
		//   item.style.opacity = '1'
		//   item.style.background = '#f2ffea'
		// }, 10)
		var closer = item.find('a.closer'),
			removeFn = function () {
				item.remove()
				removeFn = null
			}
		closer.on('click', removeFn)
		// setTimeout(removeFn, 5000)
		// setTimeout(function () {
		//   // item.style.opacity = '0'
		//   setTimeout(function () {
		//     // container.removeChild(item)
		//   }, 500)
		// }, 2000)
	}

	// Is IE Browser?
	w.isIe = document.all ? true : false

})(window, document)