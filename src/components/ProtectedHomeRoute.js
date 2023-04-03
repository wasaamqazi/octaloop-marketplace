import { useAuth } from "../firebase";
import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

export const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Link to="/home" /> : children;
};
