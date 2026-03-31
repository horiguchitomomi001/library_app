import { useEffect, useState } from 'react'
// import './App.css'
import { useNavigate } from 'react-router-dom';


function App() {
  //共通
  const API_URL = import.meta.env.VITE_API_URL;
  const [books, setBook] = useState([]);
  const [user, setUser] = useState([]);
  //検索
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');

  //詳細遷移
  const navigate = useNavigate();
  //ユーザーデータの取得
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 検索
  const searchBooks = async () => {
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

  return (
    <>
      <h2>△△△高校図書館</h2>
      <div className="content">
        <div className="menuBtn">
          <button onClick={() => navigate('/mypage')}>マイページ</button>
          {(user.role === "admin" || user.role === "librarian") && (
            <button onClick={() => navigate('/users')}>ユーザー管理</button>
          )}
          {(user.role === "admin") && (
            <button onClick={() => navigate('/books')}>書籍管理</button>
          )}
        </div>
        <div className="bookSearch">
          <input type="text" placeholder="タイトル検索" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
          <input type="text" placeholder="著者検索" value={searchAuthor} onChange={(e) => setSearchAuthor(e.target.value)} />
          <button onClick={searchBooks}>書籍検索</button>
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
      </div>
    </>
  )
}

export default App


