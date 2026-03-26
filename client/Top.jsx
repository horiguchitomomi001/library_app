import { useEffect, useState } from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom';

function Top() {
    const API_URL = import.meta.env.VITE_API_URL;
    //ログイン
    const [userMail, setMail] = useState('');
    const [userPassword, setPassword] = useState('');
    const [user, setUser] = useState([]);
    //詳細遷移
    const navigate = useNavigate();
    
    // ログイン
    const userLogin = async () => {
        const res = await fetch(`${API_URL}/auth`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: userMail, password: userPassword })
        });
        const data = await res.json();
        if(data.token){
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            navigate('/app');
        }else{
            alert("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
        }
    }

  return (
    <>
      {/* ログイン */}
      <input type="text" placeholder="メールアドレス" value={userMail} onChange={(e) => setMail(e.target.value)} />
      <input type="password" placeholder="パスワード" value={userPassword} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={userLogin}>ログイン</button>
    </>
  )
}
  export default Top