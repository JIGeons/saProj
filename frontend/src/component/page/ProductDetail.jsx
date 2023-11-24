import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductImageContainer = styled.div`
  flex: 1;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProductInfoContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

const ProductName = styled.h3`
  font-size: 24px;
  margin-bottom: 10px;
`;

const ProductPrice = styled.h4`
  font-size: 20px;
  margin-bottom: 10px;
  color: #007BFF;
`;

const ReviewsButton = styled.button`
  background-color: #007BFF;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
`;

const ReviewContainer = styled.div`
  margin-top: 20px;
  display: ${({ showReviews }) => (showReviews ? "block" : "none")};

  p {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }
  }
`;

const ProductDetail = () => {
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/posts/product_detail/?prdid=${productId}`)
      .then((response) => {
        setProduct(response.data.product);
        setReviews(response.data.reviews);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <Container>
      <ProductImageContainer>
        <ProductImage src={product.src} alt={product.name} />
      </ProductImageContainer>
      <ProductInfoContainer>
        <ProductName>{product.name}</ProductName>
        <ProductPrice>{product.price}원</ProductPrice>

        <p>총 후기 개수: {product.reviews}__개</p>
        <p>긍정 후기 개수: {product.good}__개</p>
        <p>부정 후기 개수: {product.bad}__개</p>
        <ReviewsButton onClick={() => setShowReviews(!showReviews)}>
          {showReviews ? "부정적 리뷰 숨기기" : "부정적 리뷰 보기"}
        </ReviewsButton>
      </ProductInfoContainer>

      <ReviewContainer showReviews={showReviews}>
        <p>** 전체 리뷰 내용 **</p>
        <table>
          <thead>
            <tr>
              <th>리뷰 번호</th>
              <th>제목</th>
              <th>내용</th>
              <th>이름</th>
              <th>조회수</th>
              <th>긍·부정</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {reviews
              .filter((review) => review.good_or_bad === "0")
              .map((review) => (
                <tr key={review.review_num}>
                  <td>{review.review_num}</td>
                  <td>{review.title}</td>
                  <td style={{ width: "50%" }}>{review.content}</td>
                  <td>{review.user_name}</td>
                  <td>{review.count}</td>
                  <td>{review.good_or_bad}</td>
                  <td>{review.date}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </ReviewContainer>
    </Container>
  );
};

export default ProductDetail;
