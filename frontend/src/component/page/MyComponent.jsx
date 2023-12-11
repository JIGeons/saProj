import React from 'react';

const MyComponent = () => {
  const handleDownload = () => {
    // 가상의 데이터 생성
    const data = 'Name,Age,City\nJohn,28,New York\nJane,24,San Francisco\nDoe,32,Seattle';

    // Blob 객체 생성
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // 파일 저장 대화 상자 열기
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'my_excel_file.xlsx';
    link.click();
  };

  return (
    <>
        <button onClick={handleDownload}>Download Excel</button>
    </>
  );
};

export default MyComponent;