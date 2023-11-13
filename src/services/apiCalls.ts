import { BASE_URL_API } from "../api";

export async function getUnitPatients() {
  try {
    const response = await fetch(`${BASE_URL_API}` + `/List`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}, ${response}`);
    }
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
