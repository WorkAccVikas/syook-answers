const express = require("express");
const router = express.Router();
const orderController = require("../../controller/Order/Order");
const verifyExistingCustomer = require("../../middleware/verifyExistingCustomer");
const assignVehicleToOrder = require("../../middleware/assignVehicle");

/** POST : http://localhost:8000/api/v1/order
 * @body : for new customer
 * {
    "customer_name": "Karan",
    "customer_city": "goa",
    "itemId": "64ecf0a34669b7c272ac325a"
  }
 * @body : for existing customer
 * {
    "customerId" : "64ecf0a34669b7c272ac325a",
    "customer_name": "Ram",
    "customer_city": "mumbai",
    "itemId": "64ecf0a34669b7c272ac325a"
  }
 */
router
  .route("/")
  .post(verifyExistingCustomer, assignVehicleToOrder, orderController.create);

/** PUT : http://localhost:8000/api/v1/order/updateOrderStatus/0006 */
router
  .route("/updateOrderStatus/:orderNumber")
  .put(orderController.updateOrder);

/** GET : http://localhost:8000/api/v1/order/singleOrderDetails/0006 */
router
  .route("/singleOrderDetails/:orderNumber")
  .get(orderController.getSingleOrderDetails);
  
/** GET : http://localhost:8000/api/v1/order */
router.route("/").get(orderController.getAllOrderDetails);

module.exports = router;
