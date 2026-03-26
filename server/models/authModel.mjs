import { db } from '../db/bookDb.mjs';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//認証
export const authenticateUser = async (email, password) => {
    try {
        // ユーザー取得
        const [rows] = await db.query(
            "SELECT id, email, password_hash, role FROM users WHERE email = ?",[email]
        );
        if (rows.length === 0) {
            throw new Error('invalid email or password');
        }
        const user = rows[0];
        // パスワード確認
        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );
        if (!isMatch) {
            throw new Error('invalid email or password');
        }
        // JWT作成
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        return { token:token, user: user };
    } catch (err) {
        throw new Error('server error');
    }
};