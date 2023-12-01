import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const url = 'http://localhost:8000/users'

const AdminPage = () => {
  const [Admin, setAdmin] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApprovalUserId, setSelectedApprovalUserId] = useState(null);
  const [selectedToggleAdminUserId, setSelectedToggleAdminUserId] = useState(null);

  const params = useParams();
  const userid = params.id

  // 초기 users 불러오기
  useEffect(()=>{
    axios
    .get(`${url}/getUsers/?id=${userid}&page=${currentPage}`)
    .then((response) =>{
      setAdmin(response.data.admin);
      setUsers(response.data.users);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    })

  }, [])

  // currentPage 변경시 users 불러오기
  useEffect(() => {
    fetchUsers();
  }, [currentPage]); // id도 의존성에 추가

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/getUsers/page=${currentPage}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching user list:', error.message);
    }
  };

  // 다음 페이지로 이동
  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // 이전 페이지로 이동
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // 승인 또는 거절 처리
  const handleApproval = async (userId, status) => {
    setSelectedApprovalUserId(userId);
    setSelectedToggleAdminUserId(null);
    // 데이터만 업데이트하고 저장 버튼 클릭 시 서버에 전송
  };

  // 관리자 권한 전환 처리
  const handleAdminToggle = async (userId) => {
    setSelectedToggleAdminUserId(userId);
    setSelectedApprovalUserId(null);
    // 데이터만 업데이트하고 저장 버튼 클릭 시 서버에 전송
  };

  // 저장 버튼 클릭 시 서버에 변경 내용 전송
  const handleSave = async () => {
    if (selectedApprovalUserId !== null) {
      // 승인 또는 거절 처리하는 API 호출
      await axios.post(`/api/admin/approve/${selectedApprovalUserId}/`, { status: 1 });
    } else if (selectedToggleAdminUserId !== null) {
      // 관리자 권한 전환 API 호출
      await axios.post(`/api/admin/toggle-admin/${selectedToggleAdminUserId}/`);
    }
    // 데이터 다시 불러오기
    fetchUsers();
    // 클릭된 상태 초기화
    setSelectedApprovalUserId(null);
    setSelectedToggleAdminUserId(null);
  };

  return (
    <div>
      <h1>{Admin} 관계자 페이지</h1>
      {/* 유저 정보를 표시하는 테이블 */}
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.userid}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.status === 0 && '승인 대기'}
                {user.status === 1 && '승인 완료'}
                {user.status === 2 && '승인 거절'}
              </td>
              <td>
                {user.status === 0 && (
                  <>
                    <button
                      onClick={() => handleApproval(user.id, 1)}
                      disabled={selectedToggleAdminUserId !== null || selectedApprovalUserId === user.id}
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleApproval(user.id, 2)}
                      disabled={selectedToggleAdminUserId !== null || selectedApprovalUserId === user.id}
                    >
                      거절
                    </button>
                  </>
                )}
                {user.status === 1 && (
                  <button
                    onClick={() => handleAdminToggle(user.id)}
                    disabled={selectedApprovalUserId !== null || selectedToggleAdminUserId === user.id}
                  >
                    Toggle Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 저장 버튼 */}
      <button onClick={handleSave} disabled={selectedApprovalUserId === null && selectedToggleAdminUserId === null}>
        Save Changes
      </button>
      {/* 페이지 네이션 */}
      <div>
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        {[...Array(10)].map((_, index) => (
          <button key={index} onClick={() => setCurrentPage(index + 1)} disabled={currentPage === index + 1}>
            {index + 1}
          </button>
        ))}
        <button onClick={goToNextPage}>Next</button>
      </div>
    </div>
  );
};

export default AdminPage;