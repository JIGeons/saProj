import React from "react";
import styled from "styled-components";

const Foot = styled.p`
    font-size: 15px;
    line-height: 32px;
    white-space: pre-wrap;
    text-align: center;
`;

const Footer = () => {
    return (
        <footer>
            <hr/>
            <Foot>SA Project</Foot>
        </footer>
    );
}

export default Footer;