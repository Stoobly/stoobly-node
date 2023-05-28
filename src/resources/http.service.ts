import axios, { AxiosRequestConfig } from 'axios';

import { QueryParams } from '../Types';
import { UrlBuilder } from './url-builder';

export default class HttpService {
  apiUrl: string;

  constructor(apiUrl: string) { 
    this.apiUrl = apiUrl;
  }

  get httpService() {
    return axios;
  }

  index(pathComponents: (string | number)[], queryParams?: QueryParams, options?: AxiosRequestConfig) {
    const url: string = this.buildUrl(this.apiUrl, pathComponents, queryParams);
    return this.httpService.get(url, options);
  }

  show(pathComponents: (string | number)[], queryParams?: QueryParams, options?: AxiosRequestConfig) {
    const url: string = this.buildUrl(this.apiUrl, pathComponents, queryParams);
    return this.httpService.get(url, options);
  }

  create(pathComponents: (string | number)[], body?: object, options?: AxiosRequestConfig) {
    const url: string = this.buildUrl(this.apiUrl, pathComponents);
    return this.httpService.post(url, body || {}, options);
  }

  update(pathComponents: (string | number)[], body?: object, options?: AxiosRequestConfig) {
    const url: string = this.buildUrl(this.apiUrl, pathComponents);
    return this.httpService.put(url, body || {}, options);
  }

  destroy(pathComponents: (string | number)[], queryParams?: QueryParams, options?: AxiosRequestConfig) {
    const url: string = this.buildUrl(this.apiUrl, pathComponents, queryParams);
    return this.httpService.delete(url, options);
  }

  buildUrl(apiUrl: string, pathComponents: (string | number)[], queryParams?: {[k: string]: string}) {
    const urlBuilder = new UrlBuilder();
    urlBuilder.withPath(apiUrl);

    for (const pathComponent of pathComponents) {
      urlBuilder.
         withPath(pathComponent.toString());
    }

    for (const queryParam in queryParams) {
      if (queryParams.hasOwnProperty(queryParam)) {
        urlBuilder.
           search(queryParam, queryParams[queryParam]);
      }
    }

    return urlBuilder.url;
  }

  mergeQueryParams(url: string, params: any) {
    let queryString = '';

    for (const key in params) {
      if (!queryString) {
        queryString = `?${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
      } else {
        queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
      }
    }

    return url + queryString;
  }
}
