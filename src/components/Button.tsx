import React, { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
};

const Button = ({ children, ...rest }: ButtonProps) => {
  return <button {...rest}>{children}</button>;
};

export default Button;
