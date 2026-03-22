import { db } from '../db/bookDb.mjs';
import bcrypt from "bcrypt";

//---ユーザー
//一覧
export const getListUser = async () => {
    try{
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    } catch (err) {
        throw err;
    }
};
//マイページ：予約一覧
export const getUserReservations = async (userId) => {
    try {
        const [rows] = await db.query(
            'SELECT reservations.id, reservations.book_id, books.title, books.author, ' +
            'reservations.reserved_at ' +
            'FROM reservations ' +
            'JOIN books ON reservations.book_id = books.id ' +
            'WHERE reservations.user_id = ? ' +
            'AND reservations.status = "active"',
            [userId]
        );
        return rows;
    } catch (err) {
        throw err;
    }
};
//マイページ：貸出一覧
export const getUserLoans = async (userId) => {
    try {
        const [rows] = await db.query(
            'SELECT loans.id, loans.book_id, books.title, books.author, ' +
            'loans.loaned_at, loans.due_date ' +
            'FROM loans ' +
            'JOIN books ON loans.book_id = books.id ' +
            'WHERE loans.user_id = ? ' +
            'AND loans.returned_at IS NULL',
            [userId]
        );
        return rows;
    } catch (err) {
        throw err;
    }
};
//検索
export const searchUser = async (name, email, role) => {
    try{
        let sql = 'SELECT * FROM users WHERE 1=1';
        const params = [];
        if (name) {
            sql += ' AND name LIKE ?';
            params.push(`%${name}%`);
        }
        if (email) {
            sql += ' AND email LIKE ?';
            params.push(`%${email}%`);
        }
        if (role) {
            sql += ' AND role LIKE ?';
            params.push(`%${role}%`);
        }
        const [rows] = await db.query(sql, params);
        return rows;
    } catch (err) {
        throw err;
    }
    
};
//詳細
export const getDetailUser = async (id) => {
    try{
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    } catch (err) {
        throw err;
    }
};
//追加
export const createUser = async (name, email, passwordHash, role) => {
    try{
        // const passwordHash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())',
            [name, email, passwordHash, role]
        );
        return { id: result.insertId, name, email, role };
    } catch (err) {
        throw err;
    }
    
};
//更新
export const updateUser = async (userId, name, email, oldpassword, password, role) => {
    try{
        //  旧パスワード確認
        const [rows] = await db.query(
            'SELECT password_hash FROM users WHERE id = ?',
            [userId]
        );
        if (rows.length === 0) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(
            oldpassword,
            rows[0].password_hash
        );
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        const password_hash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'UPDATE users SET name = ?, email =?, password_hash = ?, role = ? WHERE id = ?',
            [name, email, password_hash, role, userId]
        );
        return result;
    } catch (err) {
        throw err;
    }
};
//削除
export const deleteUser = async (userId) => {
    try{
        const [result] = await db.query(
            'DELETE FROM users WHERE id = ?',
            [userId]
        );
        return result;
    } catch (err) {
        throw err;
    }
}
//ステータス確認
export const checkUserStatus = async (userId) => {
    try {
        // 予約中の本
        const [reservations] = await db.query(
            "SELECT book_id FROM reservations WHERE user_id = ? AND status = 'active'",
            [userId]
        );
        // 貸出中の本（未返却）
        const [loans] = await db.query(
            "SELECT book_id FROM loans WHERE user_id = ? AND returned_at IS NULL",
            [userId]
        );
        return {
            reservedBookIds: reservations.map(r => r.book_id),
            loanedBookIds: loans.map(l => l.book_id)
        };

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