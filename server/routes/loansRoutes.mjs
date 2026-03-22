import express from 'express';
const router = express.Router();
import { fetchListLoan, fetchCreateLoan, fetchReturnLoan, fetchExtendLoan } from '../controllers/loanController.mjs';

//---貸出
//一覧
router.get('/:bookId', async (req, res) => {
    fetchListLoan(req, res);
});
//貸出
router.post('/', async (req, res) => {
    fetchCreateLoan(req, res);
});
//返却
router.put('/:bookId/return', async (req, res) => {
    fetchReturnLoan(req, res);
});     
//延長
router.put('/:bookId/extend', async (req, res) => {
    fetchExtendLoan(req, res);
});

export default router;