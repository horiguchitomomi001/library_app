import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function BookManagement() {

    //共通
    const API_URL = import.meta.env.VITE_API_URL;
    const [ books, setBook ] = useState([]);
    // const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    //検索用ステート
    const [ searchTitle, setSearchTitle ] = useState('');
    const [ searchAuthor, setSearchAuthor ] = useState('');
    //追加用ステート
    const [ addTitle, setAddTitle ] = useState('');
    const [ addAuthor, setAddAuthor ] = useState('');

    // 表示
    //検索
    const searchBooks = async (searchTerm) => {
        const params = new URLSearchParams();
        if (searchTitle) params.append('title', searchTitle);
        if (searchAuthor) params.append('author', searchAuthor);
        const res = await fetch(`${API_URL}/books/search?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const json = await res.json();
        setBook(json);
    }  
    // 追加
    const postData = async () => {
        const res = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                title: addTitle, 
                author: addAuthor
            })
        });
        const json = await res.json();
        setBook(json);
    }
    return(
        <>
            <h2>書籍管理</h2>
            <div className="content">
                <div className="bookAdd">
                    <h3>書籍追加</h3>
                    <input type="text" value={addTitle} placeholder="タイトル追加" onChange={(e) => setAddTitle(e.target.value)}></input>
                    <input type="text" value={addAuthor} placeholder="著者追加" onChange={(e) => setAddAuthor(e.target.value)}></input>
                    <button type="button" onClick={postData}>追加</button>
                </div>
                <div className="bookSearch">
                    <h3>書籍検索</h3>
                    <input type="text" placeholder="タイトル検索" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
                    <input type="text" placeholder="著者検索" value={searchAuthor} onChange={(e) => setSearchAuthor(e.target.value)} />
                    <button onClick={searchBooks}>検索</button>
                </div>   
            </div>

            {/* テーブル表示 */}
            {books.length > 0 &&(
                <table>
                <thead>
                    <tr>
                    <th>タイトル</th>
                    <th>著者</th>
                    <th>貸出状況</th>
                    <th>詳細</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                    <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        {book.status === 'available' && <td>未貸出</td>}
                        {book.status === 'borrowed' && <td>貸出中</td>}
                        {book.status === 'reserved' && <td>予約中</td>}
                        <td>
                        <button onClick={() => navigate(`/books/${book.id}`)}>詳細</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </>
    );
}

export default BookManagement;  