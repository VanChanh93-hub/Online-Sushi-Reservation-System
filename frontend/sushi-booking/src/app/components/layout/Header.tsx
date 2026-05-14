"use client";

import { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "../../context/authContext";
import { FiMenu, FiX, FiUser, FiLogOut, FiHome } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../lib/i18n/client";
import Image from "next/image";

const Header = () => {
  const { t, lang } = useTranslation("header");
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout;
  const isLoading = authContext?.isLoading;
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setLanguageMenuOpen(false);
      }
    }

    if (userMenuOpen || languageMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen, languageMenuOpen]);

  // 🌐 Tạo navLinks có prefix lang
  const navLinks = [
    {
      href: `/${lang}`,
      label: t("nav.home"),
      shortLabel: t("nav.home"),
      icon: <FiHome size={18} className="lg:hidden" />,
    },
    {
      href: `/${lang}/thuc-don`,
      label: t("nav.menu"),
      shortLabel: t("nav.menu"),
    },
    {
      href: `/${lang}/ve-chung-toi`,
      label: t("nav.about"),
      shortLabel: t("nav.about"),
    },
    {
      href: `/${lang}/lien-he`,
      label: t("nav.contact"),
      shortLabel: t("nav.contact"),
    },
    {
      href: `/${lang}/dat-ban`,
      label: t("nav.reservation"),
      shortLabel: t("nav.reservation"),
      highlight: true,
    },
  ];

  // 🌐 Switch language giữ nguyên path
  const switchLanguage = (newLang: string) => {
    const segments = pathname.split("/");
    segments[1] = newLang;
    const newPath = segments.join("/") || "/";
    router.push(newPath);
    setLanguageMenuOpen(false);
  };

  // 🌐 Hỗ trợ loading skeleton
  const UserActionsSkeleton = () => (
    <div className="hidden lg:flex items-center space-x-3">
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="w-9 h-9 rounded-full bg-gray-200"></div>
        <div className="w-16 h-4 bg-gray-200 rounded hidden xl:block"></div>
      </div>
    </div>
  );

  const MobileUserSkeleton = () => (
    <div className="pt-3 mt-3 border-t border-[#E8D5C4] mx-4">
      <div className="flex items-center px-4 py-3 space-x-3 animate-pulse">
        <div className="w-9 h-9 rounded-full bg-gray-200"></div>
        <div>
          <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
          <div className="w-32 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-[#F8F1E9] border-b border-[#AF763E]"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center flex-shrink-0"
          >
            <Link
              href={`/${lang}`}
              className="flex items-center space-x-2"
              aria-label={t("aria.home_link")}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                  scrolled ? "bg-[#AF763E]" : "bg-[#AF763E]"
                }`}
              >
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/2252/2252075.png"
                  alt="Sushi Logo"
                  width={24}
                  height={24}
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                />
              </div>
              <h1
                className={`text-lg sm:text-xl lg:text-2xl font-bold hidden sm:block whitespace-nowrap ${
                  scrolled ? "text-[#333333]" : "text-[#333333]"
                }`}
              >
                Sushi Takumi
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2 xl:px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm xl:text-base ${
                  pathname === link.href
                    ? scrolled
                      ? "text-[#333333] font-medium"
                      : "text-[#333333] font-medium"
                    : scrolled
                    ? "text-[#333333] hover:text-[#666666]"
                    : "text-[#333333] hover:text-[#666666]"
                }`}
              >
                <span className="hidden xl:inline">{link.label}</span>
                <span className="xl:hidden">
                  {link.shortLabel || link.label}
                </span>
                {pathname === link.href && (
                  <motion.div
                    layoutId="navUnderline"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      scrolled ? "bg-[#9E7676]" : "bg-[#815B5B]"
                    }`}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                  />
                )}
                {link.highlight && !pathname.includes(link.href) && (
                  <span className="absolute -top-1 -right-1 h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B04242] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B04242]"></span>
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Language Switcher & User Actions */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 flex-shrink-0">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className={`
                    flex items-center gap-2 px-3 py-1 rounded-full 
                    border border-[#E6DDD4] shadow-sm   
                    bg-gradient-to-tr from-[#FDF8F3] to-[#F5F0E9] 
                    hover:shadow-md hover:from-[#FAF4ED] hover:to-[#EFE8E1]
                    transition-all duration-300
                     `}
                aria-label={t("aria.language_switcher")}
              >
                <span className="text-lg">🌐</span>
                <div className="flex items-center gap-1">
                  <Image
                    src={
                      lang === "vi"
                        ? "https://cdn.nhandan.vn/images/1ef398c4e2fb4bf07980a2ded785b3efa34a32bf3c30de657ea321a3b2a92b2cd50a2bcbd400315f55c0227a8414ec3e667230b4143f06152d02cab40f71e050/quockyvietnam-copy-7814.jpg"
                        : "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg"
                    }
                    alt={lang === "vi" ? "Tiếng Việt" : "English"}
                    width={20}
                    height={14}
                    className="rounded-[2px] object-cover shadow-sm"
                  />
                  <span className="text-sm text-[#8B6F47] font-medium">
                    {lang === "vi" ? "VI" : "EN"}
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {languageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-36 bg-white border border-[#E6DDD4] rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        switchLanguage("vi");
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#F5F3F0] ${
                        lang === "vi"
                          ? "bg-[#F8F1E9]/60 font-semibold text-[#AF763E]"
                          : ""
                      }`}
                    >
                      <Image
                        src="https://cdn.nhandan.vn/images/1ef398c4e2fb4bf07980a2ded785b3efa34a32bf3c30de657ea321a3b2a92b2cd50a2bcbd400315f55c0227a8414ec3e667230b4143f06152d02cab40f71e050/quockyvietnam-copy-7814.jpg"
                        alt="Tiếng Việt"
                        width={20}
                        height={14}
                        className="object-cover"
                      />
                      <span>Tiếng Việt</span>
                    </button>
                    <button
                      onClick={() => {
                        switchLanguage("en");
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#F5F3F0] ${
                        lang === "en"
                          ? "bg-[#F8F1E9]/60 font-semibold text-[#AF763E]"
                          : ""
                      }`}
                    >
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg"
                        alt="English"
                        width={20}
                        height={14}
                        className="object-cover"
                      />
                      <span>English</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Actions */}
            {!isClient || isLoading ? (
              <UserActionsSkeleton />
            ) : (
              <div
                className="flex items-center space-x-2 xl:space-x-3 relative min-w-0"
                ref={userMenuRef}
              >
                {user ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={`flex items-center space-x-1 xl:space-x-2 group focus:outline-none transition-colors max-w-[200px] 2xl:max-w-[250px] ${
                        userMenuOpen
                          ? "text-[#333333]"
                          : scrolled
                          ? "text-[#333333] hover:text-[#666666]"
                          : "text-[#333333] hover:text-[#666666]"
                      }`}
                      aria-haspopup="true"
                      aria-expanded={userMenuOpen}
                      aria-label={t("aria.user_menu")}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-8 h-8 xl:w-9 xl:h-9 rounded-full flex items-center justify-center text-white font-medium shadow-sm transition-all ${
                          scrolled
                            ? "bg-gradient-to-br from-[#E8D5C4] to-[#9E7676]"
                            : "bg-gradient-to-br from-[#9E7676] to-[#815B5B]"
                        } ${
                          userMenuOpen
                            ? "ring-2 ring-[#815B5B] ring-offset-2"
                            : ""
                        }`}
                      >
                        <FiUser size={14} className="xl:hidden" />
                        <FiUser size={16} className="hidden xl:block" />
                      </motion.div>
                      <span
                        className="text-xs xl:text-sm 2xl:text-base font-medium hidden xl:block min-w-0 flex-1 truncate"
                        title={user.name}
                      >
                        {user.name}
                      </span>
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-[#F0E6D2] overflow-hidden z-50"
                        >
                          <div className="p-2 border-b border-[#F0E6D2] bg-[#FFF9F0]">
                            <p className="text-sm font-medium text-[#594545] px-2 py-1 truncate">
                              {user.email}
                            </p>
                          </div>

                          <Link
                            href={`/${lang}/thong-tin-ca-nhan`}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center px-4 py-3 text-sm text-[#594545] hover:bg-[#F8F1E6] transition-colors"
                          >
                            <FiUser className="mr-3 text-[#815B5B]" size={16} />
                            {t("user.profile")}
                          </Link>
                          <div className="border-t border-[#F0E6D2]">
                            <button
                              onClick={() => {
                                logout?.();
                                setUserMenuOpen(false);
                              }}
                              className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-[#F8F1E6] transition-colors"
                            >
                              <FiLogOut className="mr-3" size={16} />
                              {t("user.logout")}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="flex items-center space-x-2 xl:space-x-3">
                    <Link
                      href={`/${lang}/dang-nhap`}
                      className={`transition-colors text-xs xl:text-sm font-medium px-2 xl:px-3 py-1.5 whitespace-nowrap ${
                        scrolled
                          ? "text-[#333333] hover:text-[#666666]"
                          : "text-[#333333] hover:text-[#666666]"
                      }`}
                    >
                      {t("user.login")}
                    </Link>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={`/${lang}/dang-ky`}
                        className={`px-3 xl:px-4 py-2 rounded-lg transition-all shadow hover:shadow-md text-xs xl:text-sm font-medium block whitespace-nowrap ${
                          scrolled
                            ? "bg-gradient-to-r from-[#AF763E] to-[#6B5E3C] text-white"
                            : "bg-gradient-to-r from-[#AF763E] to-[#6B5E3C] text-white"
                        }`}
                      >
                        {t("user.register")}
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2 flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t("aria.menu_button")}
          >
            {mobileMenuOpen ? (
              <FiX size={22} className="text-[#333333]" />
            ) : (
              <FiMenu
                size={22}
                className={scrolled ? "text-[#333333]" : "text-[#666666]"}
              />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 pb-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-3 rounded-lg mx-2 transition-colors ${
                        pathname === link.href
                          ? "bg-[#F8F1E9] text-[#333333] font-medium"
                          : "text-[#333333] hover:bg-[#F8F1E9]"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon && <span className="mr-3">{link.icon}</span>}
                      {link.label}
                      {link.highlight && !pathname.includes(link.href) && (
                        <span className="ml-2 h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B04242] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B04242]"></span>
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile User Section */}
                {!isClient || isLoading ? (
                  <MobileUserSkeleton />
                ) : (
                  <div className="pt-3 mt-3 border-t border-[#E8D5C4] mx-4">
                    {user ? (
                      <>
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: navLinks.length * 0.05 + 0.1,
                          }}
                          className="flex items-center px-4 py-3 space-x-3"
                        >
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8D5C4] to-[#9E7676] flex items-center justify-center text-white font-medium shadow-sm flex-shrink-0">
                            <FiUser size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[#594545] font-medium truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-[#815B5B] truncate">
                              {user.email}
                            </p>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: navLinks.length * 0.05 + 0.15,
                          }}
                        >
                          <Link
                            href={`/${lang}/thong-tin-ca-nhan`}
                            className="flex items-center px-4 py-2 text-[#815B5B] hover:bg-[#F8F1E6] rounded-md"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <FiUser className="mr-3 flex-shrink-0" size={16} />
                            <span className="truncate">
                              {t("user.profile")}
                            </span>
                          </Link>
                        </motion.div>

                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: navLinks.length * 0.05 + 0.3,
                          }}
                          className="border-t border-[#E8D5C4] mt-2"
                        >
                          <button
                            onClick={() => {
                              logout?.();
                              setMobileMenuOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-[#F8F1E6] rounded-md"
                          >
                            <FiLogOut
                              className="mr-3 flex-shrink-0"
                              size={16}
                            />
                            <span className="truncate">{t("user.logout")}</span>
                          </button>
                        </motion.div>

                        {/* Mobile Language Switcher */}
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: navLinks.length * 0.05 + 0.35,
                          }}
                          className="pt-2 mt-2 border-t border-[#E8D5C4]"
                        >
                          <div className="px-4 py-2 text-xs text-[#815B5B] font-medium">
                            {t("language.switch_to")}
                          </div>
                          <div className="flex space-x-2 px-4">
                            <button
                              onClick={() => switchLanguage("vi")}
                              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                lang === "vi"
                                  ? "bg-[#F8F1E6] text-[#333333] font-medium"
                                  : "text-[#594545] hover:bg-[#F8F1E6]"
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#AF763E] to-[#6B5E3C] flex items-center justify-center text-white text-xs font-bold">
                                VI
                              </span>
                              <span>Tiếng Việt</span>
                            </button>
                            <button
                              onClick={() => switchLanguage("en")}
                              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                lang === "en"
                                  ? "bg-[#F8F1E6] text-[#333333] font-medium"
                                  : "text-[#594545] hover:bg-[#F8F1E6]"
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#AF763E] to-[#6B5E3C] flex items-center justify-center text-white text-xs font-bold">
                                EN
                              </span>
                              <span>English</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: navLinks.length * 0.05 + 0.1,
                          }}
                        >
                          <Link
                            href={`/${lang}/dang-nhap`}
                            className="flex items-center px-4 py-2 text-[#333333] hover:bg-[#F8F1E6] rounded-md"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t("user.login")}
                          </Link>
                        </motion.div>

                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: navLinks.length * 0.05 + 0.15,
                          }}
                        >
                          <Link
                            href={`/${lang}/dang-ky`}
                            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#AF763E] to-[#6B5E3C] text-white rounded-md"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t("user.register")}
                          </Link>
                        </motion.div>

                        {/* Mobile Language Switcher */}
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: navLinks.length * 0.05 + 0.2,
                          }}
                          className="pt-2 mt-2 border-t border-[#E8D5C4]"
                        >
                          <div className="px-4 py-2 text-xs text-[#815B5B] font-medium">
                            {t("language.switch_to")}
                          </div>
                          <div className="flex space-x-2 px-4">
                            <button
                              onClick={() => switchLanguage("vi")}
                              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                lang === "vi"
                                  ? "bg-[#F8F1E6] text-[#333333] font-medium"
                                  : "text-[#594545] hover:bg-[#F8F1E6]"
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#AF763E] to-[#6B5E3C] flex items-center justify-center text-white text-xs font-bold">
                                VI
                              </span>
                              <span>Tiếng Việt</span>
                            </button>
                            <button
                              onClick={() => switchLanguage("en")}
                              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                lang === "en"
                                  ? "bg-[#F8F1E6] text-[#333333] font-medium"
                                  : "text-[#594545] hover:bg-[#F8F1E6]"
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#AF763E] to-[#6B5E3C] flex items-center justify-center text-white text-xs font-bold">
                                EN
                              </span>
                              <span>English</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
