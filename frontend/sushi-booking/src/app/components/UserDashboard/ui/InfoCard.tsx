import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InfoItem {
  label: string;
  value: any;
  name: string;
  editable: boolean;
  icon?: ReactNode;
}

interface InfoCardProps {
  icon?: ReactNode;
  title: string;
  titleClassName?: string;
  editMode: boolean;
  items: InfoItem[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cardClassName?: string;
}

export default function InfoCard({
  icon,
  title,
  items,
  editMode,
  onInputChange,
}: InfoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-full">{icon}</div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">{item.label}</p>
            {editMode && item.editable ? (
              <input
                type="text"
                name={item.name}
                value={item.value}
                onChange={onInputChange}
                className="mt-1 w-full bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm font-medium text-gray-900">
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
