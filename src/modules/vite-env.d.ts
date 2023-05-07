/// <reference types="vite/client" />
/// <reference types="element-plus/dist/locale/zh-cn.mjs" />

export {};

declare module '*.vue' {
	interface ComponentCustomProperties {
		// $getStorage: (key: string) => any;
		GlobalImageBaseUrl?: string;
		pageSize?: number;
		pageNum?: number;
		hasNextPage?: number;
		navTypeList?: () => void;
		httpRequest?: () => void;
		navTo?: () => void;
		switchTab?: () => void;
		redirectTo?: () => void;
		navBack?: () => void;
		showToast?: () => void;
		confirmModal?: () => void;
		dateFormater?: () => string;
		fieldTranslate?: () => string;
		getDateTime?: () => string;
	}

	const component: DefineComponent<{}, {}, any>;
	export default component;
}
