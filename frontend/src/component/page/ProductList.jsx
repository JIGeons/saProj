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
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
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

// 버튼과 SortContainer를 위한 스타일 정의
const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
`;

// 엑셀 버튼 스타일 정의
const ExcelButton = styled.button`
  margin-right: 10px;
  padding: 10px 15px;
  background-color: #28a745; /* Green background color */
  color: #fff; /* White text color */
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-lefg: 10px;
  margin-bottom: 10px;

  &:hover {
    background-color: #218838; /* Darker green on hover */
  }
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

const ReviewModal = styled.div`
  display: ${({ showReviewModal }) => (showReviewModal ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
`;

const ReviewModalContent = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  max-width: 50%;
  text-align: center;
`;

const ReviewModalTitle = styled.h2`
  margin-bottom: 20px;
`;

const ReviewModalInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
`;

const ReviewModalButton = styled.button`
  padding: 10px 15px;
  background-color: #28a745; /* 초록색 배경 */
  color: #fff; /* 흰색 텍스트 색상 */
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;

  &:hover {
    background-color: #218838; /* 마우스 호버 시 더 진한 초록색 */
  }
`;

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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStartDate, setReviewStartDate] = useState("");
  const [reviewEndDate, setReviewEndDate] = useState("");

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

  const handleReviewDownload = () => {
    // 선택한 날짜 범위에 따라 리뷰 다운로드를 위한 로직을 구현하세요.
    console.log("선택한 날짜 범위에서 리뷰 다운로드 중", reviewStartDate, "부터", reviewEndDate, "까지");
    // 모달과 날짜 범위 초기화
    setShowReviewModal(false);
    setReviewStartDate("");
    setReviewEndDate("");
  };
  return (
    <Container>
      
      {loading ? (
        <LoadingContainer>데이터를 불러오는 중...</LoadingContainer>
      ) : (
        <React.Fragment>
          <ActionContainer>
            <ExcelButton onClick={() => setShowReviewModal(true)}>
              엑셀 저장
            </ExcelButton>
            <SortContainer>
              <SortItem onClick={() => handleSort('lowToHigh')} active={sortBy === 'price'}>가격 낮은 순</SortItem>
              <SortItem onClick={() => handleSort('highToLow')} active={sortBy === 'price'}>가격 높은 순</SortItem>
              <SortItem onClick={() => handleSort('name')} active={sortBy === 'name'}>이름 순</SortItem>
              <SortItem onClick={() => handleSort('reviews')} active={sortBy === 'reviewcount'}>리뷰 많은 순</SortItem>
            </SortContainer>
          </ActionContainer>
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
          <ReviewModal showReviewModal={showReviewModal}>
            <ReviewModalContent>
              <ReviewModalTitle>리뷰 다운로드</ReviewModalTitle>
              <ReviewModalInput
                type="date"
                value={reviewStartDate}
                onChange={(e) => setReviewStartDate(e.target.value)}
                placeholder="시작 날짜"
              />
              <ReviewModalInput
                type="date"
                value={reviewEndDate}
                onChange={(e) => setReviewEndDate(e.target.value)}
                placeholder="종료 날짜"
              />
              <ReviewModalButton onClick={handleReviewDownload}>
                다운로드
              </ReviewModalButton>
              <ReviewModalButton onClick={() => setShowReviewModal(false)}>
                취소
              </ReviewModalButton>
            </ReviewModalContent>
          </ReviewModal>
        </React.Fragment>
      )}
    </Container>
  );
};

export default ProductList;