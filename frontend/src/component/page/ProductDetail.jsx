import 'bootstrap/dist/css/bootstrap.min.css';
import './style/pagination.css';

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Chart from "chart.js/auto";
import axios from "axios";
import styled from "styled-components";
import Pagination from "react-js-pagination";

import CustomPaginationContainer from '../ui/CustompagContainer';
import CustomPaginationStyled from '../ui/CustomPagination';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const LoadingContainer = styled.div`
  margin: auto;
  font-size: 20px;
  font-weight: bold;
`;
const ProductInfoContainer = styled.div`
  display: flex;
  padding: 20px;
  margin-top: 20px;
`;

const ProductImageContainer = styled.div`
  margin-right: 20px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
`;

const ProductName = styled.h3`
  font-size: 24px;
  margin-bottom: 10px;
  text-align: center;
`;

const ProductPrice = styled.h4`
  font-size: 20px;
  margin-bottom: 10px;
  color: #007bff;
  text-align: center;
  margin-top: 0px;
`;

const ReviewsButton = styled.button`
  margin-top: 10px;
  width: 30%;
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin: auto;
  margin-right: 3%;
`;
const PieChart = styled.div`
  margin-top: 20px;
  text-align: left;
`

const ReviewContainer = styled.div`
  width: 80%;
  margin: auto;
  margin-top: 20px;

  p {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;

    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
    }

    th {
      background-color: #f2f2f2;
    }
    .title {
      width: 17%;
    }
    .content {
      width: 30%;
    }
    .name {
      width: 5%;
    }
    .good-bad {
      width: 5%;
    }
    .date {
      width: 13%;
    }
  }
`;

const ProductDetail = () => {
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [state, setState] = useState("all");
  const [showreviews, setShowreviews] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState("");

  const [effect, setEffect]= useState("False");

  const url = 'http://localhost:8000/posts/product_detail'

  const createChart = (totalCount, good, bad) => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const myChartRef = chartRef.current.getContext("2d");
    console.log("전체 : " + totalCount + ", 긍정 : "+ good+ ", 부정 : "+ bad);
    chartInstance.current = new Chart(myChartRef, {
      type: "pie",
      data: {
        labels: ["긍정 : " + good, "부정 : " + bad, "분석 x : " + (totalCount-good-bad)],
        datasets: [
          {
            data: [good/totalCount*100, bad/totalCount*100, (totalCount-good-bad)/totalCount*100],
            backgroundColor: ["rgb(54,162,235)", "rgb(255,99,132)", "rgb(128,128,128)"],
          },
        ],
      },
      options: {
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const label =
              chartInstance.current.data.labels[elements[0].index];
            setSelectedLabel(label);
          }
        },
      },
    });
  };

  useEffect(() => {
    loadpage();
  }, []);

  const loadpage = async () => {
    await axios
      .get(`${url}/?prdid=${productId}`)
      .then((response) => {
        const totalCount = response.data.total;
        const good = response.data.good;
        const bad = response.data.bad;

        setProduct(response.data.product);
        setReviews(response.data.review_page);
        setLoading(false);
        setTotal(Number(totalCount));

        createChart(totalCount, good, bad);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 오류 발생: ", error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        setEffect(true);
      });
  };

  useEffect(() => {
    if(effect){
      paging();
    }
  }, [state, currentPage])

  const paging = async () => {
    try {
      console.log('이펙트'+currentPage);
      await axios.get(`${url}/paging/?prdid=${productId}&page=${currentPage}&state=${state}`)
      .then((response) => {
        setTotal(Number(response.data.total));
        setReviews(response.data.reviews);
      })
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const changeState = (value) => {
    setState(value);
    setCurrentPage(1);
    console.log(reviews);
    console.log("total : ", + total);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container>
      <ProductInfoContainer>
        <ProductImageContainer>
          <ProductImage src={product.src} alt={product.name} />
        </ProductImageContainer>
        <ProductDetails>
          <ProductName>{product.name}</ProductName>
          <ProductPrice>
            {Number(product.price).toLocaleString()}원
          </ProductPrice>
          <div>
            <ReviewsButton onClick={() => changeState('all')}> 전체 </ReviewsButton>
            <ReviewsButton onClick={() => changeState('good')}> 긍정 </ReviewsButton>
            <ReviewsButton onClick={() => changeState('bad')}> 부정 </ReviewsButton>
          </div>
          <PieChart style={{ width: "100%", display: "flex" }}>
            <canvas
              ref={chartRef}
              width={300}
              height={200}
              style={{ width: "300px", height: "200px" }}
            />
          </PieChart>
        </ProductDetails>
      </ProductInfoContainer>
      <ReviewContainer>
        <h1>** {selectedLabel} 리뷰 내용 **</h1>
        <table>
          <thead>
            <tr>
              <th className='title'>제목</th>
              <th className='content'>내용</th>
              <th className='name'>이름</th>
              <th className="good-bad">긍·부정</th>
              <th className="date">날짜</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={`${state}-${review.review_num}`}>
                <td>{review.title}</td>
                <td style={{ width: "50%" }}>{review.content}</td>
                <td>{review.user_name}</td>
                <td style={{ color: review.good_or_bad == 1 ? 'green' : 'red' }}>
                  {review.good_or_bad == 1 ? '긍정' : review.good_or_bad == 0 ? '부정':'분석X'}
                </td>
                <td>{review.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CustomPaginationContainer>
          <Pagination
            style={CustomPaginationStyled}
            activePage={currentPage}
            itemsCountPerPage={10}
            totalItemsCount={Number(total)}
            pageRangeDisplayed={10}
            prevPageText={"<"}
            nextPageText={">"}
            onChange={handlePageChange}
          />
        </CustomPaginationContainer>
      </ReviewContainer>
    </Container>
  );
};

export default ProductDetail;