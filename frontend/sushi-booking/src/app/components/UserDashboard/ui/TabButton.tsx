import { motion } from "framer-motion";
import classNames from "classnames";
import { ReactNode } from "react";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  activeColor?: string; // Thêm prop optional
}

export default function TabButton({
  active,
  onClick,
  icon,
  label,
  activeColor = "bg-blue-600",
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "flex items-center justify-center py-4 px-6 text-sm font-medium w-1/4 relative",
        active
          ? "text-white"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      )}
    >
      <span className="flex items-center gap-2 z-10">
        {icon}
        {label}
      </span>
      {active && (
        <>
          {/* Background cho active tab */}
          <motion.div
            layoutId="tabBackground"
            className={`absolute inset-0 ${activeColor} rounded-t`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
          />
          {/* Indicator line */}
          <motion.div
            layoutId="tabIndicator"
            className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        </>
      )}
    </button>
  );
}
