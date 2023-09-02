const mongoose = require('mongoose');

// Create a schema for the item
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantityAndMrp: [
    {
      quantity: { type: String, required: true },
      mrp: { type: Number, required: true },
    },
  ],
  numOfPieces: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  isTopSelling: { type: Boolean, required: true },
  isBoneless: { type: Boolean, default: false },
  discount: { type: Number, required: true },
}, {
  strictPopulate: false // Set strictPopulate to false
});

// Create the Item model
const Item = mongoose.model('Item', itemSchema);

// Export the model
module.exports = Item;
