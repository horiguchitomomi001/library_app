import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function MyPage() {
    //共通
    const API_URL = import.meta.env.VITE_API_URL;
    const [ reservedBook, setReservedBook ] = useState([]);
    const [ loanedBook, setLoanedBook ] = useState([]);
    // const { id } = useParams();
    const loginUserId = JSON.parse(localStorage.getItem("user")).id;
    //貸出：一覧
    const loanedBookList = async () => {
        const res = await fetch(`${API_URL}/users/${loginUserId}/loans`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const json = await res.json();
        setLoanedBook(json);
    }
    //貸出：返却
    const returnBook = async (bookId) => {

        const res = await fetch(`${API_URL}/loans/${bookId}/return`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loginUserId: loginUserId,
            }),
        });
        const json = await res.json();
    }
    //貸出：延長
    const extendBook = async (bookId) => {
        const res = await fetch(`${API_URL}/loans/${bookId}/extend`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loginUserId: loginUserId,
            }),
        });
        
        const json = await res.json();
    }
    //予約：一覧
    const reservedBookList = async () => {
        const res = await fetch(`${API_URL}/users/${loginUserId}/reservations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const json = await res.json();
        setReservedBook(json);
    }
    //予約：貸出
    const fulfillReservation = async (bookId) => {
        const res = await fetch(`${API_URL}/reservations/${bookId}/loan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loginUserId: loginUserId,
            }),
        });
        const json = await res.json();
    }  
    //予約：キャンセル
    const cancelBook = async (bookId) => {
        const res = await fetch(`${API_URL}/reservations/${bookId}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loginUserId: loginUserId,
            }),
        });
        
        const json = await res.json();
    } 
    //日付フォーマット
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("ja-JP");
    };

    //貸出一覧
    useEffect(() => {
        loanedBookList();
        reservedBookList();
    }, []);

    return(
        <>
            <h2>マイページ</h2>
            <div className="content">
                <div className="loanList">
                    <h3>貸出一覧</h3>
                    {loanedBook.length > 0 &&(
                        <table>
                        <thead>
                            <tr>
                            <th>タイトル</th>
                            <th>著者</th>
                            <th>返却予定日</th>
                            <th>返却/延長</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loanedBook.map(book => (
                            <tr key={book.id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{formatDate(book.due_date)}</td>
                                <td>
                                    <button onClick={() => returnBook(book.book_id)}>返却</button>
                                    <button onClick={() => extendBook(book.book_id)}>延長</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    )}
                </div>
                <div className="reservationList">
                    <h3>予約一覧</h3>
                    {reservedBook.length > 0 &&(
                        <table>
                            <thead>
                                <tr>
                                <th>タイトル</th>
                                <th>著者</th>
                                <th>予約日</th>
                                <th>貸出/解除</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservedBook.map(book => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{formatDate(book.reserved_at)}</td>
                                    <td>
                                        <button onClick={() => fulfillReservation(book.book_id)}>貸出</button>
                                        <button onClick={() => cancelBook(book.book_id)}>キャンセル</button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyPage;
