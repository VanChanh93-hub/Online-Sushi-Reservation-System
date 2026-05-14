import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface NotificationPopupProps {
  message: string;
  onClose: () => void;
}

const NotificationPopup = ({ message, onClose }: NotificationPopupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed top-6 right-6 z-50 max-w-sm w-full rounded-2xl shadow-lg p-5 flex items-start gap-4 border-l-[6px] backdrop-blur-sm"
      style={{
        background: "linear-gradient(135deg, #fdf6ed, #f9efe4)",
        borderColor: "#AF763E",
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      }}
    >
      <div className="pt-1">
        <Check
          className="w-6 h-6 drop-shadow-sm"
          style={{ color: "#AF763E" }}
        />
      </div>

      <div className="flex-1">
        <p
          className="font-medium text-[15px] leading-relaxed tracking-wide"
          style={{ color: "#5F3E1B" }}
        >
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="transition-all duration-200 p-1 rounded-full hover:bg-orange-100 active:scale-90"
        aria-label="Đóng thông báo"
      >
        <X className="w-4 h-4 text-gray-400 hover:text-[#AF763E]" />
      </button>
    </motion.div>
  );
};

export default NotificationPopup;
