import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Logo = () => {
    return (
        <Wrapper>
            <Link to="/">
                <img src="/logo2.PNG" alt="Hunter logo" className="bg-transparent pl-4" />
            </Link>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    max-width: 130px;
    @media screen and (max-width: 600px) {
        max-width: 100px;
    }
    a {
        text-decoration: none;
    }
    img {
        width: 100%;
        object-fit: cover;
    }
`;

export default Logo;
