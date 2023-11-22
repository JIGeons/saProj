import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Wrapper = styled.div`
    
    padding: 10px;
`

const Container = styled.div`
    width: 80%;
    align: center;
`

const ProductContainer = styled.div`
    display: grid;
    border: 1px solid grey;

    width: 250px;
    margin-left:10px;
    margin-right: 10px;
    margin-bottom: 80px; 
    align: center;
    text-align: center;
    text-decoration: none;

`
const Product = () => {
    const [ products, setProducts ] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/posts/product_list/')
        .then(response => {
            setProducts(response.data);
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
        });
    }, []);

    return (
        <Wrapper>
            <h1>드시모네 상품 목록</h1>
            
            <Container>
                {products.map(product => (
                    <Link to={`productdetail/${product.id}`}>
                    <ProductContainer>
                        <img src={product.src} align='center'/>
                        <p>{product.name}</p>
                        <h4>{product.price}원</h4>
                        
                    </ProductContainer>
                    </Link>
                ))}
            </Container>
            
        </Wrapper>
    );
};

export default Product