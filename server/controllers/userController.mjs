import { getListUser, getUserReservations, getUserLoans, getDetailUser, searchUser, createUser, updateUser, deleteUser, checkUserStatus, checkUserRole } from '../models/userModel.mjs';
import bcrypt from "bcrypt";
const USER_ROLES = ['user', 'librarian', 'admin'];

//---ユーザー
//マイページ：予約一覧
export const fetchUserReservations = async (req, res) => {
    try {
        const { userId } = req.params;
        if (userId == null || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const reservations = await getUserReservations(userId);
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//マイページ：貸出一覧
export const fetchUserLoans = async (req, res) => {
    try {
        const { userId } = req.params;
        if (userId == null || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const loans = await getUserLoans(userId);
        res.status(200).json(loans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//検索
export const fetchSearchUser = async (req, res) => {
    try {
        const { name, email, role } = req.query;
        if (name == null && email == null && role == null) {
            const users = await getListUser();
            return res.status(201).json(users);
        } 
        const user = await searchUser(name, email, role);
        return res.status(201).json(user);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
//詳細
export const fetchDetailUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await getDetailUser(userId);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//追加
export const fetchCreateUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        //バリデーション　名前、email、パスワード、役割
        if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Name, Email, Password, and Role must be strings' });
        }
        if (!name.trim() || !email.trim() || !password.trim()) {
            return res.status(400).json({ message: 'Name, Email, Password Hash, and Role are required' });
        }
        if (name.length > 100 || email.length > 255 || password.length > 255) {
            return res.status(400).json({ message: 'Name, Email, Password Hash, and Role must be less than 255 characters' });
        }
        if (!USER_ROLES.includes(role)) {
            return res.status(400).json({message: 'Invalid role'});
        }
        const password_hash = await bcrypt.hash(password,10);
        const newUser = await createUser(name, email, password_hash, role);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//更新
export const fetchUpdateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, oldpassword, password, role } = req.body;
        //バリデーション　タイトル、著者、ステータス
        if (userId == null || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        if(typeof name == null && typeof email == null && typeof password == null && typeof role == null) {
            return res.status(400).json({ message: 'At least one field (name, email, password, role) must be provided for update' });
        }
        if(typeof name !== 'string' || !name.trim() || name.length > 255){
            return res.status(400).json({ message: 'Name must be a non-empty string less than 255 characters' });
        }
        if(typeof email !== 'string' || !email.trim() || email.length > 255){
            return res.status(400).json({ message: 'Email must be a non-empty string less than 255 characters' });
        }
        if(typeof oldpassword !== 'string' || !oldpassword.trim() || oldpassword.length > 255){
            return res.status(400).json({ message: 'Password Hash must be a non-empty string less than 255 characters' });
        }
        if(typeof password !== 'string' || !password.trim() || password.length > 255){
            return res.status(400).json({ message: 'Password Hash must be a non-empty string less than 255 characters' });
        }
        if (!USER_ROLES.includes(role)) {
            return res.status(400).json({message: 'Invalid role'});
        }
        const result = await updateUser(userId, name, email, oldpassword, password, role);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//削除
export const fetchDeleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        //バリデーション　id
        if(userId == null || isNaN(Number(userId))) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        //状態確認
        const status = await checkUserStatus(userId);
        if (!status) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(status.reservedBookIds.length !== 0  || status.reservedBookIds.length !== 0) {
            return res.status(400).json({ message: 'User is not available for deletion' });
        }
        const result = await deleteUser(userId);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
