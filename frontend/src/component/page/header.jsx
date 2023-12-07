// header.jsx

import React from "react";
import { Link } from "react-router-dom";
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
  return (
    <HeaderContainer>
      <Logo>Your Logo</Logo>
      <Navigation>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/posts/productlist">Products</NavLink>
        <NavLink to="/about">About</NavLink>
      </Navigation>
    </HeaderContainer>
  );
};

export default Header;
