import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DietaryInfo() {
  return (
    <section className="py-[60px] sm:px-16 lg:px-24 bg-white">
      <div className="container mx-auto max-w-4xl mb-[60px]">
        <h2 className="text-2xl font-bold text-[#333333] mb-6 text-center">
          Thông tin dinh dưỡng
        </h2>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#333333] mb-2">
                Tùy chỉnh
              </h3>
              <p className="text-sm text-[#666666]">
                Chúng tôi có thể điều chỉnh món ăn theo yêu cầu của bạn. Vui
                lòng thông báo cho nhân viên.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#333333] mb-2">
                Dị ứng
              </h3>
              <p className="text-sm text-[#666666]">
                Nếu bạn có bất kỳ dị ứng thực phẩm nào, vui lòng thông báo cho
                nhân viên trước khi đặt món.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#333333] mb-2">
                Tươi ngon
              </h3>
              <p className="text-sm text-[#666666]">
                Chúng tôi chỉ sử dụng nguyên liệu tươi ngon nhất, được nhập mỗi
                ngày để đảm bảo chất lượng.
              </p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative bg-[#AF763E] text-white rounded-3xl px-8 py-20 overflow-hidden flex flex-col items-center text-center max-w-6xl mx-auto shadow-lg"
      >
        {/* Ảnh nền mờ phía sau */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://wallpapers.com/images/hd/sushi-commercial-food-photography-3isgkq4abstubuju.jpg"
            alt="Background texture"
            fill
            className="object-cover"
          />
        </div>

        {/* Nội dung chính */}
        <div className="z-10 max-w-xl">
          <h3 className="text-3xl font-bold mb-6 leading-snug">
            SẴN SÀNG ĐẶT MÓN
          </h3>
          <p className="text-base mb-8 max-w-110 mx-auto">
            Đặt món trực tuyến hoặc đặt bàn để thưởng thức ẩm thực Nhật Bản
            tuyệt vời tại nhà hàng của chúng tôi.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button className="bg-[#6B5E3C] text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
              Đặt món ngay
            </button>

            <Link
              href="/dat-ban"
              className="border bg-white border-[#6B5E3C] text-[#6B5E3C] px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 shadow hover:shadow-md"
            >
              Đặt bàn tại đây
            </Link>
          </motion.div>
        </div>

        {/* Hình tròn bên trái */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full border-10 border-[#FFECEC] overflow-hidden z-10">
          <Image
            src="https://media.istockphoto.com/id/1136673990/photo/master-chef-holding-chopsticks-with-flying-sushi.jpg?s=612x612&w=0&k=20&c=VGmoTu2CypSxEt3yXygVc8KzgPpnPrwMBnUdZH9URDY="
            alt="Decorative left circle"
            fill
            className="object-cover"
          />
        </div>

        {/* Hình tròn bên phải */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border-10 border-[#FFECEC] overflow-hidden z-10">
          <Image
            src="https://t3.ftcdn.net/jpg/11/72/23/02/360_F_1172230276_1WJgJBjplTpSwYTt1Tpf6xTqmWCLk7ut.jpg"
            alt="Decorative right circle"
            fill
            className="object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
