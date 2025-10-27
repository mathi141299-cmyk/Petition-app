import Cookies from "js-cookie";

const setCookie = (key: string, value: object | string | any) => {
  let serializedValue = value;
  if (typeof value === "object") {
    serializedValue = JSON.stringify(value);
  }
  // Cookies.set(key, serializedValue);
  localStorage.setItem(key, serializedValue);
};

const getCookie = (key: string) => {
  // return Cookies.get(key);
  return localStorage.getItem(key);
};

const removeCookie = (key: string) => {
  // Cookies.remove(key);
  localStorage.clear();
};

const setQueryParams = (data: any, baseUrl: string) => {
  const keys = Object.keys(data);

  let queryString = "?";
  keys.map((key) => {
    if (data[key]) {
      queryString += `${key}=${data[key]}&`;
    }
  });
  if (queryString.endsWith("&")) {
    queryString = queryString.slice(0, -1);
  }

  const apiUrl = baseUrl + queryString;

  return apiUrl;
};
export { setCookie, getCookie, removeCookie, setQueryParams };
