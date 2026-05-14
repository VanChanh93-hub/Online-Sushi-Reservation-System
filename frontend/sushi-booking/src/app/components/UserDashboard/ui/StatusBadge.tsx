import { motion } from "framer-motion";
import classNames from "classnames";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusClasses = {
    "Đã giao": "bg-green-100 text-green-800",
    "Đang xử lý": "bg-yellow-100 text-yellow-800",
    "Đã huỷ": "bg-red-100 text-red-800",
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={classNames(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        statusClasses[status as keyof typeof statusClasses] ||
          "bg-gray-100 text-gray-800"
      )}
    >
      {status}
    </motion.span>
  );
}
