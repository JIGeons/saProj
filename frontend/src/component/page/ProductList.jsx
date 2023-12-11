import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  display: ${({ showReviewModal }) => (showReviewModal ? "flex" : "none")};
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
  width: 50%;
  text-align: center;
  max-height: 85vh; /* 최대 높이를 설정하여 화면 크기에 따라 조절 */
`;

const ReviewProductContainer = styled.div`
  width: 100%; /* 100%로 변경 */
  max-height: 40vh; /* ProductContainer에 스크롤을 적용할 최대 높이 설정 */
  overflow-y: auto; /* 스크롤이 필요한 경우만 표시 */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const FlexContainer = styled.div`
  display: flex;
`;

const ColumnFlexContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const CheckboxContainer = styled.div`
  width: 20%;
  height: 200%;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  text-align: left;
  border: 1px solid #ced4da;
  border-radius: 10px;
  padding-bottom: 10px;
`;

const PeriodDiv = styled.div`
  margin-left: 10px;
  text-align: left;
  margin-top: 10px;
`;

const ReviewProduct = styled.div`
  display: flex;
  width: calc(33.33% - 20px);
  text-align: center;
  margin-top: 3px;
  position: relative;
`;

const ReviewModalTitle = styled.h2`
  margin-bottom: 20px;
`;

const ReviewModalInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ReviewDateInputLabel = styled.label`
  width: 20%;
  margin-right: 10px;
  font-size: 16px;
  color: #333;
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
  margin-top: 10px;

  &:hover {
    background-color: #218838; /* 마우스 호버 시 더 진한 초록색 */
  }
`;

const DownloadOptionsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const DownloadCheckbox = styled.input`
  margin-right: 5px;
`;

const ProductLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 50%;
`;

const ProductLabel = styled.label`
  font-size: 14px;
  color: #333;
`;

const ProductCheckbox = styled.input`
  margin-right: 5px;
