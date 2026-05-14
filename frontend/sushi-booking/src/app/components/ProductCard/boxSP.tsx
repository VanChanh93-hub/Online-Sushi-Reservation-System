import Image from "next/image";

interface BoxSPProps {
  name: string;
  jpName: string;
  desc: string;
  price: string;
  image?: string;
  titleColor?: string;
  jpColor?: string;
}

export default function BoxSP({
  name,
  jpName,
  desc,
  price,
  image = "/placeholder.svg",
  titleColor = "#333333",
  jpColor = "#333333",
}: BoxSPProps) {
  return (
    <div className="flex bg-white rounded-lg overflow-hidden shadow-sm">
      <Image src={image} alt={name} className="w-1/3 object-cover h-40" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-1">
            <h4 className="text-l font-medium" style={{ color: titleColor }}>
              {name}
            </h4>
            <span className="text-l ml-1" style={{ color: jpColor }}>
              ( {jpName} )
            </span>
          </div>
          <p className="text-sm text-[#666666] mb-2 italic">{desc}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#ff0000]">{price}</span>
          <button className="text-sm bg-[#8E9482] hover:bg-[#815B5B] text-white px-4 py-2 rounded-md transition-colors">
            Đặt món
          </button>
        </div>
      </div>
    </div>
  );
}
