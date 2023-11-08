export const EPIC_URL =
  "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/STU3/List?code=patientlist&identifier=systemlist|5332";
export const NON_PROD_CLIENT_ID = "db1ba939-2546-4960-a094-64b0db1496b4";

//this URL is used to connect with sign in
export const URL_FOR_ACCESS =
  "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&redirect_uri=https://localhost:5174&client_id=db1ba939-2546-4960-a094-64b0db1496b4&state=12345&aud=https%3A%2F%2Ffhir.epic.com";

export async function getEpicApiCall() {
  const options = {
    method: "GET",
    url: "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize",
    params: {
      response_type: "code",
      redirect_uri: "https://localhost:5174",
      client_id: "db1ba939-2546-4960-a094-64b0db1496b4",
      aud: "https://fhir.epic.com",
      scope: "patient_read",
    },
    headers: {
      "Content-type": "application/json",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
}

export function getAuthorizationTokenFromEpic() {
  const options = {
    method: "GET",
    headers: {
      cookie:
        "EpicPersistenceCookie=!JVjVPJqUUVMmWt09o73WKWf%2F55KMu8LkxzXUK1iwS87A5QbrArXKO8kir36SZVUg5dv8gQdEnPJ8WQ0%3D",
    },
  };

  fetch(
    "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A5174&client_id=db1ba939-2546-4960-a094-64b0db1496b4&state=12345&aud=https%3A%2F%2Ffhir.epic.com",
    options,
  )
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}
