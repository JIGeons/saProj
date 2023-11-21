import React, {useState} from "react";
import axios from 'axios';

const Signup = () => {
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:8000/users/signup/', {
                userId: userId,
                password: password,
                name: name,
                email: email,
            });
        } catch (error) {
            console.error("회원가입 오류: ", error);
        }
    };

    return (
        <div>
            <h2>회원가입</h2>
            <label>아이디</label>
            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <br />
            <label>이름</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <br />
            <label>이메일</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <br />
            <label>비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button onClick={handleSignup}>승인 신청</button>
        </div>
    );
};

export default Signup;