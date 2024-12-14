import mongoose, { Schema } from "mongoose";

const dynamicPricingSchema = new Schema({
  arenaDetails: {
    type: Schema.Types.ObjectId,
    ref: "Arena",
  },
  date: {
    type: String,
    default: "N/A",
    trim: true,
  },
  day: {
    type: String,
    default: "N/A",
    trim: true,
  },
  startTime: {
    type: String,
    required: true,
    trim: true,
  },
  endTime: {
    type: String,
    required: true,
    trim: true,
  },
  priceChange: {
    type: String,
    required: true,
    trim: true,
  },
});

export const DynamicPricing = mongoose.model("DynamicPricing", dynamicPricingSchema);
