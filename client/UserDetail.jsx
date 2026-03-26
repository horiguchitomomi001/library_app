import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function UserDetail() {
    //共通
    const API_URL = import.meta.env.VITE_API_URL;
    const [ user, setUser ] = useState({});
    const { id } = useParams();
    const token = localStorage.getItem("token");
    //更新用ステート
    const [ putName, setName ] = useState({});
    const [ putEmail, setEmail ] = useState({});
    const [ putOldPassword, setOldPassword ] = useState({});
    const [ putPassword, setPassword ] = useState({});
    const [ putRole, setRole ] = useState({});

    //詳細
    const fetchUser = async () => {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const json = await res.json();
        setUser(json);
    }
    //更新
    const putUser = async (userId) => {
        const res = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: putName,
                email: putEmail,
                oldpassword: putOldPassword,
                password: putPassword,
                role: putRole
            })
        });
        const json = await res.json();
        setUser(json);
    }   
    //削除
    const deleteUser = async (userId) => {
        const res = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        });
        const json = await res.json();
        setUser(json);
    } 

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (!user?.id) return;
        setName(user.name ?? '');
        setEmail(user.email ?? '');
        setOldPassword(user.password_hash ?? '');
        setRole(user.role ?? '');
    }, [user.id]);

    return(
        <>
            <p>氏名：{user.name}</p>
            <p>メール：{user.email}</p>
            <p>ロール：{user.role}</p>

            <input type="text" value={putName} placeholder="名前更新"   onChange={(e) =>setName(e.target.value)} />
            <input type="text" value={putEmail} placeholder="メール更新" onChange={(e) =>setEmail(e.target.value)} />
            <input type="password" placeholder="旧パスワード" onChange={(e) =>setOldPassword(e.target.value)} />
            <input type="password" placeholder="パスワード更新" onChange={(e) =>setPassword(e.target.value)} />
            <select value={putRole} onChange={(e) =>setRole(e.target.value)}>
                <option value="user">ユーザー</option>
                <option value="librarian">司書</option>
                <option value="admin">管理者</option>
            </select>
            <button onClick={() => putUser(user.id)}>更新</button>
            <button onClick={() => deleteUser(user.id)}>削除</button>
        </>
    );
};

export default UserDetail;
