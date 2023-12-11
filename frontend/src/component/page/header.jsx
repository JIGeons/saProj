// header.jsx

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

const HeaderContainer = styled.div`
  background-color: #708090;
  padding: 10px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  margin: 0;
  margin-left: 50px;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
    const location = useLocation();
    const [logoText, setLogoText] = useState("");
    const [user, setUser] = useState({});
    const token = localStorage.getItem('authToken');

    useEffect(() => {
      const getLogoText = async () => {

        try {
          await axios.get('http://localhost:8000/users/adminName/', {
            headers: {'Authorization': `Token ${localStorage.getItem('authToken')}`}
          }).then((response) => {
            setUser(response.data.user);
          })

          let prd_name = "";

          if (location.pathname === "/posts/productlist") {
            prd_name = "상품목록";
          }

          else if(location.pathname === "/adminpage/") {
            prd_name = `${user.name}님의 관계자 페이지`;
          }

          else if(location.pathname.startsWith("/posts/productlist/productdetail/")){
            const prd_id = location.pathname.split('/').pop();
            await axios.post(`http://localhost:8000/posts/prdId/?prdId=${prd_id}`)
            .then((response) => {
              prd_name = response.data.prdName
            })
          }

          setLogoText(prd_name || "SA Project");
        } catch (error) {
          console.error("에러 발생 : ", error);
        }
      };

      getLogoText();
    }, [location.pathname]);

    console.log(token);

    const Logout = async() => {
      await axios.get('http://localhost:8000/users/logout/', {
        headers: {'Authorization': `Token ${token}`}
      }).then((response) => {
        localStorage.removeItem('authToken'); // 토큰 삭제

        window.location.href = '/';  // 로그인 페이지 경로로 리다이렉트
      })
    };

    return (
        <>
            <HeaderContainer>
                <Logo>{logoText}</Logo>
                <Navigation>
                  <p>{user.name}님 </p>
                  {user.is_admin ?
                    <NavLink to ="/adminPage">관계자 페이지</NavLink> : ""
                  }
                  <NavLink to="/posts/productlist">상품 목록</NavLink>
                  <NavLink onClick={() => Logout()}>로그아웃</NavLink>
                </Navigation>
            </HeaderContainer>
            <Outlet />
        </>
    );
};

export default Header;