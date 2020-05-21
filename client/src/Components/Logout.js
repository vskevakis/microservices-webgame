import React from "react";
import { Redirect } from "react-router-dom";

import { checkCookie, setCookie } from "../Authentication/cookies";

export function Logout(props) {
  setCookie("token", checkCookie(), 0);
  return <Redirect to="/" />;
}
