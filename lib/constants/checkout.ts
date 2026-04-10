import { BASE_PRICE } from "./shared";

export const generateCheckout = () => ({
  id: "ORD-7721",
  title: "Поезд 044X, Алматы — Астана",
  date: "12 апреля, 20:40",
  seats: "Вагон 04, Место 21, 22",
  price: BASE_PRICE,
  currency: "₸",
});
