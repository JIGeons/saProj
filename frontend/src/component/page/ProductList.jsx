import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sortContainer: {
    display: 'flex',
    listStyle: 'none',
    textAlign: 'center',
    marginBottom: '20px',
  },
  sortItem: {
    marginRight: '20px',
    cursor: 'pointer',
  },
  productContainer: {
    width: '60%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    border: '1px solid #ccc', // 테두리 스타일
    borderRadius: '10px', // 꼭짓점 둥글게
    padding: '10px', // 내부 여백
  },
  product: {
    position: 'relative', // Added for positioning
    width: 'calc(33.33% - 10px)',
    marginBottom: '20px',
    textAlign: 'center',
  },
  productImage: {
    width: '80%',
  },
  additionalInfo: {
    position: 'absolute',
    top: '50%', // Adjust as needed
    left: '50%', // Adjust as needed
    transform: 'translate(-50%, -50%)',
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '1px',
    borderRadius: '5px',
    display: 'none',
  },
  productHover: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  },
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/posts/product_list/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const handleSort = (type) => {
    let sortedProducts = [...products];

    switch (type) {
      case 'price':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'name':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'reviews':
        sortedProducts.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    setSortBy(type);
    setProducts(sortedProducts);
  };

  const handleMouseEnter = (productId) => {
    document.getElementById(`additionalInfo${productId}`).style.display = 'block';
  };

  const handleMouseLeave = (productId) => {
    document.getElementById(`additionalInfo${productId}`).style.display = 'none';
  };

  return (
    <div style={styles.container}>
      <ul style={styles.sortContainer}>
        <li style={styles.sortItem} onClick={() => handleSort('price')}>가격 낮은 순</li>
        <li style={styles.sortItem} onClick={() => handleSort('name')}>이름 순</li>
        <li style={styles.sortItem} onClick={() => handleSort('reviews')}>리뷰 많은 순</li>
      </ul>
      <div style={styles.productContainer}>
        {products.map(product => (
          <div style={styles.product} key={product.id}>
            <Link to={`productdetail/${product.id}`} style={{ textDecoration: 'none', color: 'black' }}>
              <img
                style={styles.productImage}
                src={product.src}
                alt={product.name}
              />
              <div
                id={`additionalInfo${product.id}`}
                style={styles.additionalInfo}
              >
                {/* Display additional information here */}
                <p>** 리뷰 분석 **</p>
                <p>총 리뷰 개수 : </p>
                <p>긍정 리뷰 개수 : </p>
                <p>부정 리뷰 개수 : </p>
                <p>자세히 보기</p>
              </div>
              <div
                style={styles.productHover}
                onMouseEnter={() => handleMouseEnter(product.id)}
                onMouseLeave={() => handleMouseLeave(product.id)}
              />
              <p>{product.name}</p>
              <h4>{product.price}원</h4>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
