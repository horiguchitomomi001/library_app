import express from 'express';
const router = express.Router();
import { fetchUserReservations, fetchUserLoans, fetchDetailUser, fetchListUser, fetchSearchUser, fetchCreateUser, fetchUpdateUser, fetchDeleteUser } from '../controllers/userController.mjs';
import { authMiddleware } from "../middleware/authMiddleware.mjs";
import { roleMiddleware } from "../middleware/roleMiddleware.mjs";

//---ユーザー
// マイページ：予約一覧
router.get('/:userId/reservations', async (req, res) => {
    fetchUserReservations(req, res);
});
// マイページ：貸出一覧
router.get('/:userId/loans', async (req, res) => {
    fetchUserLoans(req, res);
});
//表示
router.get('/', async (req, res) => {
    fetchListUser(req, res);
});
//検索
router.get('/search', async (req, res) => {
    fetchSearchUser(req, res);
});
//詳細
router.get('/:userId', async (req, res) => {
    fetchDetailUser(req, res);
});
//追加
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  fetchCreateUser
);
//更新
router.put(
  "/:userId",
  authMiddleware,
  roleMiddleware(["admin"]),
  fetchUpdateUser
);
//削除
router.delete(
  "/:userId",
  authMiddleware,
  roleMiddleware(["admin"]),
  fetchDeleteUser
);

export default router;