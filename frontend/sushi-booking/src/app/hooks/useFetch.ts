"use client";
import  { useEffect, useState } from "react";
import axios from "axios";
import { Category, Group, Food, Combo, Voucher, Table, Order, OrderDetail } from "../types";


export function useFetch() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodGroups, setFoodGroups] = useState<Group[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

  // Pagination state
  // const [showAddCategory, setShowAddCategory] = useState(false);
  // const [newCategoryName, setNewCategoryName] = useState("");
  // const [newCategoryDescription, setNewCategoryDescription] = useState("");


  // Gọi API lấy danh mục
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/category")
      .then((res) => {
        console.log("Danh sách danh mục:", res.data);
        setCategories(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  // Gọi API lấy loại danh mục
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/foodgroups")
      .then((res) => {
        console.log("Danh sách loại danh mục:", res.data);
        setFoodGroups(res.data)
      })
      .catch((err) => console.error("Lỗi khi lấy loại danh mục:", err));
  }, []);

  // Gọi API lấy món ăn
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/foods")
      .then((res) => {
        console.log("Danh sách món ăn:", res.data.data);
        setFoods(res.data.data)
      })
      .catch((err) => console.error("Lỗi khi lấy món ăn:", err));
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/combos")
      .then(res => {
        console.log("Danh sách combo:", res.data);
        setCombos(res.data);
      })
      .catch(err => console.error("Lỗi khi lấy combo:", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/voucher")
      .then((res) => setVouchers(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh sách voucher:", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/tables")
      .then((res) => setTables(res.data))
      .catch((err) => console.error("Lỗi khi lấy bàn:", err));
  }, []);

  // Gọi API lấy danh sách đơn hàng
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/orders")
      .then((res) => {
        console.log("Danh sách đơn hàng:", res.data);
        setOrders(res.data);
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách đơn hàng:", err));
  }, []);

  // Lấy chi tiết đơn hàng
  const fetchOrderDetail = (id: number) => {
    axios.get(`http://127.0.0.1:8000/api/orders/${id}`)
      .then(res => {
        console.log("Chi tiết đơn hàng:", res.data);
        setOrderDetail(res.data);
      })
      .catch(err => console.error("Lỗi khi lấy chi tiết đơn hàng:", err));
  };
  return {
    categories,
    foodGroups,
    foods,
    combos,
    vouchers,
    tables,
    orders,
    orderDetail,
    fetchOrderDetail,
  };
}
