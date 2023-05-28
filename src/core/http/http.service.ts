import axios, {AxiosRequestConfig} from 'axios';

import {QueryParams} from './types';
import {UrlBuilder} from './url-builder';

export default class HttpService {
  apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  get httpService() {
    return axios;
  }

  index<T>(
    pathComponents: (string | number)[],
    queryParams?: QueryParams,
    options?: AxiosRequestConfig
  ) {
    const url: string = this.buildUrl(this.apiUrl, pathComponents, queryParams);
    return this.httpService.get<T>(url, options);
  }

  show<T>(
    pathComponents: (string | number)[],
    queryParams?: QueryParams,
    options?: AxiosRequestConfig
  ) {
    const url: string = this.buildUrl(this.apiUrl, pathComponents, queryParams);
    return this.httpService.get<T>(url, options);
  }

  create<T>(
    pathComponents: (string | number)[],
    body?: any,
    options?: AxiosRequestConfig
  ) {
    const url: string = this.buildUrl(this.apiUrl, pathComponents);
    return this.httpService.post<T>(url, body || {}, options);
  }

  update<T>(
    pathComponents: (string | number)[],
    body?: any,
    options?: AxiosRequestConfig
  ) {
    const url: string = this.buildUrl(this.apiUrl, pathComponents);
    return this.httpService.put<T>(url, body || {}, options);
  }

  destroy<T>(
    pathComponents: (string | number)[],
    queryParams?: QueryParams,
    options?: AxiosRequestConfig
  ) {
    const url: string = this.buildUrl(this.apiUrl, pathComponents, queryParams);
    return this.httpService.delete<T>(url, options);
  }

  buildUrl(
    apiUrl: string,
    pathComponents: (string | number)[],
    queryParams?: {[k: string]: string}
  ) {
    const urlBuilder = new UrlBuilder();
    urlBuilder.withPath(apiUrl);

    for (const pathComponent of pathComponents) {
      urlBuilder.withPath(pathComponent.toString());
    }

    for (const queryParam in queryParams) {
      if (queryParams.hasOwnProperty(queryParam)) {
        urlBuilder.search(queryParam, queryParams[queryParam]);
      }
    }

    return urlBuilder.url;
  }

  mergeQueryParams(url: string, params: any) {
    let queryString = '';

    for (const key in params) {
      if (!queryString) {
        queryString = `?${encodeURIComponent(key)}=${encodeURIComponent(
          params[key]
        )}`;
      } else {
        queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(
          params[key]
        )}`;
      }
    }

    return url + queryString;
  }
}
