const express = require("express");
const router = express.Router();
const deliveryVehiclesController = require("../../controller/DeliveryVehicles/DeliveryVehicles");

/** POST : http://localhost:8000/api/v1/deliveryVehicles
 * @header : authorization : JWT TOKEN (from /signin) (mandatory)
 * @body : {
    "registrationNumber": "MH-01-AB-1000",
    "vehicleType": "truck",
    "city": "MUMBAI"
    }
  */
router.post("/", deliveryVehiclesController.create);

/** GET : http://localhost:8000/api/v1/deliveryVehicles/64ed11c0e953aca4f20e5c62
 * @header : authorization : JWT TOKEN (from /signin) (mandatory)
 */
router.get("/:deliveryId", deliveryVehiclesController.getSingleDetails);

/** PUT : http://localhost:8000/api/v1/deliveryVehicles/64ed11c0e953aca4f20e5c62
 * @header : authorization : JWT TOKEN (from /signin) (mandatory)
 * @body : {
 *    registrationNumber: '',
 *    vehicleType: '',
 *    city: ''
 *  }
 */
router.put("/:deliveryId", deliveryVehiclesController.updateSingleDetails);

/** GET : http://localhost:8000/api/v1/deliveryVehicles
 * @header : authorization : JWT TOKEN (from /signin) (mandatory)
 */
router.get("/", deliveryVehiclesController.getAllDeliveryVehicles);

module.exports = router;
