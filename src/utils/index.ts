// 网络请求
import apiUrl from '../api/apiUrls';
import { RequestBaseUrl } from '../config';
import { getListOrLoadMore, navTypeList } from '../enum/index';
import type { requestMethods, animationType } from '../type/index';
import type { optionsType, headerType, dictType, fieldNameType, listHttpOptionType, navigateOptionType, toastOptionType } from '@/interface/index';

/**
 * @description 判断是否登录
 * @returns
 */
export function isLogin(): boolean {
	let isLogionFlag: boolean = JSON.parse(getStorageItem('isLogin') as string) || false;
	return isLogionFlag;
}

interface responseType {
	code: string;
	msg: string;
	data: any;
}

/**
 * @description 网络请求
 * @param { optionsType } options
 * @param { Function } callback
 * @param { Function } errCallback
 */
export function httpRequest(options: optionsType, callback: Function, errCallback: Function | null = null) {
	let { url = '' as string, data = {}, header = {}, LoadingVisible = false as boolean } = options;

	let method: requestMethods = (options.method ?? 'GET') as requestMethods;

	if (LoadingVisible) {
		showLoading();
	}
	let resObj = {
		code: {
			success: 200,
			userNotAuthorized: 50004,
			userErr: 50003,
			notFound: 404,
		},
		msg: 'msg',
	};
	let defaultOptions = {
		data: {},
		header: () => {
			const header: Partial<headerType> = {};
			header['Content-Type'] = 'application/json;charset=utf-8';
			if (isLogin()) {
				header['Authorization'] = getStorageItem('Authorization') as string;
			}
			return header;
		},
	};
	// Object.assign(target, source) target 为合并后的对象，该方法返回合并后的对象，如果有同名属性，会被覆盖
	// 合并全局 data 数据
	Object.assign(data, defaultOptions.data);
	// 合并全局 data 数据
	Object.assign(header, defaultOptions.header());

	new Promise((resolve, reject) => {
		uni.request({
			url: RequestBaseUrl + url,
			method: method,
			data: data,
			header: header,
			success: (res: RequestSuccessCallbackResult) => {
				let data = res.data as unknown as responseType;
				let code = data?.code as unknown as number;
				if (LoadingVisible) {
					hideLoading();
				}
				switch (code) {
					case resObj.code.success:
						resolve(data.data);
						break;
					case resObj.code.userNotAuthorized:
						showToast({ title: '用户未登录' });
						navTo('/pages/login');
						reject(data['msg']);
						break;
					case resObj.code.notFound:
						showToast({ title: '请求地址不正确' });
						reject(data['msg']);
						break;
					default:
						showToast({ title: '未知错误' });
						reject(data['msg']);
						break;
				}
			},
			fail: err => {
				if (LoadingVisible) {
					hideLoading();
				}
				reject({
					msg: 'httpRequest Failed',
					url,
					method,
					data,
					header,
					err,
				});
			},
		});
	})
		.then(res => {
			callback(res);
		})
		.catch(err => {
			console.log('httpRequest Error', { url, method, data, header }, err);
			if (err?.code === resObj.code.userErr) {
				let { __route__ } = getCurrentPages()[0] as any;
				uni.clearStorageSync();
				uni.reLaunch({
					url: '/' + __route__,
					fail(err: Error) {
						console.log('reLaunch Error', err);
					},
				});
			}
			if (errCallback) {
				errCallback(err);
			}
		});
}

export function fileUpload(options: optionsType, callback: Function) {
	let { data = {}, header = {}, LoadingVisible = false } = options;
	let defaultOptions = {
		data: {},
		header: {},
		method: 'post',
	};
	// 合并全局 data 数据
	Object.assign(data, defaultOptions.data);
	// 合并全局 header 数据
	Object.assign(header, defaultOptions.header);
	uni.chooseImage({
		count: 1,
		crop: {
			quality: 100,
			width: 300,
			height: 300,
			resize: true,
		},
		success: result => {
			if (LoadingVisible) {
				showLoading();
			}
			new Promise((resolve, reject) => {
				uni.uploadFile({
					url: RequestBaseUrl + apiUrl.FileUpload,
					filePath: result?.tempFilePaths[0] as string,
					name: 'file',
					header: header,
					formData: {
						...data,
					},
					success: res => {
						if (LoadingVisible) {
							hideLoading();
						}
						let data = JSON.parse(res.data as any);
						if (data.code === 0) {
							resolve(data);
						} else {
							reject();
						}
					},
					fail: err => {
						if (LoadingVisible) {
							hideLoading();
						}
						reject(err);
					},
				});
			})
				.then(result => {
					callback(result);
				})
				.catch(err => {
					console.log('fileUpload Failed :', err);
				});
		},
		fail: (err: Error) => {
			console.log('chooseImage Failed :', err);
		},
	});
}