`;

const handleMouseEnter = (productId) => {
  document.getElementById(`additionalInfo${productId}`).style.display = 'block';
};

const handleMouseLeave = (productId) => {
  document.getElementById(`additionalInfo${productId}`).style.display = 'none';
};

const ProductList = () => {
  const params = useParams();
  const user = params.id;
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStartDate, setReviewStartDate] = useState("");
  const [reviewEndDate, setReviewEndDate] = useState("");

  const [downloadAll, setDownloadAll] = useState("");
  const [downloadSelected, setDownloadSelected] = useState("");

  const [excelDownload, setExcelDownload] = useState([]);

  const [week, setWeek] = useState(false);
  const [month, setMonth] = useState(false);
  const [year, setYear] = useState(false);

  const url = 'http://localhost:8000/posts'

  useEffect(() => {
    axios.get(`${url}/product_list/`,{
      headers: {'Authorization': `Token ${localStorage.getItem('authToken')}`}
    })
      .then(response => {
        setProducts(response.data.products);
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
        sortedProducts.sort((a, b) => b.count  - a.count );
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

  const handleDownloadAllChange = () => {
    setDownloadAll(!downloadAll);
    setDownloadSelected(false);

    if(!downloadAll === true) {
      products.map(product => (
        setExcelDownload(items => [...items, product.id])
      ))
    }
    
  };

  const handleDownloadSelectedChange = () => {
    setDownloadSelected(!downloadSelected);
    setDownloadAll(false);
  };

  const handleProductCheckboxChange = (productId) => {
    // 추가된 부분: 상품 체크박스 변경 처리
    if (excelDownload.includes(productId)) {
      // 이미 선택된 경우 제거
      setExcelDownload(prevState => prevState.filter(id => id !== productId));
    } else {
      // 선택되지 않은 경우 추가
      setExcelDownload(prevState => [...prevState, productId]);
    }

    console.log(excelDownload)
  };

  const handleReviewDownload = () => {
    setIsLoading(true);
    
    try {
      const response = axios.post(`${url}/exceldownload/`, {
        start: reviewStartDate,
        end: reviewEndDate,
        download: excelDownload
      }, {
        responseType: 'blob', // 응답 형식을 blob으로 설정
      });

      // Blob 데이터를 파일로 만들어 다운로드
      const blob = new Blob([response.data],  { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = '드시모네_리뷰_데이터.xlsx';
      downloadLink.click();
    } catch(error) {
      console.error('파일 다운로드 오류: ', error);
    } finally {
      setIsLoading(false);
      // 선택한 날짜 범위에 따라 리뷰 다운로드를 위한 로직을 구현하세요.
      console.log("선택한 날짜 범위에서 리뷰 다운로드 중", reviewStartDate, "부터", reviewEndDate, "까지");
      // 모달과 날짜 범위 초기화
      setShowReviewModal(false);
      setReviewStartDate("");
      setReviewEndDate("");
      setExcelDownload([]);
      setDownloadAll(false);
      setDownloadSelected(false);
      setWeek(false);
      setMonth(false);
      setYear(false);
    }
  };

  const handleCheckboxChange = (e, date) => {
    const isChecked = e.target.checked;
    let startDate;

    if (date === 'week') {
      setWeek(!week)
        // week를 제외한 나머지 체크박스 false
        setMonth(false)
        setYear(false)
    } else if(date === 'month') {
      // month를 제외한 나머지 체크박스 false
      setWeek(false)
      setMonth(!month)
      setYear(false)
    } else if(date === 'year') {
        // year를 제외한 나머지 체크박스 false
        setWeek(false)
        setMonth(false)
        setYear(!year)
    }

    if (isChecked) {
      if (date === 'week'){
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
      } else if (date === 'month'){
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        startDate.setDate(startDate.getDate() + 1);
      } else if (date === 'year'){
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        startDate.setDate(startDate.getDate() + 1);
      }

      setReviewStartDate(startDate.toISOString().split('T')[0]);
      setReviewEndDate(new Date().toISOString().split('T')[0]);
    } else {
      setReviewStartDate('');
      setReviewEndDate('');
    }
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
                    <Link to={`/posts/productlist/productdetail/${product.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                        <ProductImage src={product.src} alt={product.name} />
                        
                        <div id={`additionalInfo${product.id}`} style={styles.additionalInfo}>
                          {/* Display additional information here */}
                          <p>** 리뷰 분석 **</p>
                          <p>총 리뷰 개수 : {product.count}</p>
                          <p>긍정 리뷰 개수 : {product.good}</p>
                          <p>부정 리뷰 개수 : {product.bad}</p>
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
              <FlexContainer>
                <ColumnFlexContainer>
                  <ReviewModalInputContainer>
                    <ReviewDateInputLabel>시작 날짜:</ReviewDateInputLabel>
                    <ReviewModalInput
                      type="date"
                      value={reviewStartDate}
                      onChange={(e) => setReviewStartDate(e.target.value)}
                      placeholder="시작 날짜"
                    />
                  </ReviewModalInputContainer>
                  <ReviewModalInputContainer>
                    <ReviewDateInputLabel>종료 날짜:</ReviewDateInputLabel>
                    <ReviewModalInput
                      type="date"
                      value={reviewEndDate}
                      onChange={(e) => setReviewEndDate(e.target.value)}
                      placeholder="종료 날짜"
                    />
                  </ReviewModalInputContainer>
                  </ColumnFlexContainer>
                  <CheckboxContainer>
                    <PeriodDiv>
                      <input
                        type="checkbox"
                        checked={week}
                        onChange={(e) => handleCheckboxChange(e, 'week')}
                      />
                      <label style={{marginLeft: '5px'}}>일주일</label>
                    </PeriodDiv>
                    <PeriodDiv>
                      <input
                        type="checkbox"
                        checked={month}
                        onChange={(e) => handleCheckboxChange(e, 'month')}
                      />
                      <label style={{marginLeft: '5px'}}>한달</label>
                    </PeriodDiv>
                    <PeriodDiv>
                      <input
                        type="checkbox"
                        checked={year}
                        onChange={(e) => handleCheckboxChange(e, 'year')}
                      />
                      <label style={{marginLeft: '5px'}}>일년</label>
                    </PeriodDiv>
                  </CheckboxContainer>
              </FlexContainer>
              <p style={{ color: 'blue' }}>※ 시작 날짜를 선택 안하면 전체 기간의 리뷰가 다운로드됩니다.</p>
              <DownloadOptionsContainer>
                <DownloadCheckbox
                  type="checkbox"
                  id="downloadAll"
                  checked={downloadAll}
                  onChange={() => handleDownloadAllChange()}
                />
                <label htmlFor="downloadAll">전체 상품 다운로드</label>
              </DownloadOptionsContainer>
              <DownloadOptionsContainer>
                <DownloadCheckbox
                  type="checkbox"
                  id="downloadSelected"
                  checked={downloadSelected}
                  onChange={handleDownloadSelectedChange}
                />
                <label htmlFor="downloadSelected">일부 상품 다운로드</label>
                {downloadSelected && (
                  <ReviewProductContainer>
                    {products.map(product => (
                      <ReviewProduct key={product.id}>
                        <ProductCheckbox
                          type="checkbox"
                          id={`productCheckbox${product.id}`}
                          onChange={() => handleProductCheckboxChange(product.id)}
                        />
                        <ProductLabelContainer>
                          <ProductLabel htmlFor={`productCheckbox${product.id}`}>{product.name}</ProductLabel>
                        </ProductLabelContainer>
                      </ReviewProduct>
                    ))}
                  </ReviewProductContainer>
                )}
              </DownloadOptionsContainer>
              <ReviewModalButton onClick={() => {handleReviewDownload()}}>
                다운로드
              </ReviewModalButton>
              <ReviewModalButton onClick={() => {setShowReviewModal(false); setExcelDownload([]);}}>
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