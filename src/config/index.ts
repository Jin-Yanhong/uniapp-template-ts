// 请求地址
const devRequestBaseUrl = 'http://localhost:5000/';

const prodRequestBaseUrl = 'http://192.168.2.196:8080/api/';

const mode = import.meta.env.NODE_ENV;

let RequestBaseUrl: string;
switch (mode) {
	case 'production':
		RequestBaseUrl = prodRequestBaseUrl;
		break;
	case 'development':
		RequestBaseUrl = devRequestBaseUrl;
		break;
	default:
		RequestBaseUrl = devRequestBaseUrl;
		break;
}

export { RequestBaseUrl };

// 图片公共路径
export const ImageBaseUrl = 'http://localhost:8080/static/';
