import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";



const ProductDetail = () => {
    const [ products, setProducts ] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/posts/product_detail/?prdid=2107')
        .then(response => {
            setProducts(response.data);
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
        });
    }, []);

    return(
        
        <div>
            <h1>상품 디테일</h1>
            {ProductDetail.map(product => (
                <p>{product}</p>
            ))}

        </div>
    );
}

export default ProductDetail;