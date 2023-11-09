import { useEffect } from "react";

export const EPIC_URL =
  "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/STU3/List?code=patientlist&identifier=systemlist|5332";
export const NON_PROD_CLIENT_ID = "db1ba939-2546-4960-a094-64b0db1496b4";

//this URL is used to connect with sign in
export const URL_FOR_ACCESS =
  "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&redirect_uri=http%3A//localhost%3A5174&client_id=db1ba939-2546-4960-a094-64b0db1496b4&state=1234&scope=Patient.search";

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

// useEffect(() => {
//   if (code) {
//     console.log({
//       code: code,
//     });

//     const params = new URLSearchParams();
//     params.append("grant_type", "authorization_code");
//     params.append("code", code);
//     params.append("redirect_uri", physician_redirect_uri);
//     params.append("client_id", physician_client_id);
//     params.append("state", "1234");

//     let tokenUrl = fhirServerBaseUrl + "/oauth2/token";

//     fetch(tokenUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         // Accept: 'application/x-www-form-urlencoded',
//       },
//       body: params,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.access_token) {
//           localStorage.setItem("accessToken", data.access_token);
//           localStorage.setItem("patient", data.patient);
//           navigate("/physician");
//         }
//         console.log({
//           tokenData: data,
//         });
//       });
//   } else {
//     console.log("no code");
//   }
// }, []);

// const handleSubmit = (e) => {
//   e.preventDefault();
//   const authLink = `${fhirServerBaseUrl}/oauth2/authorize?response_type=code&redirect_uri=${physician_redirect_uri}&client_id=${physician_client_id}&scope=openid%20fhirUser&aud=${audience}`;
//   window.location.href = authLink;
// };
// useEffect(() => {
//   if (code) {
//     console.log({
//       code: code,
//     });

//     const params = new URLSearchParams();
//     params.append("grant_type", "authorization_code");
//     params.append("code", code);
//     params.append("redirect_uri", physician_redirect_uri);
//     params.append("client_id", physician_client_id);
//     params.append("state", "1234");

//     let tokenUrl = fhirServerBaseUrl + "/oauth2/token";

//     fetch(tokenUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         // Accept: 'application/x-www-form-urlencoded',
//       },
//       body: params,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.access_token) {
//           localStorage.setItem("accessToken", data.access_token);
//           localStorage.setItem("patient", data.patient);
//           navigate("/physician");
//         }
//         console.log({
//           tokenData: data,
//         });
//       });
//   } else {
//     console.log("no code");
//   }
// }, []);
