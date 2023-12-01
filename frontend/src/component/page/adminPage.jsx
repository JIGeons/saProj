// src/components/AdminPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'http://localhost:8000/users';

const AdminPage = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Add currentPage state
  const PAGE_SIZE = 10; // Add PAGE_SIZE constant

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(async() => {
    await axios.get(`${url}/getUsers/?page=${currentPage}&page_size=${PAGE_SIZE}`)
    .then((response) => {
        setUsername(response.data.username);
        setUsers(response.data.users);
    })
    .catch((error) => {
        console.error("Error fetching data: ", error);
    });
  }, [])

  return (
    <div>
      <h1>{username} 님의 관리자 페이지</h1>
      <table>
        <thead>
          <tr>
            <th>연번</th>
            <th>UserID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>승인 상태</th>
            <th>승인 확인</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1 + (currentPage - 1) * PAGE_SIZE}</td>
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
                    <button>승인</button>
                    <button>거절</button>
                  </>
                )}
                {user.status === 1 && '승인 완료'}
                {user.status === 2 && '승인 거절'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          이전 페이지
        </button>
        <span>{currentPage}</span>
        <button disabled={users.length < PAGE_SIZE} onClick={() => handlePageChange(currentPage + 1)}>
          다음 페이지
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
