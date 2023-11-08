import { EPIC_URL } from "../api";
import { Patient } from "../interfaces";

export async function fetchEpicData(): Promise<Patient[]> {
  //this data comes from Epic's List.Search (Patient List) (STU3) API. The API key changes every hour.
  //Can also use $.getJSON() method from jQuery
  //per epic doc tutorial: can use the _format query parameter
  try {
    const response = await fetch(EPIC_URL, config);
    console.log("hello");
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    const xmlString = await response.text();
    const xmlDocument = new DOMParser().parseFromString(xmlString, "text/xml");
    const patientsFromEpic = xmlDocument.querySelectorAll("entry item display");
    const patientsOnUnit = [];
    for (const patient of patientsFromEpic) {
      patientsOnUnit.push({ fullName: patient.getAttribute("value") || "" });
    }
    return patientsOnUnit;
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function getEpicData() {
  try {
    const response = await axios.get(URL);
    console.log(response);
  } catch (error) {
    throw new Error(error);
  }
}
