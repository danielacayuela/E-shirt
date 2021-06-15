import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Style from './Btn.module.css';

const LoginButton = () => {
  const { loginWithRedirect, loginWithPopup } = useAuth0();
  return (
    <button onClick={() => loginWithPopup()} className={Style.loginBtn}>
      LOG IN
    </button>
  );
};

export default LoginButton;