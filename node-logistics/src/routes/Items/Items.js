const express = require("express");
const router = express.Router();
const itemsController = require("../../controller/Items/Items");

/** POST :  http://localhost:8000/api/v1/items
 * @header : authorization : JWT TOKEN (from /signin) (mandatory)
 * @body : {
    "name": "Sofa",
    "price": 7599
    }
*/
router.post("/", itemsController.createItem);

/** GET : http://localhost:8000/api/v1/items/64ecf0a34669b7c272ac325a
 * @header : authorization : JWT TOKEN (from /signin) (mandatory)
 */
router.get("/:itemId", itemsController.getSingleItemDetails);

/** PUT : http://localhost:8000/api/v1/items/64ecf0a34669b7c272ac325a
 * @header : authorization : JWT TOKEN (from /signin) (mandatory)
 * @body : {
    "price": 999,
    "name": "Power Bank"
    }
 */
router.put("/:itemId", itemsController.updateSingleItemDetails);

/** GET : http://localhost:8000/api/v1/items
 * @header : authorization : JWT TOKEN (from /signin) (mandatory)
 */
router.get("/", itemsController.getAllItems);

module.exports = router;