export function handleRedirect(urlPath: string, navType = navTypeList.navTo) {
	let data: string = JSON.stringify({
		type: navType,
		to: urlPath,
	});
	confirmModal(
		'提示',
		'您尚未登录，是否現在登录？',
		function () {
			setStorageItem('redirect', data);
			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/login/index',
					fail: (err: Error) => {
						console.log('handleRedirect Error', err, {
							urlPath,
						});
					},
				});
			}, 200);
		},
		function () {
			// showToast('用戶取消了登錄！');
		}
	);
}

/**
 * @description 页面重定向 使用绝对路径
 * @param { string } urlStr 目标页面路径
 * @param { boolean } isNeedLogin 目标页面是否需要登录
 * @param { string } navType 目标页面导航类型
 */
export function navTo(urlStr: string, isNeedLogin: boolean = false, navType: navTypeList = navTypeList.navTo) {
	let isLoginUrl = urlStr == '/pages/login/index';
	if (isLoginUrl) {
		let data = JSON.stringify({
			type: navType,
			to: urlStr,
		});
		setStorageItem('redirect', data);
		uni.navigateTo({
			url: urlStr,
			fail: (err: Error) => {
				console.log('navigateTo Error', err, {
					urlStr,
				});
			},
		});
		return;
	}
	if (isNeedLogin == true && isLogin() == false) {
		handleRedirect(urlStr, navType);
	} else {
		uni.navigateTo({
			url: urlStr,
			fail: (err: Error) => {
				console.log('navigateTo Error', err, {
					urlStr,
				});
			},
		});
	}
}

export function switchTab(urlStr: string, isNeedLogin = false, navType = navTypeList.switchTab) {
	if (isNeedLogin == true && isLogin() == false) {
		handleRedirect(urlStr, navType);
	} else {
		uni.switchTab({
			url: urlStr,
			fail: (err: Error) => {
				console.log('switchTab Error', err, {
					urlStr,
				});
			},
		});
	}
}

/**
 * @description 页面重定向
 * @param { string } urlStr 目标页面路径
 * @param { boolean } isNeedLogin 目标页面是否需要登录
 * @param { string } navType 目标页面导航类型
 */
export function redirectTo(urlStr: string, isNeedLogin: boolean = false, navType: navTypeList = navTypeList.redirectTo) {
	if (isNeedLogin == true && isLogin() == false) {
		handleRedirect(urlStr, navType);
	} else {
		uni.redirectTo({
			url: urlStr,
			fail: (err: Error) => {
				console.log('redirectTo', err, {
					urlStr,
				});
			},
		});
	}
}
// 返回某一级页面
export function navBack({ animation = 'pop-in' as animationType, delta = 1, duration = 300 } = {} as navigateOptionType) {
	uni.navigateBack({
		delta: delta,
		animationType: animation,
		animationDuration: duration,
	});
}
// 显示悬浮轻提示
export function showToast({ title = '', icon = 'none', duration = 2000, mask = false } = {} as toastOptionType) {
	uni.showToast({
		title: title,
		icon: icon,
		duration: duration,
		mask: mask,
	});
}

/**
 * @description 显示 loading 动画
 * @param title
 * @param mask
 */
export function showLoading(title = '加载中', mask = false) {
	uni.showLoading({
		title,
		mask,
	});
}

/**
 * @description 隐藏 loading 动画
 */
export function hideLoading() {
	uni.hideLoading();
}

/**
 * @description 弹出确认框
 * @param { string } text 提示标题
 * @param { string } content 提示内容
 * @param { function } resolveCallback 确认的回调
 * @param { function } rejectCallback 取消的回调
 */
export function confirmModal(text: string, content: string, resolveCallback: Function, rejectCallback: Function) {
	uni.showModal({
		title: `${text}`,
		content: `${content}`,
		success: function (res) {
			if (res.confirm) {
				resolveCallback();
			} else if (res.cancel) {
				rejectCallback();
			}
		},
	});
}
/**
 * @description 下拉刷新
 * @param { function } Callback 回调
 * @param { function } delay  延迟时间
 */
export function startRefresh(Callback: Function, delay: number = 500) {
	Callback();
	setTimeout(() => {
		stopRefresh();
	}, delay);
}
/**
 * 停止下拉刷新
 */
function stopRefresh() {
	uni.stopPullDownRefresh();
}

/**
 *
 * @param { object } option listHttpOptionType
 * @param { function } callback 成功回调
 */
