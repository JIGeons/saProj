import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
  const [signUpErrorMessage, setSignUpErrorMessage] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredVerificationCode, setEnteredVerificationCode] = useState("");
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [resendcode, setResendCode] = useState(false);
  const [isVerificationCodeEntered, setIsVerificationCodeEntered] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(""); // 새로운 상태 변수 추가
  const navigate = useNavigate();

  const url = 'http://localhost:8000/users'

  const checkUserIdValidity = async() => {
    try {
      const response = await axios.post(`${url}/findID/`, {
        userid: userId,
      });
      console.log(response.data.success)

      if (response.data.success) {
        console.log('아이디를 생성할 수 있습니다.');
        setUserIdCheckMessage("사용 가능한 아이디입니다.");
        setIsUserIdValid(true);
      } else {
        console.log('중복된 아이디가 존재합니다.')
        setUserIdCheckMessage("이미 사용 중인 아이디입니다.");
        setIsUserIdValid(false);
      }
    } catch (error) {
      console.error('에러 발생:', error);
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

  const handleSignUp = async(e) => {
    e.preventDefault();
  
    // 이메일 인증이 완료되었는지 확인
    if (!isEmailVerified) {
      setSignUpErrorMessage("가입 실패! 이메일 인증을 먼저 완료하세요.");
      alert("가입 실패! 이메일 인증을 먼저 완료하세요.");
      return;
    }

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

    if(!isVerificationCodeEntered) {
      setSignUpErrorMessage("이메일 인증을 완료해주세요.");
      alert("가입 실패! 이메일 인증을 완료해주세요.");
      return;
    }
  
    // 가입 성공 시
    try {
      const response = await axios.post(`${url}/signup/`,{
        userId: userId,
        password: password,
        name: username,
        email: email
      })

      if(response.data.success){
        alert("가입 성공");
        navigate("/");
      }
    } catch(error){
      alert("가입 실패");
      window.location.reload();
    }
  };

  const handleVerificationCodeSubmit = () => {
    
    console.log(verificationCode)
    if (verificationCode === enteredVerificationCode) {
      setIsEmailVerified(true);
      alert("인증 확인!");
      setIsVerificationCodeEntered(true); // 코드가 확인되면 true로 설정
    } else {
      alert("인증 코드가 올바르지 않습니다.")
    }
  };

  const handleSendVerificationCode = async() => {
    // 이메일이 유효한지 확인
    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      setEmailErrorMessage("이메일을 올바르게 입력해주세요.");
      return;
    } else {
      try {
        if (username === ""){
          alert("이름을 먼저 적어주세요.")
        }
        const response = await axios.post(`${url}/send_code/`, {
          email: email,
          name: username,
        });
  
        if (response.data.success) {
          console.log('코드를 성공적으로 보냈습니다.');
          setResendCode(true);
          setIsVerificationCodeSent(true);
          setVerificationCode(response.data.verification_code)

                   // 이메일이 성공적으로 전송되었으므로 오류 메시지 초기화
          setEmailErrorMessage("");
        } else {
          console.log('이미 존재하는 이메일');
          setEmailErrorMessage("이미 존재 하는 이메일입니다. 다른 이메일을 적어주세요");
        }
      } catch (error) {
        console.error('에러 발생:', error);
      }      

    }
  };

  // 이메일 형식을 확인하는 함수
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
          {emailErrorMessage && (
            <p style={{ color: "#e53935", fontSize: "14px", marginTop: "5px" }}>
              {emailErrorMessage}
            </p>
          )}
          {isVerificationCodeSent && (
            <>
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="인증 코드 입력"
                  value={enteredVerificationCode}
                  onChange={(e) => setEnteredVerificationCode(e.target.value)}
                  disabled={isVerificationCodeEntered} // 코드가 확인되면 입력을 비활성화합니다
                />
                <Button type="button" onClick={handleVerificationCodeSubmit}>
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
          <Button type="submit">
            가입하기
          </Button>
        </Form>
        <FooterText>
          이미 계정이 있으신가요?{" "}
          <StyledLink to="/">로그인</StyledLink>
        </FooterText>
      </Container>
    </Wrapper>
  );
};

export default SignUp;