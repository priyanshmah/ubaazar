import mongoose from "mongoose";
import Product from "../Product.models";

const sareeSchema = new mongoose.Schema({
   variants: [{
      quantity: {
         type: Number,
         default: 0,
         required: true
      },
      color: {
         type: String,
         required: true
      },
      images: [{
         type: String,
         required: true
      }]
   }]
})

const Sarees = Product?.discriminators?.Sarees ||
   Product.discriminator('Sarees', sareeSchema);

export default Sarees;