import React, {useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginButton from "../ui/LoginButton";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: colums;
    align-items: center;
    justify-content: flex-start;
    height: 85vh;  
`;

const Header = styled.div`
    width: 100%;
    max-width: 720px;
    text-align: right;
`;

const Container = styled.div`
    width: 100%;
    max-width: 720;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    align-items: center;
`;

const Container2 = styled.form`
    display: flex;
    flex-directions: row;
    align-items: center;

    & > * {
        :not(:last-child){
            margin-bottom: 16px;
        }
    }
`;

const Container3 = styled.div`
    padding: 8px 16px;
    border: 1px solid grey;
    border-radius: 8px;
    display: flex;
    flex-directions: column;
`;

function Login(props){
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/login/', { 
                userId: userId,
                password: password,
            });

            const accessToken = response.data.access;
        } catch (error) {
            alert("로그인에 실패하였습니다.");
            console.error(error);
        }
    };

    const handleLogout = () => {
        setUserId('');
        setPassword('');
    };

    useEffect(() => {
        axios('http://localhost:8000/login/')
            .then((res) => {
                
            })
            .catch((error)=> console.log("Network Error : ", error));
    }, []);

    const navigate = useNavigate();

    return (
        <Wrapper>
            <Container>
                <Header>
                    <h1 style={{color:"blue"}}>드시모네 로그인</h1>
                    <hr/>
                </Header>
                <Container2 onSubmit={handleLogin}>
                    <Container3>
                        <input 
                            type="text"
                            placeholder="아이디"
                            id="userId"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        /><br/>
                        <input 
                            type="password"
                            placeholder="비밀번호"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Container3>
                    <LoginButton
                        type="submit"
                        title="로그인"
                    />
                </Container2>
                <Container2>
                    <div style={{marginRight: 10}}> <a href="/">회원가입</a></div>
                    <div> <a href="/"> 비밀번호 찾기</a></div>
                </Container2>
            </Container>
        </Wrapper>
    );
}

export default Login