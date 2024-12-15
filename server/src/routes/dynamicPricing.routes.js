import { Router } from "express";
import {
  createDynamicPricingArena,
  updateDynamicPricingArenaDetails,
  deleteDynamicPricingArena,
  getArenaDynamicPricingDetails,
  getArenaDynamicPricingList,
} from "../controllers/dynamicPricing.controller.js";

const router = Router();

router.route("/create-dynamic-pricing-arena").post(createDynamicPricingArena);

router
  .route("/update-dynamic-pricing-arena/:id")
  .patch(updateDynamicPricingArenaDetails);

router
  .route("/delete-dynamic-pricing-arena/:id")
  .delete(deleteDynamicPricingArena);

router
  .route("/get-arena-dynamic-pricing-details/:id")
  .get(getArenaDynamicPricingDetails);

router
  .route("/get-arena-dynamic-pricing-list/:arenaId")
  .get(getArenaDynamicPricingList);

export default router;
