import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #2979ff, #6ec6ff);
`;

const Container = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
  overflow: hidden;
`;

const Title = styled.h2`
  color: #01579B;
  font-size: 32px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  position: relative; /* 추가 */
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #ccc; /* 테두리 스타일 추가 */
  border-radius: 8px;
  overflow: hidden; /* 자식 요소의 border-radius를 적용하기 위해 overflow: hidden; 추가 */
`;

const Input = styled.input`
  flex: 9;
  padding: 15px;
  font-size: 16px;
  color: #555;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  outline: none;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:focus {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const EyeIcon = styled.span`
  flex: 1;
  position: absolute;
  top: 50%;
  right: 5px; /* Adjust the right position to move the eye icon inward */
  transform: translateY(-50%);
  cursor: pointer;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1565c0;
  }
`;

const FooterText = styled.p`
  color: #aaa;
  font-size: 14px;
  margin-top: 20px;
  white-space: nowrap;
`;

const ErrorText = styled.p`
  color: #e53935;
  font-size: 14px;
  margin-top: 10px;
`;

const StyledLink = styled(Link)`
  color: #2196f3;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
const url = "http://localhost:8000/users"

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    
    const login = await axios.post(`${url}/login/`, {
      userId: userId,
      password: password
    })

    // 로그인 성공 시 처리
    if (login.data.success) {      
      alert("로그인 성공");
      navigate(`posts/productlist/`);
    } 
    // 로그인 실패 시
    else if (login.data.status == 0){
      setError("승인 대기 중 입니다. 관리자에게 문의 하세요");
    } else if (login.data.status == 2){
      setError("승인 거절입니다. 관리자에게 문의 하세요");
    } else {
      setError("아이디 또는 비밀번호를 잘못 입력했습니다.")
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title>로그인</Title>
        <Form onSubmit={handleLogin}>
          <InputWrapper>
            <Input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <EyeIcon
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </EyeIcon>
          </InputWrapper>
          {error && <ErrorText>{error}</ErrorText>}
          <Button type="submit">로그인</Button>
        </Form>
        <FooterText>계정이 없으신가요?{" "}
          <StyledLink to="/signup">회원가입</StyledLink></FooterText>
      </Container>
    </Wrapper>
  );
};

export default Login;