import { useEffect, useState } from "react";
import { exchangeForJWT } from "../services/launch";
import { URL_FOR_ACCESS_CODE } from "../api";
import { useLocation } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

export const Auth = ({
  setAccessToken,
}: {
  setAccessToken: (token: string) => void;
}) => {
  const location = useLocation();

  const [accessCode, setAccessCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (accessCode) {
        const token = await exchangeForJWT(accessCode);
        if (token) {
          setAccessToken(token);
        }
      }
    };
    fetchData();
  }, [accessCode, setAccessToken]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code) {
      setAccessCode(code);
    }
  }, [location.search]);

  // useEffect(() => {
  //   localStorage.setItem("epic-access-token", accessToken);
  // }, [accessToken]);

  function getEpic(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.location.href = URL_FOR_ACCESS_CODE;
  }

  return (
    <>
      {!accessCode ? (
        <Form onSubmit={getEpic}>
          <Button type="submit" variant="success">
            Sign in
          </Button>
        </Form>
      ) : null}
    </>
  );
};
