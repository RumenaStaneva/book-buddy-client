import React, { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

const Button = ({ children, ...rest }: ButtonProps) => {
  return <button {...rest}>{children}</button>;
};

export default Button;
