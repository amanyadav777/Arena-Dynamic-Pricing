import { Router } from "express";
import {
  createArena,
  updateArenaDetails,
  deleteArena,
  updateArenaImage,
  getAllArenas,
  currentArenaDetails,
} from "../controllers/arena.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-arena").post(
  upload.fields([
    {
      name: "arenaImage",
      maxCount: 1,
    },
  ]),
  createArena
);

router.route("/update-arena/:id").patch(updateArenaDetails);

router
  .route("/arena-image/:id")
  .patch(upload.single("arenaImage"), updateArenaImage);

router.route("/delete-arena/:id").delete(deleteArena);

router.route("/list-of-arenas").get(getAllArenas);

router.route("/current-arena-details/:id").get(currentArenaDetails);

export default router;
