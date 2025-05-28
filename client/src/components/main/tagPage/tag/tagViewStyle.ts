import styled from "styled-components";
import {Button} from "@mui/material";

export const TagNode = styled.div`
                       place-self: center;
border: 1px solid #ccc;
padding: 10px;
width: 200px;
display: flex;
flex-direction: column;
justify-items: center;
align-items: center;
cursor: pointer;
transition: background-color 0.3s ease;

&:hover {
    background-color: #f5f5f5;
}
`;

export const TagName = styled.div`
                       color: cornflowerblue;
font-weight: bold;
`;

export const AskButton = styled(Button)`
    margin-left: 10px;
    margin-top: 40px;
    background-color: black;
    color: white;
`;