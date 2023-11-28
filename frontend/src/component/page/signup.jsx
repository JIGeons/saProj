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
  flex: 1;
  padding: 15px;
  font-size: 16px;
  color: #555;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  outline: none;
  transition: background-color 0.3s, box-shadow 0.3s;

  border: 1px solid #ccc;
  overflow: hidden;

  &:focus {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const Button = styled.button`
  margin-left: 10px;
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

const SendButton = styled.button`
  width: 110px;
  margin-left: 10px;
  padding: 0;
  padding-left: 7px;
  padding-right: 7px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s;
  white-space: normal;
  font-size: 17px;

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
  const [password_ck, setPassword_ck] = useState("");
  const [isUserIdValid, setIsUserIdValid] = useState(true);
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const [userIdCheckMessage, setUserIdCheckMessage] = useState("");
  const [isSignUpButtonDisabled, setIsSignUpButtonDisabled] = useState(true);
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const [signUpErrorMessage, setSignUpErrorMessage] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredVerificationCode, setEnteredVerificationCode] = useState("");
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [resendcode, setResendCode] = useState(false);

  const checkUserIdValidity = () => {
    // 예시: 실제 중복 확인 로직을 구현
    // 중복이 아니라면 setIsUserIdValid(true), 중복이면 setIsUserIdValid(false)를 호출
    const isAvailable = true; // 실제로는 중복 여부를 체크해야 합니다.

    if (isAvailable) {
      setUserIdCheckMessage("사용 가능한 아이디입니다.");
      setIsUserIdValid(true);
    } else {
      setUserIdCheckMessage("이미 사용 중인 아이디입니다.");
      setIsUserIdValid(false);
    }

    checkSignUpButton();
  };

  const checkPasswordMatch = () => {
    if (password_ck && password !== password_ck) {
      setPasswordMatchMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMatchMessage("");
    }

    checkSignUpButton();
  };

  const checkSignUpButton = () => {
    // 모든 필수 입력 필드가 유효한지 확인하여 가입하기 버튼 활성/비활성 상태를 설정
    const isAllValid =
      userId &&
      username &&
      email &&
      password &&
      password_ck &&
      isUserIdValid &&
      !passwordMatchMessage;

    setIsSignUpButtonDisabled(!isAllValid);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
  
    // 단순 예시: 유효성 검사 실패 시 에러 메시지 설정
    if (!userId) {
      setSignUpErrorMessage("아이디를 입력하세요.");
      alert("가입 실패! 아이디를 입력하세요.");
      return;
    }
  
    if (!username) {
      setSignUpErrorMessage("사용자명을 입력하세요.");
      alert("가입 실패! 사용자명을 입력하세요.");
      return;
    }
  
    if (!email) {
      setSignUpErrorMessage("이메일을 입력하세요.");
      alert("가입 실패! 이메일을 입력하세요.");
      return;
    }
  
    if (!password) {
      setSignUpErrorMessage("비밀번호를 입력하세요.");
      alert("가입 실패! 비밀번호를 입력하세요.");
      return;
    }
  
    if (!password_ck) {
      setSignUpErrorMessage("비밀번호 확인을 입력하세요.");
      alert("가입 실패! 비밀번호 확인을 입력하세요.");
      return;
    }
  
    if (!isUserIdValid) {
      setSignUpErrorMessage("아이디 중복 확인을 해주세요.");
      alert("가입 실패! 아이디 중복 확인을 해주세요.");
      return;
    }
  
    if (password !== password_ck) {
      setSignUpErrorMessage("비밀번호가 일치하지 않습니다.");
      alert("가입 실패! 비밀번호가 일치하지 않습니다.");
      return;
    }
  
    // 여기에 실제 회원가입 로직을 구현
    // 성공 시
    setIsSignUpSuccess(true);
  };

  const generateVerificationCode = () => {
    // 임의의 인증 코드 생성 로직
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const sendVerificationCodeToEmail = (email, code) => {
    // 이메일로 인증 코드 전송 로직
    console.log(`Verification code ${code} sent to ${email}`);
    // 여기에서는 실제로는 이메일로 인증 코드를 전송하는 로직을 호출해야 합니다.
    setVerificationCode(code); // 테스트를 위해 코드 저장
  };

  const handleVerificationCodeSubmit = () => {
    // 여기에서 입력된 인증 코드를 확인하는 로직을 구현해야 합니다.
    if (verificationCode === enteredVerificationCode) {
      setIsEmailVerified(true);
      setSignUpErrorMessage("인증 확인!");
    } else {
      setSignUpErrorMessage("인증 코드가 올바르지 않습니다.");
    }
  };

  const handleSendVerificationCode = () => {
    setResendCode(true);
    // 이메일 확인을 위한 코드 전송
    const generatedCode = generateVerificationCode(); // 이 함수는 임의로 작성된 함수입니다.
    sendVerificationCodeToEmail(email, generatedCode); // 이 함수는 임의로 작성된 함수입니다.
    setIsVerificationCodeSent(true);
    // 이메일로 인증 코드를 다시 전송하는 로직을 구현해야 합니다.
    // 이 함수를 호출하면 인증번호 전송 버튼은 "인증번호 재전송"으로 변경되어야 합니다.
    const regeneratedCode = generateVerificationCode(); // 새로운 코드 생성
    sendVerificationCodeToEmail(email, regeneratedCode); // 새로운 코드를 이메일로 전송
    setVerificationCode(regeneratedCode); // 새로운 코드로 업데이트
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
          {userIdCheckMessage && (
            <p style={{ color: isUserIdValid ? "#4CAF50" : "#e53935", fontSize: "14px", marginTop: "5px" }}>
              {userIdCheckMessage}
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
            <SendButton
              type="button"
              onClick={handleSendVerificationCode}
              dangerouslySetInnerHTML={{
                __html: resendcode ? "인증번호<br/>재전송" : "인증번호<br/>전송",
              }}
            />
          </InputWrapper>
          {isVerificationCodeSent && (
            <>
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="인증 코드 입력"
                  value={enteredVerificationCode}
                  onChange={(e) => setEnteredVerificationCode(e.target.value)}
                />
                <Button onClick={handleVerificationCodeSubmit}>
                  인증 확인
                </Button>
              </InputWrapper>
            </>
          )}
          <InputWrapper>
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={password_ck}
              onChange={(e) => setPassword_ck(e.target.value)}
              onBlur={checkPasswordMatch}
            />
          </InputWrapper>
          {passwordMatchMessage && (
            <p style={{ color: "#e53935", fontSize: "14px", marginTop: "5px" }}>
              {passwordMatchMessage}
            </p>
          )}
          <Button type="submit" disabled={isSignUpButtonDisabled}>
            가입하기
          </Button>
        </Form>
        <FooterText>
          이미 계정이 있으신가요?{" "}
          <StyledLink to="/users/login">로그인</StyledLink>
        </FooterText>
      </Container>
    </Wrapper>
  );
};

export default SignUp;