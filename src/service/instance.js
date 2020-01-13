import axios from 'axios';

const token = 'token';
const isProduction = process.env.NODE_ENV === 'production';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 30 * 1000,
  transformRequest: (data, headers) => {
    headers.Authorization = token;
  }
});

if(!isProduction) {
  instance.interceptors.request.use((config) => {
    const { method, url, params, data } = config;
    console.log(`%c${method}: %c${url}`, 'color: red', 'color: yellow');
    if (params) {
      console.log('%cparams:', 'color: orange', params)
    }
    if (data) {
      console.log('%cdata: ', 'color: orange', data)
    }
    return config;
  });

  instance.interceptors.response.use((response) => {
    console.log('%cresult: ', 'color: lawngreen', response.data);
    return response;
  })
}

export default instance
