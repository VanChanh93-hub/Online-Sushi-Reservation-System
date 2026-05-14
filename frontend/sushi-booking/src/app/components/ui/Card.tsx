"use client";
import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white shadow-md rounded-md p-4 hover:shadow-lg transition-shadow ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  header,
  children ="",
  className = "",
}: {
  header?: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={`text-lg sm:text-lg md:text-xl font-bold px-4 py-3 border-b border-gray-200 ${className}`} style={{color: "var(--title-color)"}}>
      <span>{header}</span>
      {children}
    </div>
  );
};

export const CardTitle = ({
  title,
  children ="",
  className = "",
}: {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>
      <span>{title}</span>
      {children}
    </h3>
  );
};

export const CardContent = ({
  content,
  children ="",
  className = "",
}: {
  content?: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={`p-4 text-sm text-gray-700 ${className}`}>
      <span>{content}</span>
      {children}
    </div>
  );
};