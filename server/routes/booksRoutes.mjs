import express from 'express';
const router = express.Router();
import { fetchDetailBook, fetchSearchBook, fetchCreateBook, fetchUpdateBook, fetchDeleteBook } from '../controllers/bookController.mjs';
// import { createBookValidator } from "../validators/bookValidator.mjs";
// import { validate } from "../middleware/validate.mjs";
import { authMiddleware } from "../middleware/authMiddleware.mjs";
import { roleMiddleware } from "../middleware/roleMiddleware.mjs";

//---書籍
//検索
router.get('/search', async (req, res) => {
    fetchSearchBook(req, res);
});
//詳細
router.get('/:bookId', async (req, res) => {
    fetchDetailBook(req, res);
});
//追加
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["librarian", "admin"]),
  fetchCreateBook
);
//更新
router.put(
  "/:bookId",
  authMiddleware,
  roleMiddleware(["librarian", "admin"]),
  fetchUpdateBook
);
//削除
router.delete(
  "/:bookId",
  authMiddleware,
  roleMiddleware(["librarian", "admin"]),
  fetchDeleteBook
);

export default router;