import { URL_FOR_TOKEN, NON_PROD_CLIENT_ID, redirect_uri } from "../api";

export function checkQueryString() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  if (params.get("code")) {
    return params.get("code");
  }
  return false;
}

export function exchangeForJWT(code: string) {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  params.append("client_id", NON_PROD_CLIENT_ID);
  params.append("state", "1234");
  try {
    fetch(URL_FOR_TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  } catch (error) {
    console.error(error);
  }
}
