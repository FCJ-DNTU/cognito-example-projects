import { Router } from "express";

// Import ports từ modules
import { getCustomerPipeline } from "../../../core/modules/pcustomer-management/ports";
import { createContext } from "../adapters/context";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Potential Customers
 *     description: Quản lý khách hàng tiềm năng
 */

/**
 * @swagger
 * /pcustomers/{id}:
 *   get:
 *     tags:
 *       - Potential Customers
 *     summary: Lấy một khách hàng tiềm năng
 *     description: Trả về thông tin của khách hàng tiềm năng theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khách hàng tiềm năng
 *     responses:
 *       200:
 *         description: Lấy thành công khách hàng tiềm năng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 */
router.get("/pcustomers/:id", async (req, res, next) => {
  const ctx = createContext(req, res, next);
  return getCustomerPipeline.run(ctx);
});

export default router;
