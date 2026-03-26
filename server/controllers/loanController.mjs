import { getListLoan, createLoan, returnLoan, extendLoan } from '../models/loanModel.mjs';

//---貸出
//一覧
export const fetchListLoan = async (req, res) => {
    try {
        const loans = await getListLoan();
        res.status(200).json(loans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//貸出
export const fetchCreateLoan = async (req, res) => {
    try {
        const { bookId, loginUserId } = req.body;
        if(bookId == null || !Number.isInteger(Number(bookId)) || Number(bookId) <= 0) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }
        const newLoan = await createLoan( bookId, loginUserId );
        res.status(201).json(newLoan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//返却
export const fetchReturnLoan = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { loginUserId } = req.body;
        if (bookId == null || !Number.isInteger(Number(bookId)) || Number(bookId) <= 0) {
            return res.status(400).json({ message: 'Invalid loan ID' });
        }
        const result = await returnLoan( bookId, loginUserId );
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//延長
export const fetchExtendLoan = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { loginUserId } = req.body;
        if (bookId == null || !Number.isInteger(Number(bookId)) || Number(bookId) <= 0) {
            return res.status(400).json({ message: 'Invalid loan ID' });
        }
        const result = await extendLoan( bookId, loginUserId );
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};