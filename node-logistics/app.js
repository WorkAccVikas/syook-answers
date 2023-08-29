require("dotenv").config();
const PORT = process.env.PORT || 5000;

const express = require("express");
const app = express();
const cors = require("cors");
const mongoConnection = require("./src/utils/connection/connection");
const verifyUser = require("./src/middleware/verifyUser");
const verifyExistingCustomer = require("./src/middleware/verifyExistingCustomer");
const assignVehicleCustomer = require("./src/middleware/assignVehicle");

const healthCheckRoutes = require("./src/routes/HealthCheck/HealthCheck");
const userRoutes = require("./src/routes/User/User");
const itemsRoutes = require("./src/routes/Items/Items");
const deliveryVehiclesRoutes = require("./src/routes/DeliveryVehicles/DeliveryVehicles");
const orderRoutes = require("./src/routes/Order/Order");

// Established MongoDB connection
mongoConnection();

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));

// Add Routes
app.use("/api/v1/healthCheck", healthCheckRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/items", verifyUser, itemsRoutes);
app.use("/api/v1/deliveryVehicles", verifyUser, deliveryVehiclesRoutes);
app.use(
  "/api/v1/order",
  orderRoutes
);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
