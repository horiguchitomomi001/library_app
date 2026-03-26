import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function BookDetail() {
    //共通
    const API_URL = import.meta.env.VITE_API_URL;
    const [ book, setBook ] = useState({});
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const loginUserId = JSON.parse(localStorage.getItem("user")).id;
    //更新用ステート
    const [ putTitle, setTitle ] = useState({});
    const [ putAuthor, setAuthor ] = useState({});
    const [ putStatus, setStatus ] = useState({});

    //詳細
    const fetchBook = async () => {
        const res = await fetch(`${API_URL}/books/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const json = await res.json();
        setBook(json);
    }
    //貸出
    const loansBook = async () => {
        const res = await fetch(`${API_URL}/loans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bookId: book.id,
                loginUserId: loginUserId
            }),
        });
        const json = await res.json();
        setBook(json);
    }
    //予約
    const reserveBook = async () => {
        const res = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bookId: book.id,
                loginUserId: loginUserId
            }),
        });
        const json = await res.json();
        setBook(json);
    }
    // 更新
    const putData = async (bookId) => {
        const res = await fetch(`${API_URL}/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title: putTitle,
                author: putAuthor,
                status: putStatus
            })
        });
        const json = await res.json();
        setBook(json);
    }
    // 削除
    const deleteData = async (bookId) => {
        const res = await fetch(`${API_URL}/books/${bookId}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
            }
        });
        const json = await res.json();
        setBook(json);
    }

    useEffect(() => {
        fetchBook();
    }, []);

    useEffect(() => {
        if (!book?.id) return;
        setTitle(book.title ?? '');
        setAuthor(book.author ?? '');
        setStatus(book.status ?? '');
    }, [book.id]);

    return(
        <>
            <p>タイトル：{book.title}</p>
            <p>著者：{book.author}</p>
            <p>貸出状況：{book.status}</p>
            <button onClick={() => loansBook()}>貸出</button>
            <button onClick={() => reserveBook()}>予約</button>

            <input type="text" value={putTitle} placeholder="タイトル更新" onChange={(e) =>setTitle(e.target.value)} />
            <input type="text" value={putAuthor} placeholder="著者更新" onChange={(e) =>setAuthor(e.target.value)} />
            <select value={putStatus} onChange={(e) => {setStatus(e.target.value)}}>
                <option value="available">未貸出</option>
                <option value="borrowed">貸出中</option>
                <option value="reserved">予約中</option>
            </select>
            <button onClick={() => putData(book.id)}>更新</button>
            <button onClick={() => deleteData(book.id)}>削除</button>
        </>
    );
};

export default BookDetail;
