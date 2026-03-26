import { getAllBooks, getDetailBook, searchBook, createBook, updateBook, deleteBook, checkBookStatus, checkUserRole } from '../models/bookModel.mjs';
const BOOK_STATUS = ['available', 'borrowed', 'reserved'];

//---書籍
//表示
export const fetchListBook = async (req, res) => {
    try {
        const books = await getAllBooks();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
//検索
export const fetchSearchBook = async (req, res) => {
    try {
        const { title, author } = req.query;
        if (title == null && author == null) {
            const books = await getAllBooks();
            return res.status(201).json(books);
        }
        const book = await searchBook(title, author);
        return res.status(201).json(book);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
//詳細
export const fetchDetailBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await getDetailBook(bookId);
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//追加
export const fetchCreateBook = async (req, res) => {
    try {
        const { title, author } = req.body;
        //バリデーション　タイトル、著者
        if (typeof title !== 'string' || typeof author !== 'string') {
            return res.status(400).json({ message: 'Title and Author must be strings' });
        }
        if (!title.trim() || !author.trim()){
            return res.status(400).json({ message: 'Title and Author are required' });
        }
        if (title.length > 255 || author.length > 255) {
            return res.status(400).json({ message: 'Title and Author must be less than 255 characters' });
        }
        const newBook = await createBook(title, author);
        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//更新
export const fetchUpdateBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { title, author, status } = req.body;
        //バリデーション　タイトル、著者、ステータス
        if (bookId == null || !Number.isInteger(Number(bookId)) || Number(bookId) <= 0) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }
        if(typeof title == null && typeof author == null && typeof status == null) {
            return res.status(400).json({ message: 'At least one field (title, author, status) must be provided for update' });
        }
        if(typeof title !== 'string' || !title.trim() || title.length > 255){
            return res.status(400).json({ message: 'Title must be a non-empty string less than 255 characters' });
        }
        if(typeof author !== 'string' || !author.trim() || author.length > 255){
            return res.status(400).json({ message: 'Author must be a non-empty string less than 255 characters' });
        }
        if (!BOOK_STATUS.includes(status)) {
            return res.status(400).json({message: 'Invalid status'});
        }
        const result = await updateBook(bookId, title, author, status);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//削除
export const fetchDeleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        //バリデーション　タイトル、著者、ステータス
        if(bookId == null || isNaN(Number(bookId))) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }
        const status = await checkBookStatus(bookId);
        if (!status) {
            return res.status(404).json({ message: 'Book not found' });
        }
        //条件
        if(status !== 'available') {
            return res.status(400).json({ message: 'Book is not available for deletion' });
        }
        const result = await deleteBook(bookId);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
