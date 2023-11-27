import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

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
  width: 100%;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1; /* InputWrapper 내에서 남은 공간을 모두 차지하도록 설정 */
  padding: 15px;
  font-size: 16px;
  color: #555;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  outline: none;
  transition: background-color 0.3s, box-shadow 0.3s;

  border: 1px solid #ccc; /* 테두리 스타일 추가 */
  border-radius: 8px;
  overflow: hidden; /* 자식 요소의 border-radius를 적용하기 위해 overflow: hidden; 추가 */

  &:focus {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const Button = styled.button`
  margin-left: 10px; /* 아이디와 버튼 사이에 오른쪽 여백 추가 */
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
`;

const StyledLink = styled(Link)`
  color: #2196f3;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const SignUp = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUserIdValid, setIsUserIdValid] = useState(true);

  const checkUserIdValidity = () => {
    // 예시: 실제 중복 확인 로직을 구현
    // 중복이 아니라면 setIsUserIdValid(true), 중복이면 setIsUserIdValid(false)를 호출
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // 여기에 실제 회원가입 로직을 구현
    console.log("회원가입 정보:", { username, email, password });
  };

  return (
    <Wrapper>
      <Container>
        <Title>회원가입</Title>
        <Form onSubmit={handleSignUp}>
          <InputWrapper>
            <Input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Button type="button" onClick={checkUserIdValidity}>
              중복 확인
            </Button>
          </InputWrapper>
          {!isUserIdValid && (
            <p style={{ color: "#e53935", fontSize: "14px", marginTop: "5px" }}>
              중복된 아이디입니다.
            </p>
          )}
          <InputWrapper>
            <Input
              type="text"
              placeholder="사용자명"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputWrapper>
          <Button type="submit">가입하기</Button>
        </Form>
        <FooterText>
          이미 계정이 있으신가요?{" "}
          <StyledLink to="/users/login">로그인</StyledLink>
        </FooterText>
      </Container>
    </Wrapper>
  );
};
