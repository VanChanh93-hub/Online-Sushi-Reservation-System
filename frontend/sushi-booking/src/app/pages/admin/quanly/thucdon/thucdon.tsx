"use client";
import React from "react";
import TitleDesc from "../../../../components/ui/titleDesc";
import CategoryComponent from "@/src/app/pages/admin/quanly/thucdon/section/Category";
import GroupFoodComponent from "@/src/app/pages/admin/quanly/thucdon/section/GroupFood";
import FoodComponent from "@/src/app/pages/admin/quanly/thucdon/section/Food";
import ComboComponent from "@/src/app/pages/admin/quanly/thucdon/section/Combo";
import StatisticalComponent from "@/src/app/pages/admin/quanly/thucdon/section/Statistical";

export default function QuanLyThucDon() {
  const categoryRef = React.useRef<HTMLDivElement>(null);
  const groupRef = React.useRef<HTMLDivElement>(null);
  const foodRef = React.useRef<HTMLDivElement>(null);
  const comboRef = React.useRef<HTMLDivElement>(null);


  return (
    <div className="grid grid-cols-12 gap-6">
      
      <TitleDesc
        title="Quản lý thực đơn"
        description="Danh sách danh mục và món ăn"
        className="col-span-12"
      />
      {/* Section thống kê */}
      <StatisticalComponent
        categoryRef={categoryRef}
        groupRef={groupRef}
        foodRef={foodRef}
        comboRef={comboRef}
      />
      {/* Bảng danh mục */}
      <CategoryComponent categoryRef={categoryRef}/>
      {/* Bảng loại danh mục */}
      <GroupFoodComponent groupRef={groupRef}/>
      {/* Bảng món ăn */}
      <FoodComponent foodRef={foodRef}/>
      {/* Bảng combo */}
      <ComboComponent comboRef={comboRef}/>
    </div>
  );
}
