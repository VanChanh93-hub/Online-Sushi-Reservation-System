// src/app/hooks/useAdd.ts
import axios from 'axios';
import {
  CategoryAdd,
  FoodGroupAdd,
  FoodAdd,
  ComboAdd,
  VoucherAdd,
  TableAdd
//   ComboInput,
} from '../types';

/**
 * Thêm danh mục (Category)
 */
export const addCategory = async (data: CategoryAdd) => {
  const response = await axios.post('http://127.0.0.1:8000/api/insert-category', data);
  return response.data;
};

/**
 * Thêm loại danh mục (FoodGroup)
 */
export const addFoodGroup = async (data: FoodGroupAdd) => {
  const response = await axios.post('http://127.0.0.1:8000/api/foodgroup/insert-foodgroup', data);
  return response.data;
};

/**
 * Thêm món ăn (Food)
 */
export const addFood = async (data: FoodAdd) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('category_id', String(data.category_id));
  if (data.group_id) formData.append('group_id', String(data.group_id));
  if (data.jpName) formData.append('jpName', data.jpName);
  if (data.description) formData.append('description', data.description);
  formData.append('price', String(data.price));
  if (data.image) formData.append('image', data.image);

  const response = await axios.post('http://127.0.0.1:8000/api/food/insert-food', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Thêm combo
 */
export const addCombo = async (data: ComboAdd) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('price', String(data.price));
  formData.append('status', data.status ? '1' : '0');
  if (data.description) formData.append('description', data.description);
  if (data.image) formData.append('image', data.image);

  data.items.forEach((item, index) => {
    formData.append(`items[${index}][food_id]`, String(item.food_id));
    formData.append(`items[${index}][quantity]`, String(item.quantity));
  });

  const response = await axios.post('http://127.0.0.1:8000/api/combo/insert-combos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};


/**
 * Thêm bàn
 */
export const addTable = async (data: TableAdd) => {
  const response = await axios.post("http://127.0.0.1:8000/api/tables", data);
  return response.data;
};

/**
 * Thêm voucher
 */
export const addVoucher = async (data: VoucherAdd) => {
  const response = await axios.post('http://127.0.0.1:8000/api/voucher', data);
  return response.data;
};