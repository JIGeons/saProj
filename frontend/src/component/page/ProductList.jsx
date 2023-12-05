import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  padding: 20px;
`;
const LoadingContainer = styled.div`
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
`;
const SortContainer = styled.ul`
  list-style: none;
  text-align: center;
  margin-bottom: 20px;
  display: flex;
`;

const SortItem = styled.li`
  margin-right: 20px;
  cursor: pointer;
  font-weight: ${({  active }) => (active ? "bold" : "normal")};
  color: #333;
  transition: color 0.3s;

  &:hover {
    color: #007BFF;
  }
`;

const ProductContainer = styled.div`
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Product = styled.div`
  width: calc(33.33% - 20px);
  margin-bottom: 20px;
  text-align: center;
  position: relative;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 300px; /* Set a fixed height */
  object-fit: contain; /* Maintain aspect ratio without cropping */
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const ProductName = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: #333;
`;

const ProductPrice = styled.h4`
  margin-top: 5px;
  color: #007BFF;
  font-size: 18px;
`;

const Modal = styled.div`
  display: ${({ showModal }) => (showModal ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  max-width: 80%;
  text-align: center;

  img {
    width: 100%;
    border-radius: 8px;
  }
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
`;
const styles = {
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
}

const handleMouseEnter = (productId) => {
  document.getElementById(`additionalInfo${productId}`).style.display = 'block';
};

const handleMouseLeave = (productId) => {
  document.getElementById(`additionalInfo${productId}`).style.display = 'none';
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/posts/product_list/')
      .then(response => {
        setProducts(response.data);
        setLoading(false); // 데이터 로딩 완료 후 loading 상태 변경
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setLoading(false); // 에러 발생 시에도 loading 상태 변경
      });
  }, []);

  const handleSort = (type) => {
    let sortedProducts = [...products];

    switch (type) {
      case 'highToLow':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'lowToHigh':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'name':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'reviews':
        sortedProducts.sort((a, b) => b.review_count  - a.review_count );
        break;
      default:
        break;
    }

    setSortBy(type);
    setProducts(sortedProducts);
  };

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <Container>
      
      {loading ? (
        <LoadingContainer>데이터를 불러오는 중...</LoadingContainer>
      ) : (
        <React.Fragment>
          <SortContainer>
            <SortItem onClick={() => handleSort('lowToHigh')} active={sortBy === 'price'}>가격 낮은 순</SortItem>
            <SortItem onClick={() => handleSort('highToLow')} active={sortBy === 'price'}>가격 높은 순</SortItem>
            <SortItem onClick={() => handleSort('name')} active={sortBy === 'name'}>이름 순</SortItem>
            <SortItem onClick={() => handleSort('reviews')} active={sortBy === 'reviewcount'}>리뷰 많은 순</SortItem>
          </SortContainer>
          <ProductContainer>
            {products.map(product => (
                <Product key={product.id}>
                    <Link to={`productdetail/${product.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                        <ProductImage src={product.src} alt={product.name} />
                        
                        <div id={`additionalInfo${product.id}`} style={styles.additionalInfo}>
                          {/* Display additional information here */}
                          <p>** 리뷰 분석 **</p>
                          <p>총 리뷰 개수 : {product.review_count}</p>
                          <p>긍정 리뷰 개수 : {product.review_good}</p>
                          <p>부정 리뷰 개수 : {product.review_bad}</p>
                        </div>
                        <div
                          style={styles.productHover}
                          onMouseEnter={() => handleMouseEnter(product.id)}
                          onMouseLeave={() => handleMouseLeave(product.id)}
                        />

                        <ProductName>{product.name}</ProductName>
                        <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
                    </Link>
                </Product>
            ))}
          </ProductContainer>
          <Modal showModal={selectedImage !== null} onClick={closeModal}>
            <ModalContent>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
              {selectedImage && <img src={selectedImage} alt="Selected Product" />}
            </ModalContent>
          </Modal>
        </React.Fragment>
      )}
    </Container>
  );
};

export default ProductList;