export function reachBottom(option: listHttpOptionType, callback: Function | null = null) {
	let {
		url = '',
		_this = {} as any,
		fieldName = {} as fieldNameType,
		data = {},
		LoadingVisible = true,
		pageSize = 10,
		pageNum = 1,
	} = option as listHttpOptionType;
	// 是否还有下一页
	let { hasNextPageField = 'hasNextPage' } = fieldName;

	if (_this[hasNextPageField] as boolean) {
		// 到达底部当前页 +1
		pageNum += 1;
		// 然后发起新的请求
		listHttpRequest({ url, _this, fieldName, data, type: getListOrLoadMore.loadMore, LoadingVisible, pageSize, pageNum }, (callback = null));
	}
}

/**
 *
 * @param { object } option listHttpOptionType
 * @param { function } callback 成功回调
 */
export function listHttpRequest(option: listHttpOptionType, callback: Function | null = null) {
	// 设置默认值，页面里面可以省去一些不必要的参数
	let {
		url = '',
		_this = {} as any,
		fieldName = {} as fieldNameType,
		data = {},
		LoadingVisible = true,
		pageSize = 10,
		pageNum = 1,
		type = getListOrLoadMore.getList,
	} = option;

	let { hasNextPageField = 'hasNextPage', ListField = 'List', pageNumField = 'pageNum', pageSizeField = 'pageSize' } = fieldName as fieldNameType;

	_this[pageSizeField] = pageSize;
	_this[pageNumField] = pageNum;
	_this[hasNextPageField] = true;
	_this.$forceUpdate();

	httpRequest(
		{
			url,
			data: {
				pageSize: pageSize,
				pageNum: pageNum,
				// 接收额外的查询参数
				...data,
			},
			LoadingVisible: LoadingVisible as boolean,
		},
		function (res: Array<any>) {
			let hasNextPage: boolean = res.length < pageSize ? false : true;
			if (type == getListOrLoadMore.loadMore) {
				// 加载更多
				_this[ListField] = [..._this[ListField], ...res];
			} else if (type == getListOrLoadMore.getList) {
				// 下拉刷新
				_this[ListField] = [...res];
			}
			_this[hasNextPageField] = hasNextPage;
			_this.$forceUpdate();
			if (callback) {
				callback(hasNextPage, res);
			}
		}
	);
}
/**
 * @description 获取字典数据
 * @param {*} titleId 待查字典类型 id
 * @param {*} Callback 请求成功数据的回调
 */
export function getDictData(titleId: string, Callback: Function) {
	httpRequest(
		{
			url: apiUrl.DataDict,
			data: {
				tid: titleId,
			},
		},
		function (res: responseType) {
			Callback(res);
		}
	);
}
/**
 *
 * @param { string } key 存储数据的 key
 * @param { string } value 存储数据的 value
 * @returns
 */
export function setStorageItem(key: string, value: object | Array<any> | string) {
	uni.setStorage({
		key: key,
		data: value,
		fail: (error: Error) => {
			console.log('setStorageSync Error :', error);
		},
	});
}

/**
 *
 * @param { string } key 存储数据的 key
 * @returns
 */
export function getStorageItem(key: string): Object | Array<any> | string {
	let value = uni.getStorageSync(key);
	return value ? value : false;
}

/**
 *
 * @param { string } key 存储数据的 key
 * @returns
 */
export function removeStorageItem(key: string) {
	uni.removeStorage({
		key: key,
		fail: (err: Error) => {
			console.log('removeStorage Error', err);
		},
	});
}

/**
 * @description 格式化时间显示
 * @param timestamp 时间戳
 * @returns
 */
export function getDateTime(timestamp: number): string {
	let date = new Date(timestamp * 1000);
	let dateStr =
		date.getFullYear() +
		'年/' +
		(date.getMonth() + 1) +
		'月' +
		date.getDay() +
		'日 ' +
		(date.getHours() > 10 ? date.getHours() : '0' + date.getHours()) +
		':' +
		(date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes());
	return dateStr;
}

/**
 * @description 字段值解释翻译
 * @param { array } collection 对照数据
 * @param { string } value 待翻译的值
 * @param { string } collectionField 待翻译的字段 默认 'value'
 * @param { string } collectionLabel 目标值的字段 默认 'label'
 * @returns
 */
export function fieldTranslate(collection: Array<dictType>, value: number | string, collectionField: string = 'value', collectionLabel: string = 'label') {
	if (collection && value !== undefined && value !== null) {
		if (Object.prototype.toString.call(collection) === '[object Array]') {
			let checked = collection.find(ele => {
				return ele[collectionField] == value;
			});
			let tips = (checked && checked[collectionLabel]) || '';
			return tips;
		} else {
			console.log('Field Translate Error：类型必须为 Array');
			return '';
		}
	} else {
		console.log('Field Translate Error：数据字段集合、为必须参数!');
		return '';
	}
}
