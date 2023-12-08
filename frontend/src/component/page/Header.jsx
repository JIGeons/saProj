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

    useEffect(() => {
      const getLogoText = async () => {
        try {
          let prd_name = "";
          console.log(location.pathname)
          if (location.pathname === "/posts/productlist") {
            prd_name = "상품목록";
          }

          else if(location.pathname === "/adminpage/") {
            let user_name="";
            await axios.get(`http://localhost:8000/users/adminName/`)
            .then((response) => {
              user_name = response.data.adminName;
            })
            prd_name = `${user_name}님의 관계자 페이지`;
          }

          else if(location.pathname.startsWith("/posts/productlist/productdetail/")){
            const prd_id = location.pathname.split('/').pop();
            await axios.get(`http://localhost:8000/posts/prdId/?prdId=${prd_id}`)
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

    return (
        <>
            <HeaderContainer>
                <Logo>{logoText}</Logo>
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