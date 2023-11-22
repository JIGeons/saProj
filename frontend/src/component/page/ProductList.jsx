import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
        <div>
            <h1>Data from Django: </h1>
            <ul>
                {products.map(product => (
                    <div>
                        <li key={product.id}>{product.name}</li>
                        <Link to={`/product/${product.id}`} > 상품 이동 </Link>
                    </div>
                ))}
            </ul>
        </div>
    )
};

export default Product