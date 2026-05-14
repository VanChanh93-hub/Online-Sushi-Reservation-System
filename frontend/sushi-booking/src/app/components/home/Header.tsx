"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { FaCircleUser } from "react-icons/fa6";
import Image from "next/image";

interface User {
  ho_ten: string;
  email: string;
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  //   const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header
      className="text-black border-b border-gray-200 p-4 flex justify-end items-center relative"
      style={{ backgroundColor: "var(--secondary-color)" }}
    >
      <div className="flex items-center space-x-6 ml-6">
        {/* Icon thông báo */}
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6" />
          {/* Badge thông báo nếu cần */}
          {/* <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">3</span> */}
        </div>

        {/* Avatar hoặc Icon user */}
        {user ? (
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="flex items-center space-x-2">
              <Image
                src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                className="w-10 h-10 rounded-full"
                alt="Avatar"
              />
              <span className="hidden sm:block">{user.ho_ten}</span>
            </div>

            {showDropdown && (
              <div className="absolute right-0 w-48 bg-white shadow rounded-lg py-2 z-50">
                <div className="px-4 py-2 text-sm text-black hover:bg-gray-100">
                  Thông tin tài khoản
                </div>
                <button
                  // onClick={}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <FaCircleUser className="w-6 h-6" />
        )}
      </div>
    </header>
  );
};

export default Header;
