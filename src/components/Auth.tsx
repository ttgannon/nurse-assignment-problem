import { useEffect, useState } from "react";
import { exchangeForJWT } from "../services/launch";
import { URL_FOR_ACCESS_CODE } from "../api";
import { useLocation, useOutletContext } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useOutletContext();

  const [accessToken, setAccessToken] = useState<string>("");

  const [accessCode, setAccessCode] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (accessCode) {
        const token = await exchangeForJWT(accessCode);
        if (token) {
          setAccessToken(token);
          setLoggedIn(true);
          localStorage.setItem("epic-access-token", token);
          navigate("/assignment");
        }
      }
    };
    fetchData();
  }, [accessCode, navigate, setAccessToken]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code) {
      setAccessCode(code);
    }
  }, [location.search]);

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
