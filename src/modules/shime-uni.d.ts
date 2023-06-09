export {};

declare module 'vue' {
	type Hooks = App.AppInstance & Page.PageInstance;

	interface ComponentCustomOptions extends Hooks {
		__route__?: string;
		hasNextPageField?: string;
		ListField?: string;
		pageNumField?: string;
		pageSizeField?: string;
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
		fieldTranslate?: () => string;
		getDateTime?: () => string;
	}
}
