const mongoose = require("mongoose");
require("dotenv").config();

const MenuItem = require("./models/MenuItem");

const menuItems = [
  {
    name: "2 Piece Chicken Meal",
    price: 8.99,
    image: "/images/2-piece-chicken-meal.png",
    alt: "2 Piece Chicken Meal",
    description: "Crispy fried chicken with fries and a drink of your choice.",
  },
  {
    name: "Chicken Sandwich Combo",
    price: 9.49,
    image: "/images/chicken-sandwich-combo.png",
    alt: "Chicken Sandwich Combo",
    description: "Chicken sandwich served with fries and a drink of your choice.",
  },
  {
    name: "5 Wings Basket",
    price: 7.99,
    image: "/images/5-wings-basket.png",
    alt: "5 Wings Basket",
    description: "Five seasoned wings served with fries.",
  },
  {
    name: "Family Bucket",
    price: 19.99,
    image: "/images/family-bucket.png",
    alt: "Family Bucket",
    description: "8 pieces of chicken with large fries and dipping sauce.",
  },
  {
    name: "Loaded Fries",
    price: 6.49,
    image: "/images/loaded-fries.png",
    alt: "Loaded Fries",
    description: "Golden fries topped with sauce and crispy chicken bites.",
  },
  {
    name: "Chicken Tenders Meal",
    price: 8.49,
    image: "/images/chicken-tenders-meal.png",
    alt: "Chicken Tenders Meal",
    description: "Three tenders with fries, toast, and a drink of your choice.",
  },
];

async function seedMenu() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItems);

    console.log("Menu items seeded successfully!");
    process.exit();
  } catch (error) {
    console.log("Seed error:", error);
    process.exit(1);
  }
}

seedMenu();
