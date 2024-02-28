import { getUnits, getUnitPatients } from "../src/services/apiCalls"; // Update the import path as per your project structure
import fetchMock from "jest-fetch-mock";

// Mock the fetch function
fetchMock.enableMocks();

describe("Epic API Functions", () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  // Test getUnits function
  it("should fetch units from the Epic API", async () => {
    const accessToken = "YOUR_ACCESS_TOKEN";
    const mockUnits = [
      { id: 1, name: "Unit 1" },
      { id: 2, name: "Unit 2" },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockUnits));

    const units = await getUnits(accessToken);
    expect(units).toEqual(mockUnits);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        "/List?code=patientlist&identifier=systemlist|5332",
      ),
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: `Bearer ${accessToken}`,
        }),
      }),
    );
  });

  // Test getUnitPatients function
  it("should fetch unit patients from the Epic API", async () => {
    const accessToken = "YOUR_ACCESS_TOKEN";
    const mockPatients = [
      { id: 1, name: "Patient 1" },
      { id: 2, name: "Patient 2" },
    ];
    const link = "https://example.com/api/patients";

    fetchMock.mockResponseOnce(JSON.stringify(mockPatients));

    const patients = await getUnitPatients(accessToken, link);
    expect(patients).toEqual(mockPatients);
    expect(fetchMock).toHaveBeenCalledWith(
      link,
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: `Bearer ${accessToken}`,
        }),
      }),
    );
  });
});
