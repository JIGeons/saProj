import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align: center;
`;

const ProductImage = styled.div`
  width: 'calc(50% - 10px)',
`;

const ProductInfo = styled.div`
  width: 'calc(50% - 10px)',
`;

const ReviewContainer = styled.div`
  align-items: center;
  margin-top: 50px; /* 필요에 따라 여백 조절 */
  display: ${(props) => (props.showReviews ? "flex" : "none")};
  justify-content: center;
  flex-direction: row; /* 가로 방향으로 정렬 */
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
    <div>
      <Container>
        <ProductImage>
          <img src={product.src} alt={product.name} />
        </ProductImage>
        <ProductInfo>
          <h3>{product.name}</h3>
          <h4>{product.price}원</h4>

          <p>총 후기 개수: {product.reviews}__개</p>
          <p>긍정 후기 개수: {product.good}__개</p>
          <p>부정 후기 개수: {product.bad}__개</p>
          <button onClick={() => setShowReviews(!showReviews)}>
            {showReviews ? "Hide Negative Reviews" : "Show Negative Reviews"}
          </button>
        </ProductInfo>
      </Container>
      <p style={{textAlign:'center'}}>** 전체 리뷰 내용 **</p>
      <ReviewContainer className="review" showReviews={showReviews}>
        
        <ul>
          {reviews
            .filter((review) => review.good_or_bad === "0")
            .map((review) => (
              <li key={review.id}>{review.title}</li>
            ))}
        </ul>
      </ReviewContainer>
    </div>
  );
};

export default ProductDetail;
