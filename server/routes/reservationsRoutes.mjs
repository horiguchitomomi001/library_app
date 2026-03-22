import express from 'express';
const router = express.Router();
import { fetchListReservation, fetchCreateReservation, fetchFulfillReservation, fetchCancelReservation } from '../controllers/reservationController.mjs';

//---予約
//一覧
router.get('/:bookId/reservations', async (req, res) => {
    fetchListReservation(req, res);
});
//予約
router.post('/', async (req, res) => {
    fetchCreateReservation(req, res);
});
//予約貸出
router.post('/:bookId/loan', async (req, res) => {
    fetchFulfillReservation(req, res);
});
//キャンセル
router.put('/:bookId/cancel', async (req, res) => {
    fetchCancelReservation(req, res);
});     

export default router;