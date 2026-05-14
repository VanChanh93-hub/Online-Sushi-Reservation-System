// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // ✅ Những đường dẫn cần phân quyền admin
//   const adminPaths = ["/quan-tri"];

//   // ✅ Lấy token và thông tin người dùng từ cookie
//   const token = request.cookies.get("access_token")?.value;
//   const userInfo = request.cookies.get("user_info")?.value;

//   // ✅ Nếu không có token → redirect tới /dang-nhap
//   if (!token) {
//     return NextResponse.redirect(new URL("/dang-nhap", request.url));
//   }

//   // ✅ Parse user từ cookie
//   let user = null;
//   try {
//     if (userInfo) {
//       const decoded = decodeURIComponent(userInfo); // ✅ Decode trước
//         user = JSON.parse(decoded); // ✅ Sau đó parse
//     }
//   } catch (error) {
//     console.error("Lỗi parse user_info:", error);
//     return NextResponse.redirect(new URL("/dang-nhap", request.url));
//   }

//   // ✅ Nếu vào route admin mà không phải admin → redirect về trang chủ
//   if (adminPaths.some((path) => pathname.startsWith(path))) {
//     if (!user || user.role !== "admin") {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   // ✅ Nếu hợp lệ → cho phép truy cập
//   return NextResponse.next();
// }

// // ✅ Định nghĩa matcher: áp dụng middleware cho các route cần bảo vệ
// export const config = {
//   matcher: [
//     "/quan-tri/:path*",
//     // Có thể mở rộng matcher nếu cần
//     // "/nguoi-dung/:path*",
//     // "/don-hang/:path*",
//   ],
// };

import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/src/app/lib/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Bỏ qua các route không cần xử lý
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") // bỏ qua file tĩnh như .ico, .jpg, .js,...
  ) {
    return NextResponse.next();
  }

  // ✅ Nếu vào "/" thì redirect về /vi hoặc locale mặc định
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}`)
  );

  if (pathname === "/" || pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }

  // ✅ Lấy lang từ URL, ví dụ: /vi/quan-tri → lang = "vi"
  const langFromPath = pathname.split("/")[1] || defaultLocale;

  // ✅ Những đường dẫn cần phân quyền admin, ví dụ: /vi/quan-tri
  const isAdminRoute = pathname.startsWith(`/${langFromPath}/quan-tri`);

  // ✅ Lấy token và user info từ cookie
  const token = request.cookies.get("access_token")?.value;
  const userInfo = request.cookies.get("user_info")?.value;

  // ✅ Nếu đang truy cập trang admin
  if (isAdminRoute) {
    // ❌ Nếu chưa đăng nhập → redirect về trang đăng nhập
    if (!token) {
      return NextResponse.redirect(
        new URL(`/${langFromPath}/dang-nhap`, request.url)
      );
    }

    // ✅ Nếu có user_info → parse ra
    let user = null;
    try {
      if (userInfo) {
        const decoded = decodeURIComponent(userInfo);
        user = JSON.parse(decoded);
      }
    } catch (error) {
      console.error("Lỗi parse user_info:", error);
      return NextResponse.redirect(
        new URL(`/${langFromPath}/dang-nhap`, request.url)
      );
    }

    // ❌ Nếu không phải admin → redirect về trang chủ
    if (!user || user.role !== "admin") {
      return NextResponse.redirect(new URL(`/${langFromPath}`, request.url));
    }
  }

  // ✅ Nếu hợp lệ thì tiếp tục
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Match tất cả các route ngoại trừ:
      - Static files (.ico, .png, .jpg, ...)
      - _next (Next.js assets)
      - API routes
    */
    "/((?!_next|.*\\..*|api).*)",
  ],
};
