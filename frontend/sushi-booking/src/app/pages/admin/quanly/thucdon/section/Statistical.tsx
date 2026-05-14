import { Card, CardContent } from "../../../../../components/ui/Card";
import React from "react";
import {useFetch} from "../../../../../hooks/useFetch";

export default function StatisticalComponent({
  categoryRef,
  groupRef,
  foodRef,
  comboRef,
}: {
  categoryRef: React.RefObject<HTMLDivElement | null>;
  groupRef: React.RefObject<HTMLDivElement | null>;
  foodRef: React.RefObject<HTMLDivElement | null>;
  comboRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { categories, foodGroups, foods, combos } = useFetch();

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="col-span-12 grid grid-cols-12 gap-4">
      {[
        { label: "Tổng danh mục", value: categories.length, ref: categoryRef },
        { label: "Tổng loại danh mục", value: foodGroups.length, ref: groupRef },
        { label: "Tổng món ăn", value: foods.length, ref: foodRef },
        { label: "Tổng combo", value: combos.length, ref: comboRef },
      ].map((item, index) => (
        <Card
          className="col-span-3 cursor-pointer"
          key={index}
          onClick={() => scrollToSection(item.ref)}
        >
          <CardContent>
            <p className="text-base text-muted-foreground">{item.label}</p>
            <p className="text-xl font-bold mt-2">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
