import React, { useState } from 'react';
import styled from 'styled-components';

const statebutton = styled.button`
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

const StateButton = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleButtonClick = () => {
    setIsClicked(!isClicked); // 클릭 상태를 토글
  };

  return (
      <statebutton onClick={handleButtonClick}>
        {isClicked ? 'Clicked!' : 'Click me'}
      </statebutton>
  );
};

export default StateButton;
