import React, { useEffect, useState } from "react";
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
                    <li key={product.id}>{product.name}</li>
                ))}
            </ul>
        </div>
    )
};

export default Product