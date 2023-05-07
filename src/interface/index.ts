import type { getListOrLoadMore } from '@/enum';
import type { animationType, ShowToastOptionsIcon } from '@/type';

export interface optionsType {
	url: string;
	method?: string;
	data?: object;
	header?: string;
	LoadingVisible?: boolean;
}
export interface listHttpOptionType {
	url: string;
	_this: any;
	fieldName: fieldNameType;
	data: object;
	type: getListOrLoadMore.loadMore;
	LoadingVisible: boolean;
	pageSize: number;
	pageNum: number;
}

export interface headerType {
	'Content-Type'?: string;
	appName?: string;
	Authorization?: string;
}

export interface dictType {
	value?: string;
	label?: string;
	[propname: string]: any;
}

export interface fieldNameType {
	hasNextPageField: string;
	ListField: string;
	pageNumField: string;
	pageSizeField: string;
}

export interface navigateOptionType {
	animation: animationType;
	delta: number;
	duration: number;
}

export interface toastOptionType {
	title: string;
	icon?: ShowToastOptionsIcon;
	duration?: number;
	mask?: boolean;
}
