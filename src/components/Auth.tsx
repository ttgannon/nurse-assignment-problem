import { useEffect, useState } from "react";
import { exchangeForJWT } from "../services/launch";
import { URL_FOR_ACCESS_CODE } from "../api";
import { useLocation } from "react-router-dom";

export const Auth = () => {
  const location = useLocation();

  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (accessCode) {
        const token = await exchangeForJWT(accessCode);
        setAccessToken(token);
      }
    };
    fetchData();
  }, [accessCode]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code) {
      setAccessCode(code);
    }
  }, [location.search]);

  useEffect(() => {
    console.log(accessToken);
  }, [accessToken]);

  function getEpic(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.location.href = URL_FOR_ACCESS_CODE;
  }

  return (
    <>
      {!accessToken ? (
        <form onSubmit={getEpic}>
          <input type="submit" value="Click to Sign in" />
        </form>
      ) : null}
    </>
  );
};
