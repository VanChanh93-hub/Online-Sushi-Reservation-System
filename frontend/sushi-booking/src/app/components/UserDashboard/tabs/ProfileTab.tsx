"use client";
import { useState, useRef } from "react";
import {
  User,
  Camera,
  Edit,
  Check,
  X,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import InfoCard from "../ui/InfoCard";
import Image from "next/image";

interface ProfileTabProps {
  user: any;
}

export default function ProfileTab({ user }: ProfileTabProps) {
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const avatar = event.target?.result as string;
        setTempUser((prev: any) => ({ ...prev, avatar }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setTempUser(user);
    setEditMode(true);
  };

  const handleSave = () => {
    // API call để lưu thay đổi có thể đặt tại đây
    setEditMode(false);
  };

  const handleCancel = () => setEditMode(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUser((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Avatar và thông tin cơ bản */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative cursor-pointer"
            onClick={handleAvatarClick}
          >
            <div className="relative">
              <Image
                src={tempUser.avatar || "/img/default-avatar.png"}
                alt="Avatar"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#AF763E] text-white p-2 rounded-full">
                <Camera className="w-5 h-5" />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: editMode ? 1 : 0 }}
              className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center"
            >
              <Camera className="text-white w-8 h-8" />
            </motion.div>
          </motion.div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="text-center md:text-left">
          {editMode ? (
            <div className="flex flex-col items-center md:items-start space-y-4">
              <input
                type="text"
                name="name"
                value={tempUser.name}
                onChange={handleInputChange}
                className="text-2xl font-bold text-gray-900 bg-wooden-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-200"
              />
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-2 text-[#AF763E]" />
                <span>{tempUser.email}</span>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 font-japanese">
                {user.name}
              </h2>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mt-2">
                <Mail className="w-5 h-5 mr-2 text-[#AF763E]" />
                <span>{user.email}</span>
              </div>
            </>
          )}

          <div className="mt-6 flex gap-3 justify-center md:justify-start">
            {editMode ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  Lưu thay đổi
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-wooden-light text-gray-700 rounded-lg text-sm font-medium hover:bg-wooden focus:outline-none focus:ring-2 focus:ring-gray-500 border border-gray-300"
                >
                  <X className="w-4 h-4" />
                  Hủy bỏ
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-wooden-light border border-red-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-wooden focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
              >
                <Edit className="w-4 h-4 text-[#AF763E]" />
                <span className="text-[#AF763E]">Chỉnh sửa hồ sơ</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Thông tin bổ sung */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          icon={<User className="text-[#AF763E]" />}
          title="Thông tin cơ bản"
          titleClassName="text-red-700"
          editMode={editMode}
          items={[
            {
              label: "Họ tên",
              value: tempUser.name,
              name: "name",
              editable: true,
            },
          ]}
          onInputChange={handleInputChange}
          cardClassName="bg-wooden-light border-red-200"
        />
        <InfoCard
          icon={<MapPin className="text-[#AF763E]" />}
          title="Liên hệ"
          titleClassName="text-red-700"
          editMode={editMode}
          items={[
            {
              label: "Email",
              value: tempUser.email,
              name: "email",
              editable: true,
              icon: <Mail className="w-4 h-4 text-red-500 mr-2" />,
            },
            {
              label: "Số điện thoại",
              value: tempUser.phone,
              name: "phone",
              editable: true,
              icon: <Phone className="w-4 h-4 text-red-500 mr-2" />,
            },
          ]}
          onInputChange={handleInputChange}
          cardClassName="bg-wooden-light border-red-200"
        />
      </div>
    </div>
  );
}
