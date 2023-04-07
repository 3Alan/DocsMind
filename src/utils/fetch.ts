import { baseURL } from './request';
import queryString from 'query-string';

export default async function fetchRequest(url: string, params: { [key: string]: any }) {
  const combineUrl = queryString.stringifyUrl({
    url: `${baseURL}${url}`,
    query: params
  });

  return fetch(combineUrl);
}
