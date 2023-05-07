import { createSSRApp } from 'vue';
import App from './App.vue';
import { ImageBaseUrl } from './config/index.js';
import { hasNextPage, navTypeList, pageNum, pageSize } from './enum';
import { confirmModal, fieldTranslate, getDateTime, httpRequest, navBack, navTo, redirectTo, showToast, switchTab } from './utils/index.js';

export function createApp() {
	const app = createSSRApp(App);
	// 常量
	app.config.globalProperties.GlobalImageBaseUrl = ImageBaseUrl;
	app.config.globalProperties.pageSize = pageSize;
	app.config.globalProperties.pageNum = pageNum;
	app.config.globalProperties.hasNextPage = hasNextPage;
	app.config.globalProperties.navTypeList = navTypeList;
	// 根实例方法
	app.config.globalProperties.httpRequest = httpRequest;
	app.config.globalProperties.navTo = navTo;
	app.config.globalProperties.switchTab = switchTab;
	app.config.globalProperties.redirectTo = redirectTo;
	app.config.globalProperties.navBack = navBack;
	app.config.globalProperties.showToast = showToast;
	app.config.globalProperties.confirmModal = confirmModal;
	app.config.globalProperties.fieldTranslate = fieldTranslate;
	app.config.globalProperties.getDateTime = getDateTime;

	return {
		app,
	};
}
