import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import Top from './Top.jsx'
import App from './App.jsx'
import Book from './BookManagement.jsx';
import BookDetail from './BookDetail.jsx';
import MyPage from './MyPage.jsx';
import User from './UserManagement.jsx';
import UserDetail from './UserDetail.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/App" element={<App />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/book" element={<Book />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/user" element={<User />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
