import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const ProductDetail = () => {
    const params = useParams();
    const productId = params.id;

    const [ product, setProduct ] = useState({});
    const [ reviews, setReviews] = useState([]);

    useEffect(() => {
        
        axios.get(`http://localhost:8000/posts/product_detail/?prdid=${productId}`)
        .then(response => {
            setProduct(response.data.product);
            setReviews(response.data.reviews);
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
        });

    }, []);

    return(
        
        <div>
            <div className="productDetail">
                <div>
                    <img src= '${product.src}' />
                </div>
                <div>
                    <h1>상품 디테일</h1>
                </div>
            </div>

            <div className="review">
                <ul>
                    {
                        reviews.map(review => (
                            <li key={review.id}>{review.title}</li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
};

export default ProductDetail;