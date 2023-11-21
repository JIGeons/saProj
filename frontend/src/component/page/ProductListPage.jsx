import React, {useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";


const product = styled.div`
    padding: 10px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: colums;
    align-items: center;
    justify-content: flex-start;
    height: 85vh;  
`;

function ProductList(product){
   

    return (
        <div>
        <div></div>
        <h1>드시모네 상품 목록</h1>
        <div className="products">
            <div className="product">
                <a href="#">
                    <h3>드시모네 4500 (30포)</h3> 
                    <p>168,000원</p>
                </a>
            </div>
            
        </div>
        </div>
    );
}

export default ProductList