import { Router } from "express";
import {
  addProduct,
  getAll,
  getById,
  updateById,
  deleteProduct,
  getAllProductsByCategory,
  fetchShopsByPincode,
  getByShopId,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/verifyUser.js";

const router = Router();

router.route("/add").post(verifyJWT, addProduct);
router.route("/").get(verifyJWT, getAll);
router.route("/c/:category").get(getAllProductsByCategory);
router.route("/pin/:pincode").get(verifyJWT, fetchShopsByPincode);
router.route("/shop/:id").get(verifyJWT, getByShopId);
router
  .route("/:id")
  .get(getById)
  .put(verifyJWT, updateById)
  .delete(verifyJWT, deleteProduct);

export default router;
