import axios from 'axios';

const api = axios.create({
	baseURL: 'http://192.168.100.6:8081'
	//altere a linha a cima trocando localhost pelo ip da api 
	// baseURL: 'http://xxx.xxx.xxx.x:8081'
});

api.defaults.timeout = 500;

export { api };