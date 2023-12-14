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
const ProductInfoContainer = styled.div`
  display: flex;
  padding: 10px;
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
  padding: 5px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin: auto;
  margin-right: 3%;
`;

const ReviewsCount = styled.div`
  margin-top: 10px;
  width: 30%;
  padding: 10px;
  border: none;
  font-size: 16px;
  margin: auto;
  margin-right: 3%;
`;

const ModifyButton = styled.button`
  background-color: ${({ isSave }) => (isSave ? '#ca3819' : '#007bff')};
  margin-top: 10px;
  width: 80px;
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

const ReviewHeader =styled.div`
  width: 100%;
  display: flex;
  height: 50px;
  justify-content: space-between;
`

const SearchFilter = styled.div`
  display: flex;
  padding: 10px;
`

const Wave = styled.div`
  margin-left: 5px;
  margin-right: 5px;
`

const ExcelButton = styled.button`
  width: 80px;
  height: 35px;
  background-color: #28a745; /* Green background color */
  color: #fff; /* White text color */
  border: none;
  border-radius: 5px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838; /* Darker green on hover */
  }
`;

const CalenderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 2px;
  box-sizing: border-box;
`;

const ModifyContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProductDetail = () => {
  const params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [state, setState] = useState("all");

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [modify, setModify] = useState("normal")

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState("");
  const [effect, setEffect]= useState("False");

  const [search, setSearch] = useState(false);

  /* 추가한 부분 */
  const [selectedReviews, setSelectedReviews] = useState([]);

  /* DateInput 추가 부분 */
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const url = 'http://localhost:8000/posts/product_detail'

  /* 추가한 부분 */
  const handleCheckboxChange = (reviewId) => {
    setSelectedReviews((prevSelectedReviews) => {
      if (prevSelectedReviews.includes(reviewId)) {
        return prevSelectedReviews.filter((id) => id !== reviewId);
      } else {
        return [...prevSelectedReviews, reviewId];
      }
    });
  }

  /* 원형 그래프 만드는 함수 */
  const createChart = (totalCount, good, bad) => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const myChartRef = chartRef.current.getContext("2d");
    console.log("전체 : " + totalCount + ", 긍정 : "+ good+ ", 부정 : "+ bad);
    chartInstance.current = new Chart(myChartRef, {
      type: "pie",
      data: {
        labels: ["긍정 : " + good, "부정 : " + bad],
        datasets: [
          {
            data: [good/totalCount*100, bad/totalCount*100],
            backgroundColor: ["rgb(54,162,235)", "rgb(255,99,132)"],
          },
        ],
      },
      options: {
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const label =
              chartInstance.current.data.labels[elements[0].index];
          }
        },
      },
    });
  };

  /* 긍정부정 수정 버튼 */
  const handleEditButtonClick = async () => {
    if(modify === "normal") {
      setModify("modify");
    }
    else {
      if (selectedReviews.length > 0) {
        try {
          const response = await axios.post(
            "http://localhost:8000/posts/product_detail/edit_reviews/",
            {
              selectedReviews: selectedReviews,
              productId: productId,
            }).then((response)=> {
              setReviews(response.data.reviews);
            })
        } catch (error) {
          console.error('Error', error.message);
        }
        setSelectedReviews([]);
        setModify('normal');
      } else {
        alert("수정할 리뷰를 선택해주세요.");
      }
    }
  };
  useEffect(() => {
    loadpage();
  }, []);

  const loadpage = async () => {
    await axios
      .get(`${url}/?prdid=${productId}`,{
        headers: {'Authorization': `Token ${localStorage.getItem('authToken')}`}
      })
      .then((response) => {
        setProduct(response.data.product);
        setReviews(response.data.review_page);
        setTotal(Number(response.data.product.count));

        createChart(response.data.product.count, response.data.product.good, response.data.product.bad);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 오류 발생: ", error);
      })
      .finally(() => {
        setEffect(true);
      });
  };

  useEffect(() => {
    if(effect){
      paging();
    }
  }, [state, currentPage, modify, search])

  const paging = async () => {
    try {
      console.log('이펙트'+currentPage);
      await axios.get(`${url}/paging/?prdid=${productId}&page=${currentPage}&state=${state}&start=${startDate}&end=${endDate}&search=${search}`)
      .then((response) => {
        setTotal(Number(response.data.total));
        setReviews(response.data.reviews);
        let total = response.data.count;
        let good = response.data.good;
        let bad = response.data.bad;

        createChart(total, good, bad)
      })
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const changeState = (value) => {
    setState(value);
    setCurrentPage(1);
    setStartDate("");
    setEndDate("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateFilter = () => {
    paging();
  };

  const handleReviewDownload = () => {
    try {
      const response = axios.post(`http://localhost:8000/posts/exceldownload/`, {
        start: startDate,
        end: endDate,
        download: [productId]
      }, {
        responseType: 'arraybuffer', // 응답 형식을 blob으로 설정
      }).then((response) => {
        // Blob 데이터를 파일로 만들어 다운로드
        const blob = new Blob([response.data],  { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = '드시모네_리뷰_데이터.xlsx';
        downloadLink.click();
        window.URL.revokeObjectURL(downloadLink.href);
      });
    } catch(error) {
      console.error('파일 다운로드 오류: ', error);
    } finally {
      // 선택한 날짜 범위에 따라 리뷰 다운로드를 위한 로직을 구현하세요.
      console.log("선택한 날짜 범위에서 리뷰 다운로드 중", startDate, "부터", endDate, "까지");
      // 모달과 날짜 범위 초기화
    }
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
            <ReviewsButton onClick={() => {setSearch(false); changeState('all');}}> 전체 <br /> {product.count === 0 ? '' : product.count} </ReviewsButton>
            <ReviewsButton onClick={() => {setSearch(false); changeState('good');}}> 
              긍정{product.count === 0 ? '' : ' : ' + parseInt(product.good / product.count * 100)+'%'}<br /> {product.count === 0 ? '' : product.good} 
            </ReviewsButton>
            <ReviewsButton onClick={() => {setSearch(false); changeState('bad');}}> 
              부정{product.count === 0 ? '' : ' : ' + parseInt(product.bad / product.count * 100) + '%'}<br /> {product.count === 0 ? '' : product.bad} 
            </ReviewsButton>
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
        <h1>리뷰 내용</h1>
        <ReviewHeader>
          <SearchFilter>
            <>
            <CalenderContainer>
              <DateInput
                type="date"
                value={startDate}
                onChange={(e) => {setStartDate(e.target.value);}}
                placeholder="시작 날짜"
              />
            </CalenderContainer>
            <Wave>~</Wave>
            <CalenderContainer>
              <DateInput
                type="date"
                value={endDate}
                onChange={(e) => {setEndDate(e.target.value); }}
                placeholder="종료 날짜"
              />
            </CalenderContainer>
              <Wave>
                <input type='button' value={'조회'} onClick={() => {setSearch(true); paging();}} />
              </Wave>
              <Wave>
                <ExcelButton onClick={() => {handleReviewDownload()}}>엑셀 저장</ExcelButton>
              </Wave>
            </>
          </SearchFilter>
          <ModifyContainer></ModifyContainer>
          <ModifyContainer>
            <ModifyButton isSave={modify !== 'normal'} onClick={() => handleEditButtonClick()}> {modify === 'normal' ? '수정' : '저장'} </ModifyButton>
          </ModifyContainer>
        </ReviewHeader>
        
        {  modify === "normal" &&
          <table>
            <thead>
              <tr>
                <th className='review-num'>리뷰 번호</th>
                <th className='title'>제목</th>
                <th className='content'>내용</th>
                <th className='name'>이름</th>
                <th className="good-bad">긍·부정</th>
                <th className="date">날짜</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={`${state}-${review.id}`}>
                  <td>{review.review_num}</td>
                  <td>{review.title}</td>
                  <td style={{ width: "50%" }}>{review.content}</td>
                  <td>{review.user_name}</td>
                  <td style={{ color: review.good_or_bad == 1 ? 'green' : review.good_or_bad === '0' ? 'red' : 'gray' }}>
                    {review.good_or_bad === '1' ? '긍정' : review.good_or_bad === '0' ? '부정' : '분석 X'}
                  </td>
                  <td>{review.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        {  modify === "modify" &&
          <table>
            <thead>
              <tr>
                <th className='review-num'>리뷰 번호</th>
                <th className='title'>제목</th>
                <th className='content'>내용</th>
                <th className='name'>이름</th>
                <th className="good-bad">긍·부정</th>
                <th className="date">날짜</th>
                <th className='modify'>수정</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={`${state}-${review.id}`}>
                  <td>{review.review_num}</td>
                  <td>{review.title}</td>
                  <td style={{ width: "50%" }}>{review.content}</td>
                  <td>{review.user_name}</td>
                  <td style={{ color: review.good_or_bad == 1 ? 'green' : 'red' }}>
                    {review.good_or_bad === '1' ? '긍정' : '부정'}
                  </td>
                  <td>{review.date}</td>
                  <td>
                    <input type='checkbox' checked={selectedReviews.includes(review.review_num)} onChange={() => handleCheckboxChange(review.review_num)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
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