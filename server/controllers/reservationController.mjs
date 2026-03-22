import { getListReservation, createReservation, createFulfillReservation, cancelReservation } from '../models/reservationModel.mjs';
//---予約
//一覧
export const fetchListReservation = async (req, res) => {
    try {
        const reservations = await getListReservation();
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//予約
export const fetchCreateReservation = async (req, res) => {
    try {
        const { bookId } = req.body;
        const loginUserId = res.req.session.userId;
        if(bookId == null || isNaN(Number(bookId))) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }
        const newReservation = await createReservation(loginUserId, bookId);
        res.status(201).json(newReservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//予約貸出
export const fetchFulfillReservation = async (req, res) => {
    try {
        const { bookId } = req.body;
        const loginUserId = res.req.session.userId;
        if(bookId == null || isNaN(Number(bookId))) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }
        const newReservation = await createFulfillReservation(loginUserId, bookId);
        res.status(201).json(newReservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//キャンセル
export const fetchCancelReservation = async (req, res) => {
    try {
        const { bookId } = req.params;
        const loginUserId = res.req.session.userId;
        if (bookId == null || !Number.isInteger(Number(bookId)) || Number(bookId) <= 0) {
            return res.status(400).json({ message: 'Invalid reservation ID' });
        }
        const result = await cancelReservation(loginUserId, bookId);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
