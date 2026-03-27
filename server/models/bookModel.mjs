import { db } from '../db/bookDb.mjs';

//---書籍
//一覧
export const getAllBooks = async () => {
    try{
        const [rows] = await db.query('SELECT * FROM books');
        return rows;
    } catch (err) {
        throw err;
    }
};
//検索
export const searchBook = async (title, author) => {
    try{
        let sql = 'SELECT * FROM books WHERE 1=1';
        const params = [];
        if (title) {
            sql += ' AND title LIKE ?';
            params.push(`%${title}%`);
        }
        if (author) {
            sql += ' AND author LIKE ?';
            params.push(`%${author}%`);
        }
        const [rows] = await db.query(sql, params);
        return rows;
    } catch (err) {
        throw err;
    }
    
};
//詳細
export const getDetailBook = async (bookId) => {
    try{
        const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [bookId]);
        return rows[0];
    } catch (err) {
        throw err;
    }
};
//追加
export const createBook = async (title, author) => {
    try{
        const [result] = await db.query(
            'INSERT INTO books (title, author, status, created_at) VALUES (?, ?, ?, NOW())',
            [title, author, 'available']
        );
        return { id: result.insertId, title, author, status: 'available' };
    } catch (err) {
        throw err;
    }
    
};
//更新
export const updateBook = async (bookId, title, author, status) => {
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();
        // 貸出確認
        const [loans] = await conn.query(
            'SELECT id FROM loans WHERE book_id = ? AND returned_at IS NULL',
            [bookId]
        );
        if (loans.length > 0) {
            throw new Error('already loaned');
        }
        // 予約確認
        const [reservations] = await conn.query(
            'SELECT id FROM reservations WHERE book_id = ? AND status = "active"',
            [bookId]
        );
        if (reservations.length > 0) {
            throw new Error('already reserved');
        }
        await conn.query(
            'UPDATE books SET title = ?, author = ?, status = ? WHERE id = ?',
            [title, author, status, bookId]
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
//削除
export const deleteBook = async (bookId) => {
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();
        // 貸出確認
        const [loans] = await conn.query(
            'SELECT id FROM loans WHERE book_id = ? AND returned_at IS NULL',
            [bookId]
        );
        if (loans.length > 0) {
            throw new Error('already loaned');
        }
        // 予約確認
        const [reservations] = await conn.query(
            'SELECT id FROM reservations WHERE book_id = ? AND status = "active"',
            [bookId]
        );
        if (reservations.length > 0) {
            throw new Error('already reserved');
        }
        await conn.query(
            'DELETE FROM books WHERE id = ?',
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
}
//ステータス確認
export const checkBookStatus = async (bookId) => {
    try {
        const [rows] = await db.query(
            'SELECT status FROM books WHERE id = ?',
            [bookId]
        );
        if (rows.length === 0) {
            throw new Error('Book not found');
        }
        return rows[0].status;
    } catch (err) {
        throw err;
    }
};
//権限確認
export const checkUserRole = async (userId) => {
    try {
        const [rows] = await db.query(
            'SELECT role FROM users WHERE id = ?',
            [userId]
        );
        if (rows.length === 0) {
            throw new Error('User not found');
        }
        return rows[0].role;
    } catch (err) {
        throw err;
    }
};