import React, {useState} from "react";
import axios from 'axios';

const Signup = () => {
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/users/signup/', {
                userId: userId,
                password1: password1,
                password2: password2,
                name: name,
                email: email,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': window.csrf_token,
                },
            });
        } catch (error) {
            console.error("회원가입 오류: ", error);
        }
    };

    return (
        <div>
            <h2>회원가입</h2>
            <label>아이디</label>
            <input type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <br />
            <label>이름</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            <br />
            <label>이메일</label>
            <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <br />
            <label>비밀번호</label>
            <input type="password" id="password1" value={password1} onChange={(e) => setPassword1(e.target.value)} />
            <br />
            <label>비밀번호 확인</label>
            <input type="password" id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} />
            <br />
            <button onClick={handleSignup}>승인 신청</button>
        </div>
    );
};

export default Signup;