// 图片公共路径
const ImageBaseUrl = 'http://localhost:8080/static/';

// 请求地址
const RequestUrl = {
	development: 'http://localhost:5000/',
	production: 'http://192.168.2.196:8080/api/',
};

const mode = import.meta.env.NODE_ENV as keyof typeof RequestUrl;

const RequestBaseUrl: string = RequestUrl[mode];

export { RequestBaseUrl, ImageBaseUrl };
