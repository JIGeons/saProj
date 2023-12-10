import React, { useState } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
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

function ExcelButton(props) {
    const { title, onClink } = props;

    return <StyledButton onClick={onClink}>{title || "엑셀 저장"}</StyledButton>;
}

export default ExcelButton;