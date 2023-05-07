// 列表页相关配置
export const pageSize = 10;
export const pageNum = 1;
export const hasNextPage = true;

// 数据渲染类型 加载更多 | 刷新数据
export enum getListOrLoadMore {
	getList = "getList",
	loadMore = "loadMore",
}

// 页面导航方式
export enum navTypeList {
	navTo = "navTo",
	switchTab = "switchTab",
	redirectTo = "redirectTo",
}
