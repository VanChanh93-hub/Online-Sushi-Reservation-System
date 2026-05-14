"use client";

import { useState } from "react";
import { useAuth } from "../../../context/authContext";
import { motion, AnimatePresence } from "framer-motion";
import ProfileTab from "../../../components/UserDashboard/tabs/ProfileTab";
import SecurityTab from "../../../components/UserDashboard/tabs/SecurityTab";
import OrdersTab from "../../../components/UserDashboard/tabs/OrdersTab";
import VouchersTab from "../../../components/UserDashboard/tabs/VouchersTab";
import TabButton from "../../../components/UserDashboard/ui/TabButton";
import { User, Lock, History, Gift } from "lucide-react";

export default function UserDashboard() {
  const { user: authUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "orders" | "vouchers"
  >("profile");

  if (isLoading || !authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-wooden-light">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 border-t-4 border-[#AF763E] border-solid rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wooden-light bg-[url('/images/sushi-pattern.png')] bg-opacity-20 py-[60px] px-[90px]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#AF763E]">
            Tài khoản của tôi
          </h1>
          <p className="mt-3 text-lg text-gray-700">
            Quản lý thông tin cá nhân, bảo mật và đơn hàng
          </p>
          <div className="mt-4 h-1 w-24 mx-auto bg-[#AF763E] rounded-full"></div>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#AF763E]/20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="border-b border-[#AF763E]/20 bg-wooden"
          >
            <nav className="flex -mb-px">
              <TabButton
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
                icon={<User className="w-5 h-5" />}
                label="Thông tin cá nhân"
                activeColor="bg-[#AF763E]"
              />
              <TabButton
                active={activeTab === "security"}
                onClick={() => setActiveTab("security")}
                icon={<Lock className="w-5 h-5" />}
                label="Bảo mật"
                activeColor="bg-[#AF763E]"
              />
              <TabButton
                active={activeTab === "orders"}
                onClick={() => setActiveTab("orders")}
                icon={<History className="w-5 h-5" />}
                label="Đơn hàng"
                activeColor="bg-[#AF763E]"
              />
              <TabButton
                active={activeTab === "vouchers"}
                onClick={() => setActiveTab("vouchers")}
                icon={<Gift className="w-5 h-5" />}
                label="Voucher"
                activeColor="bg-[#AF763E]"
              />
            </nav>
          </motion.div>

          <div className="p-6 sm:p-8 bg-white/90">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfileTab user={authUser} />
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SecurityTab />
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <OrdersTab />
                </motion.div>
              )}

              {activeTab === "vouchers" && (
                <motion.div
                  key="vouchers"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <VouchersTab />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Phần trang trí cuối trang */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-[#AF763E]">
            <div className="w-8 h-1 bg-[#AF763E]"></div>
            <span className="text-sm">Cảm ơn bạn đã sử dụng dịch vụ</span>
            <div className="w-8 h-1 bg-[#AF763E]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
