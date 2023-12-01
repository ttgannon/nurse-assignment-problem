import { BASE_URL_API } from "../api";

export async function getUnits(accessToken: string) {
  try {
    const response = await fetch(
      `${BASE_URL_API}` + `/List?code=patientlist&identifier=systemlist|5332`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}, ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUnitPatients(accessToken: string, link: string) {
  const new_response = await fetch(link, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!new_response.ok) {
    throw new Error(
      `Error: ${new_response.status}, ${new_response.statusText}`,
    );
  }
  const new_data = await new_response.json();
  console.log("HELLO ", new_data);
  return new_data;
}
