import {
  URL_FOR_TOKEN,
  NON_PROD_CLIENT_ID,
  redirect_uri,
  CLIENT_SECRET,
} from "../api";

export async function exchangeForJWT(code: string): Promise<string> {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  try {
    const response = await fetch(URL_FOR_TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(
          NON_PROD_CLIENT_ID + ":" + CLIENT_SECRET,
        )}`,
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}, ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
