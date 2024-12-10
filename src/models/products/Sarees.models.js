import mongoose from "mongoose";
import Product from "../Product.models";

const sareeSchema = new mongoose.Schema({
   pattern : {
    type: String,
    required: true
   },
   sareeFabric : {
    type: String,
    required: true
   },
   sareeLength : {
    type: String,
    required: true
   },
   border : {
    type: String,
    required: true
   },
   blouseType : {
    type: String,
    required: true
   },
   blouseFabric : {
    type: String,
    required: true
   },
   blouseLength : {
    type: String,
    required: true
   },
   ornamentation : {
    type: String,
    required: true
   },
   occasion : {
    type: String,
    required: true,
    enum: ['Traditional', 'Daily Wear', 'Party Wear']
   },
   washCare: {
    type: String,
    required: true,
    enum: ['Hand Wash', 'Dry Clean']
   },
   colour: {
      type: String,
      required: true,
   },
   inventory: {
      type: Number,
      required: [true, "Product inventory is required"]
  },
   variants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sarees"
   }]
})

sareeSchema.index({ "$**": "text" }); 

const Sarees = mongoose.models.Product?.discriminators?.Sarees || 
                Product.discriminator('Sarees', sareeSchema);

export default Sarees;