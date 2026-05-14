import { ButtonHTMLAttributes } from "react";

export const Button = ({
  children,
  className = "", 
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};
