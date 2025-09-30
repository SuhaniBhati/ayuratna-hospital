// src/components/Card.jsx
import React from "react";

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl bg-white ${className}`}>{children}</div>
);

export default Card;

