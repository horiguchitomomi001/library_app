import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import Top from './Top.jsx'
import App from './App.jsx'
import MyPage from './MyPage.jsx';
import Book from './BookManagement.jsx';
import BookDetail from './BookDetail.jsx';
import User from './UserManagement.jsx';
import UserDetail from './UserDetail.jsx';

console.log("main.jsxが読み込まれました。");
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/app" element={<App />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/books" element={<Book />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/users" element={<User />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
