import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    padding: 8px 16px;
    font-size: 16px;
    border-width: 1px;
    border-radius: 8px;
    cursor: pointer;
    height: 80px;
`;

function LoginButton(props) {
    const { title, onClink } = props;

    return <StyledButton onClick={onClink}>{title || "button"}</StyledButton>;
}

export default LoginButton;