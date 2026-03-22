import { db } from '../db/bookDb.mjs';

//---予約
//一覧
export const getListReservation = async (userId) => {
    const [rows] = await db.query(
        'SELECT * FROM reservations WHERE user_id = ?',
        [userId]
    );
    return rows;
};
//予約
export const createReservation = async (loginUserId, bookId) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        //貸出確認　貸出中
        const [loans] = await conn.query(
            'SELECT id FROM loans WHERE book_id = ? AND returned_at IS NULL',
            [bookId]
        );
        if (loans.length <= 0) {
            throw new Error('already available');
        }
        //予約確認　未予約
        const [reservations] = await conn.query(
            'SELECT id FROM reservations WHERE book_id = ? AND status = "active"',
            [bookId]
        );
        if (reservations.length > 0) {
            throw new Error('already reserved');
        }
        
        // reservations に INSERT
        await conn.query(
            'INSERT INTO reservations (user_id, book_id, reserved_at, status) VALUES (?, ?, NOW(), "active")',
            [loginUserId, bookId]
        );

        // books を UPDATE
        await conn.query(
            'UPDATE books SET status = "reserved" WHERE id = ?',
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
//予約貸出
export const createFulfillReservation = async (loginUserId, bookId) => {
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
        //reservations.status=“fulfilled”
        await conn.query(
            'UPDATE reservations SET status = "fulfilled" WHERE book_id = ?',
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
//キャンセル
export const cancelReservation = async (loginUserId, bookId) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        //  予約者確認
        const [rows] = await conn.query(
            'SELECT id FROM reservations WHERE book_id = ? AND user_id = ? AND status = "active"',
            [bookId, loginUserId]
        );
        if (rows.length === 0) {
            throw new Error('not your reservation');
        }
        //  book.status=“available”
        await conn.query(
            'UPDATE books SET status = "available" WHERE id = ?',
            [bookId]
        );
        // reservations.status=“canceled”
        await conn.query(
            'UPDATE reservations SET status = "cancelled" WHERE book_id = ?',
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