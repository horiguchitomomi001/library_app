import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function UserManagement() { 
    //共通
    const API_URL = import.meta.env.VITE_API_URL;
    const [ users, setUser ] = useState([]);
    // const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    //検索用ステート
    const [ searchName, setSearchName ] = useState('');
    const [ searchEmail, setSearchEmail ] = useState('');
    const [ searchRole, setSearchRole ] = useState('');
    //追加用ステート
    const [ addName, setAddName ] = useState('');
    const [ addEmail, setAddEmail ] = useState('');
    const [ addPassword, setAddPassword ] = useState('');
    const [ addRole, setAddRole ] = useState('user');

    //検索
    const searchUsers = async (searchTerm) => {
        const params = new URLSearchParams();
        if (searchName) params.append('name', searchName);
        if (searchEmail) params.append('email', searchEmail);
        if (searchRole) params.append('role', searchRole);
        const res = await fetch(`${API_URL}/users/search?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const json = await res.json();
        setUser(json);
    }
    //追加
    const postUser = async () => {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: addName,
                email: addEmail,
                password: addPassword,
                role: addRole
            })
        });
        const json = await res.json();
        setUser(json);
    }
    return(
        <>
            <h2>アカウント管理</h2>
            <div className="content">
                <div className="userAdd">
                    <h3>アカウント追加</h3>
                    <input type="text" value={addName} placeholder="名前追加" onChange={(e) => setAddName(e.target.value)}></input>
                    <input type="text" value={addEmail} placeholder="メール追加" onChange={(e) => setAddEmail(e.target.value)}></input>
                    <input type="password" value={addPassword} placeholder="パスワード追加" onChange={(e) => setAddPassword(e.target.value)}></input>
                    <select value={addRole} placeholder="ロール追加" onChange={(e) => setAddRole(e.target.value)}>
                        <option value="user">ユーザー</option>
                        <option value="librarian">司書</option>
                        <option value="admin">管理者</option>
                    </select>
                    <button type="button" onClick={postUser}>追加</button>
                </div>
                <div className="userSearch">
                    <h3>アカウント検索</h3>
                    <input type="text" placeholder="名前検索" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                    <input type="text" placeholder="メールアドレス検索" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
                    <input type="text" placeholder="ロール検索" value={searchRole} onChange={(e) => setSearchRole(e.target.value)} />
                    <button onClick={searchUsers}>検索</button>
                </div>
            </div>

            {/* テーブル表示 */}
            {users.length > 0 &&(
                <table>
                <thead>
                    <tr>
                    <th>名前</th>
                    <th>メール</th>
                    <th>パスワード</th>
                    <th>権限</th>
                    <th>詳細</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.password}</td>
                        {user.role === 'user' && <td>ユーザー</td>}
                        {user.role === 'librarian' && <td>司書</td>}
                        {user.role === 'admin' && <td>管理者</td>}
                        <td>
                            <button onClick={() => navigate(`/users/${user.id}`)}>詳細</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </>
    );
}

export default UserManagement;