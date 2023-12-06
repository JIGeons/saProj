import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import styled, { keyframes } from 'styled-components';

import CustomPaginationContainer from '../ui/CustompagContainer';
import CustomPaginationStyled from '../ui/CustomPagination';

const url = 'http://localhost:8000/users';

// fadeIn 키프레임 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// 컨테이너 스타일 정의
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

// 헤더 스타일 정의
const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

// 탭 버튼 스타일 정의
const TabButton = styled.button`
  margin: 0 10px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  background-color: lightgray;
  border: none;
  border-radius: 4px;
`;

// 테이블 스타일 정의
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

// 테이블 헤더 스타일 정의
const Th = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  text-align: center;
`;

// 테이블 데이터 스타일 정의
const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
`;

// 라디오 및 체크박스 스타일 정의
const RadioCheckbox = styled.input`
  margin: 0 5px;
`;

// 저장 버튼 스타일 정의
const SaveButton = styled.button`
  margin: 10px 0;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: green;
  color: white;
  border: none;
  border-radius: 4px;
`;

// 페이지네이션 컨테이너 스타일 정의
const PaginationContainer = styled.div`
  margin-top: 20px;
`;

const AdminPage = () => {
  const [admin, setAdmin] = useState("");
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState("");
  const [state, setState] = useState("approve");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApprovalUserId, setSelectedApprovalUserId] = useState(null);
  const [selectedToggleAdminUserId, setSelectedToggleAdminUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("approval"); // "approval" 또는 "management"

  const [selectedRows, setSelectedRows] = useState([]);

  const params = useParams();
  const userid = params.id;

  // 초기 users 불러오기
  useEffect(() => {
    fetchUsers();
    setSelectedRows([]);
  }, [state, currentPage]); // id도 의존성에 추가

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/getUsers/?id=${userid}&page=${currentPage}&state=${state}&page=${currentPage}`);
      setAdmin(response.data.admin);
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching user list:', error.message);
    }
  };

  const save = async (updateData) => {
    try {
      const update = await axios.post(`${url}/save/`,{
        id: userid,
        page: currentPage,
        state: state,
        update: updateData
      }).then((response) => {
        setAdmin(response.data.admin);
        setUsers(response.data.users);
        setTotal(response.data.total);
      })
    } catch (error) {
      console.error('Error fetching user list:', error.message);
    }

    setSelectedRows([]);  // update 완료 후 변경 내용 초기화
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab) => {
    setState(tab);
  };

  const updateUserStatus = (userId, status) => {
    const user = {userId : userId, status: status};

    if(selectedRows.filter(user => user.userId == userId).length === 0) {
      setSelectedRows([...selectedRows, user]);
    } else {
      setSelectedRows([...(selectedRows.filter(user => user.userId !== userId)), user]);
    }
  };

  const updateUserAdmin = (userId, admin) => {
    const user = {userId : userId, admin: admin};

    console.log(selectedRows)
    if(selectedRows.filter(user => user.userId === userId).length == 0) {
      setSelectedRows([...selectedRows, user]);
    } else {
      setSelectedRows(selectedRows.filter(user => user.userId !== userId));
    }
  };

  const uncheckRadio = () => {
    const radioButtons = document.querySelectorAll('input[type="radio"]:checked');
  
    radioButtons.forEach(radio => {
      radio.checked = false;
    });
  };

  return (
    <Container>
      <Header>{admin} 관계자 페이지</Header>
      {/* 탭 선택 */}
      <div>
        <TabButton onClick={() => handleTabChange('approve')}>승인 요청 탭</TabButton>
        <TabButton onClick={() => handleTabChange('user')}>유저 관리 탭</TabButton>
      </div>
      {/* 유저 정보를 표시하는 테이블 */}
      {state === 'approve' && (
        <Table>
          <thead>
            <tr>
              <Th>No</Th>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th>승인</Th>
              <Th>거절</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <Td>{index + 1}</Td>
                <Td>{user.userid}</Td>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  {user.status === 0 && '승인 대기'}
                  {user.status === 1 && '승인 완료'}
                  {user.status === 2 && '승인 거절'}
                </Td>
                <Td>
                  <RadioCheckbox
                    type="radio"
                    name={`user-${index}`}
                    onChange={() => updateUserStatus(user.userid, user.status + 1)}
                  />
                </Td>
                <Td>
                  <RadioCheckbox
                    type="radio"
                    name={`user-${index}`}
                    onChange={() => updateUserStatus(user.userid, user.status + 2)}
                  />
                </Td>
              </tr>
            ))}
            <tr>
              <Td colSpan={7} style={{ textAlign: 'right' }}>
                <SaveButton type="button" onClick={() => { save(selectedRows); uncheckRadio(); }}>
                  저장
                </SaveButton>
              </Td>
            </tr>
          </tbody>
        </Table>
      )}

      {/* 사용자 관리 테이블 */}
      {state === 'user' && (
        <Table>
          <thead>
            <tr>
              <Th>No</Th>
              <Th>아이디</Th>
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th>상태</Th>
              <Th>관리자 전환</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <Td>{index + 1}</Td>
                <Td>{user.userid}</Td>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.is_admin === 0 ? '일반 사용자' : '관리자'}</Td>
                <Td>
                  {user.is_admin === 0 && (
                    <RadioCheckbox
                      type="checkbox"
                      name={`user-${index}`}
                      onClick={() => updateUserAdmin(user.userid, 1)}
                    />
                  )}
                </Td>
              </tr>
            ))}
            <tr>
              <Td colSpan={6} style={{ textAlign: 'right' }}>
                <SaveButton type="button" onClick={() => { save(selectedRows); }}>
                  저장
                </SaveButton>
              </Td>
            </tr>
          </tbody>
        </Table>
      )}

      {/* 페이지네이션 */}
      <PaginationContainer>
        <Pagination
          style={CustomPaginationStyled}
          activePage={currentPage}
          itemsCountPerPage={10}
          totalItemsCount={Number(total)}
          pageRangeDisplayed={10}
          prevPageText={'<'}
          nextPageText={'>'}
          onChange={handlePageChange}
        />
      </PaginationContainer>
    </Container>
  );
};

export default AdminPage;
