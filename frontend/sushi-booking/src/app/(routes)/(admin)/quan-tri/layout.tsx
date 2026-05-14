import Header from "../../../components/home/Header";
import Sidebar from "../../../components/home/Sidebar";
import "../../../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="text-[1em]">
        <div className="flex min-h-screen">
          {/* Sidebar bên trái */}
          <aside className="w-64">
            <Sidebar />
          </aside>

          {/* Phần còn lại gồm Header + Main */}
          <div className="flex-1 flex flex-col">
            <header>
              <Header />
            </header>
            <main className="min-h-[300px] bg-gray-50 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
