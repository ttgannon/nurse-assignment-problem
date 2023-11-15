export const NON_PROD_CLIENT_ID = "db1ba939-2546-4960-a094-64b0db1496b4";
export const redirect_uri = "http://localhost:5174";
export const CLIENT_SECRET =
  "dJVuZp32eS+cBBbqw1wlhcIHGzpXn1itwdzQqDDs402b5bLVNBklPr2wuiRgPC/Ti106rXEeyTSO3VbppN08tg==";

//link to exchange access code for token
export const URL_FOR_TOKEN =
  "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token";

//this URL is used to connect with sign in on launch
export const URL_FOR_ACCESS_CODE =
  "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&redirect_uri=http%3A//localhost%3A5174&client_id=db1ba939-2546-4960-a094-64b0db1496b4&state=1234&scope=Patient.search, Patient.Read, List.Search, List.Read";

//APIs
export const BASE_URL_API =
  "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/STU3";
