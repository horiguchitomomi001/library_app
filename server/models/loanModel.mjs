import { db } from '../db/bookDb.mjs';

//---貸出
//一覧
export const getListLoan = async (userId) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM loans WHERE user_id = ?',
            [userId]
        );
        return rows;
    } catch (err) {
        throw err;
    }
}; 
//貸出
export const createLoan = async (loginUserId, bookId) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        // 二重貸出防止
        const [rows] = await conn.query(
            'SELECT id FROM loans WHERE book_id = ? AND returned_at IS NULL',
            [bookId]
        );
        if (rows.length > 0) {
            throw new Error('already loaned');
        }

        //loans追加
        await conn.query(
            'INSERT INTO loans (user_id, book_id, loaned_at, due_date, returned_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), NULL)',
            [loginUserId, bookId]
        );
        //book.status=“borrowed”
        await conn.query(
            'UPDATE books SET status = "borrowed" WHERE id = ?',
            [bookId]
        );

        await conn.commit();
        return { success: true };

    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};
//返却
export const returnLoan = async (loginUserId, loanId) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        //  貸出者確認
        const [rows] = await conn.query(
            'SELECT id FROM loans WHERE book_id = ? AND user_id = ? AND returned_at IS NULL',
            [loanId, loginUserId]
        );
        if (rows.length === 0) {
            throw new Error('not your reservation');
        }
        // loans.returned_at
        await conn.query(
            'UPDATE loans SET returned_at = NOW() WHERE book_id = ?',
            [loanId]
        );
        // books.status=‘available’
        await conn.query(
            'UPDATE books SET status = "available" WHERE id = ?',
            [loanId]
        );

        await conn.commit();
        return { success: true };

    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};
//延長
export const extendLoan = async (loginUserId, loanId) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        //  貸出者確認
        const [rows] = await conn.query(
            'SELECT id FROM loans WHERE book_id = ? AND user_id = ? AND returned_at IS NULL',
            [loanId, loginUserId]
        );
        if (rows.length === 0) {
            throw new Error('not your reservation');
        }
        await conn.query(
            'UPDATE loans SET due_date = DATE_ADD(due_date, INTERVAL 14 DAY)  WHERE book_id = ? AND returned_at IS NULL',
            [loanId]
        );
        await conn.commit();
        return { success: true };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};