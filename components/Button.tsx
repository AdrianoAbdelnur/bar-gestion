"use client";

import { Icon } from "./Icon";

interface ButtonProps {
  label: string;
  icon?: string;
  onClick?: () => void;
  filled?: boolean;
}

export const Button = ({ label, icon, onClick, filled }: ButtonProps) => {
  const base =
    "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 text-base font-bold tracking-[0.015em] w-full font-body transition";
  const styles = filled
    ? "bg-primary text-white hover:bg-primary/90"
    : "bg-transparent text-primary hover:bg-primary/10";

  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      {icon && <Icon name={icon} className="mr-2" />}
      <span className="truncate">{label}</span>
    </button>
  );
};