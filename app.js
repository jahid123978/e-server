const express = require("express");
const bcrypt = require('bcryptjs');
const fileUpload = require("express-fileupload");
const productsRouter = require("./src/routes/products");
const productImagesRouter = require("./src/routes/productImages");
const categoryRouter = require("./src/routes/category");
const searchRouter = require("./src/routes/search");
const mainImageRouter = require("./src/routes/mainImages");
const userRouter = require("./src/routes/users");
const orderRouter = require("./src/routes/customer_orders");
const slugRouter = require("./src/routes/slugs");
const orderProductRouter = require('./src/routes/customer_order_product');
const wishlistRouter = require('./src/routes/wishlist');
var cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(fileUpload());

app.use("/api/products", productsRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/images", productImagesRouter);
app.use("/api/main-image", mainImageRouter);
app.use("/api/users", userRouter);
app.use("/api/search", searchRouter);
app.use("/api/orders", orderRouter);
app.use('/api/order-product', orderProductRouter);
app.use("/api/slugs", slugRouter);
app.use("/api/wishlist", wishlistRouter);


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
