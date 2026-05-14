"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { useTranslation } from "../../lib/i18n/client";
import { usePathname } from "next/navigation";

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#", color: "hover:bg-[#3b5998]" },
  {
    name: "Instagram",
    icon: Instagram,
    href: "#",
    color: "hover:bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
  },
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:bg-[#1da1f2]" },
];

const Footer = () => {
  const { t, lang } = useTranslation("footer");
  const pathname = usePathname();

  // 🌐 Tạo các đường dẫn có prefix lang
  const getLocalizedPath = (path: string) => {
    return `/${lang}${path}`;
  };

  return (
    <footer className="relative bg-[#464132] text-white border-t border-[#e6d5b8]/20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/images/japanese-wave.png')] bg-repeat opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-[#AF763E] rounded-full flex items-center justify-center mr-3 shadow-lg">
              <span className="text-2xl">🍣</span>
            </div>
            <h2 className="text-3xl font-bold text-[#e6d5b8] font-japanese tracking-wider">
              {t("logo_text")}
            </h2>
          </div>
          <p className="text-[#e6d5b8]/80 max-w-md font-light text-base">
            {t("tagline")}
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-sm">
          {/* Địa chỉ */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-[#e6d5b8] border-b border-[#e6d5b8]/30 pb-2">
              <MapPin className="mr-2 text-[#AF763E]" size={18} />
              {t("address.title")}
            </h3>
            <address className="not-italic text-[#e6d5b8]/80 space-y-2">
              <p className="flex items-start">
                <span className="text-[#AF763E] mr-2">〒</span>
                <span>
                  {t("address.street")}
                  <br />
                  {t("address.city")}
                </span>
              </p>
              <div className="pt-2">
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 text-[#AF763E]" size={14} />
                  <span>{t("opening_hours.title")}:</span>
                </div>
                <div className="pl-6 text-sm mt-1">
                  <p>{t("opening_hours.lunch")}</p>
                  <p>{t("opening_hours.dinner")}</p>
                </div>
              </div>
            </address>
          </div>

          {/* Dịch vụ */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#e6d5b8] border-b border-[#e6d5b8]/30 pb-2">
              {t("menu_services.title")}
            </h3>
            <ul className="space-y-3 text-[#e6d5b8]/80">
              {[
                [t("menu_services.omakase"), "/menu"],
                [t("menu_services.premium_set"), "/menu"],
                [t("menu_services.counter_reservation"), "/reservation"],
                [t("menu_services.special_events"), "/events"],
              ].map(([label, href], i) => (
                <li key={i}>
                  <Link
                    href={getLocalizedPath(href)}
                    className="hover:text-[#AF763E] transition-colors flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#AF763E] rounded-full mr-3 group-hover:scale-150 transition-transform" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#e6d5b8] border-b border-[#e6d5b8]/30 pb-2">
              {t("contact.title")}
            </h3>
            <div className="space-y-4 text-[#e6d5b8]/80">
              <div className="flex items-start group">
                <Phone className="mr-2 text-[#AF763E]" size={16} />
                <p className="font-medium group-hover:text-[#AF763E]">
                  {t("contact.phone")}
                </p>
              </div>
              <div className="flex items-start group">
                <Mail className="mr-2 text-[#AF763E]" size={16} />
                <p className="font-medium group-hover:text-[#AF763E]">
                  {t("contact.email")}
                </p>
              </div>
              <div className="pt-4">
                <h4 className="text-sm font-semibold text-[#e6d5b8] mb-3">
                  {t("social.title")}
                </h4>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      className={`w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#e6d5b8] transition-all ${social.color} hover:text-white`}
                      aria-label={social.name}
                    >
                      <social.icon size={16} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Đăng ký nhận tin */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#e6d5b8] border-b border-[#e6d5b8]/30 pb-2">
              {t("newsletter.title")}
            </h3>
            <p className="text-[#e6d5b8]/80 mb-4 font-light">
              {t("newsletter.description")}
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#e6d5b8]/20 rounded-sm focus:outline-none focus:border-[#AF763E] text-white placeholder-[#e6d5b8]/50"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#AF763E] text-white font-medium py-2 px-4 rounded-sm transition-all hover:scale-[1.02] flex items-center justify-center"
              >
                <span className="mr-2">{t("newsletter.button")}</span>
                <span>→</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#e6d5b8]/10 pt-6 text-sm text-[#e6d5b8]/50 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
          <div className="flex space-x-6">
            <Link
              href={getLocalizedPath("/privacy")}
              className="hover:text-[#AF763E] transition-colors"
            >
              {t("links.privacy")}
            </Link>
            <Link
              href={getLocalizedPath("/terms")}
              className="hover:text-[#AF763E] transition-colors"
            >
              {t("links.terms")}
            </Link>
            <Link
              href={getLocalizedPath("/sitemap")}
              className="hover:text-[#AF763E] transition-colors"
            >
              {t("links.sitemap")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
