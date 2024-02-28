import { CLIENT_SECRET, NON_PROD_CLIENT_ID, URL_FOR_TOKEN } from "../src/api";
import { exchangeForJWT } from "../src/services/launch"; // Update the import path as per your project structure
import fetchMock from "jest-fetch-mock";

// Mock the fetch function
fetchMock.enableMocks();

describe("OAuth 2.0 Authorization Process", () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it("should exchange code for JWT token", async () => {
    const mockAccessToken = "MOCK_ACCESS_TOKEN";
    const mockCode = "MOCK_AUTHORIZATION_CODE";

    // Mock response from OAuth token endpoint
    fetchMock.mockResponseOnce(
      JSON.stringify({ access_token: mockAccessToken }),
    );

    const accessToken = await exchangeForJWT(mockCode);

    expect(accessToken).toEqual(mockAccessToken);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(URL_FOR_TOKEN),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(
            NON_PROD_CLIENT_ID + ":" + CLIENT_SECRET,
          )}`,
        }),
      }),
    );
  });

  it("should throw an error if response is not ok", async () => {
    const mockCode = "MOCK_AUTHORIZATION_CODE";

    // Mock response with error status
    fetchMock.mockResponseOnce("", { status: 401, statusText: "Unauthorized" });

    await expect(exchangeForJWT(mockCode)).rejects.toThrow(
      "Error: 401, Unauthorized",
    );
  });
});
