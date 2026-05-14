"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface CollapsibleMenuProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

const CollapsibleMenu: React.FC<CollapsibleMenuProps> = ({
  isOpen,
  children,
  className = "",
}) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.8, 0.25, 1], // smooth cubic-bezier
          }}
        >
          <motion.ul
            className={className}
            layout // Đây là điểm quan trọng giúp mượt layout
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollapsibleMenu;
