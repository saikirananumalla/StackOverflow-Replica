import styled from "styled-components";
import { AppBar, InputBase } from "@mui/material";

export const HeaderContainer = styled(AppBar)`
    && {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        height: 65px; 
        background: black;
        font-family: "Monaco",cursive;
    }
`;

export const Title = styled.div`
    font-size: 30px;
    font-weight: 800;
`;

export const SearchBar = styled(InputBase)`
    margin-left: auto;
    border-radius: 4px;
    background: #ffffff;
    width: 15%;
`;
