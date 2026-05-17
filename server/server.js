const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const MenuItem = require("./models/MenuItem");
const Order = require("./models/Order");
const Cart = require("./models/Cart");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(function () {
    console.log("Connected to MongoDB");
  })
  .catch(function (error) {
    console.log("MongoDB connection error:", error);
  });

app.get("/", function (req, res) {
  res.send("Backend is running!");
});

app.get("/api/menu", async function (req, res) {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error loading menu items" });
  }
});

app.post("/api/menu", async function (req, res) {
  try {
    const newMenuItem = new MenuItem({
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      alt: req.body.alt,
      description: req.body.description,
    });

    const savedMenuItem = await newMenuItem.save();

    res.status(201).json(savedMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding menu item" });
  }
});

app.put("/api/menu/:id", async function (req, res) {
  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        alt: req.body.alt,
        description: req.body.description,
      },
      {
        new: true,
      }
    );

    res.json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating menu item" });
  }
});

app.delete("/api/menu/:id", async function (req, res) {
  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);

    res.json(deletedMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu item" });
  }
});

app.post("/api/orders", async function (req, res) {
  try {
    const newOrder = new Order({
      items: req.body.items,
      total: req.body.total,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error saving order" });
  }
});

app.get("/api/orders", async function (req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error loading orders" });
  }
});

app.put("/api/orders/:id", async function (req, res) {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
});

app.delete("/api/orders/:id", async function (req, res) {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    res.json(deletedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
});

app.get("/api/cart", async function (req, res) {
  try {
    let cart = await Cart.findOne({ cartId: "main-cart" });

    if (!cart) {
      cart = await Cart.create({
        cartId: "main-cart",
        items: [],
        total: 0,
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error loading cart" });
  }
});

app.put("/api/cart", async function (req, res) {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { cartId: "main-cart" },
      {
        cartId: "main-cart",
        items: req.body.items,
        total: req.body.total,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart" });
  }
});

app.delete("/api/cart", async function (req, res) {
  try {
    const clearedCart = await Cart.findOneAndUpdate(
      { cartId: "main-cart" },
      {
        cartId: "main-cart",
        items: [],
        total: 0,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json(clearedCart);
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});
