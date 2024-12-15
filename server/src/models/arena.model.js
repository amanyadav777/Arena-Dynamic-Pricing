import mongoose, { Schema } from "mongoose";

const pricingSchema = new Schema({
  duration: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
    trim: true,
  },
});

const arenaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    originalPricing: {
      type: [pricingSchema],
      default: [],
    },
    imageUrl: {
      type: String, // cloudinary url
      default:
        "https://d26itsb5vlqdeq.cloudfront.net//image/84F6C802-D425-AC69-FF763C55B14E2430",
    },
  },
  {
    timestamps: true,
  }
);

export const Arena = mongoose.model("Arena", arenaSchema);
