import { BASE_URL_API } from "../api";

export async function getUnitPatients(accessToken: string) {
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
    const new_url = data.entry[0].link[0].url;
    console.log(new_url);

    const new_response = await fetch(new_url, {
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
    // const new_data = await new_response.json();
    const new_data = await new_response.json();
    console.log(new_data);
    console.log("hi");

    console.log(new_data);
    return new_data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
