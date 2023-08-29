const mongoose = require("mongoose");
const itemsModel = require("./Items");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    price: Number,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    itemId: {
      type: "ObjectId",
      ref: "Items",
    },
    customerId: {
      type: "ObjectId",
      ref: "Customers",
    },
    deliveryVehicleId: {
      type: "ObjectId",
      ref: "DeliveryVehicles",
    },
  },
  { timestamps: true, toJSON: { virtual: true } }
);

// Pre hook to generate an incremental orderNumber
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // console.log("pre hook = ", this);
      const lastOrder = await this.constructor.findOne(
        {},
        { orderNumber: 1 },
        { sort: { orderNumber: -1 } }
      );
      if (lastOrder) {
        const lastOrderNumber = parseInt(lastOrder.orderNumber);
        this.orderNumber = (lastOrderNumber + 1).toString().padStart(4, "0");
      } else {
        this.orderNumber = "0001";
      }
      const itemPrice = await itemsModel.findOne(
        { _id: this.itemId },
        { _id: 0, price: 1 }
      );

      this.price = itemPrice.price;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const Order = mongoose.model("Order", orderSchema, "Order");

module.exports = Order;
