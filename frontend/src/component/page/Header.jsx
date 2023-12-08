// header.jsx

import React from "react";
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

    // 경로에 따라 다른 로고를 설정
    const getLogoText = () => {
        console.log(location.pathname)
        if (location.pathname === "/posts/productlist/") {
          return "상품목록";
        }
        if (location.pathname === "/posts/productlist/productdetail/:id") {
          return "id";
        }
        // 다른 경우에 대한 로고 텍스트 추가
        return "Your Logo";
    };
    return (
        <>
            <HeaderContainer>
                <Logo>{getLogoText()}</Logo>
                <Navigation>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/posts/productlist">Products</NavLink>
                <NavLink to="/about">About</NavLink>
                </Navigation>
            </HeaderContainer>
            <Outlet />
        </>
    );
};

export default Header;