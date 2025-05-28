import styled from "styled-components";
import {Button} from "@mui/material";

export const QuestionContainer = styled.div`
    display: flex;
    flex-direction: row;
    border-top: 1px solid #ccc;
    padding: 20px 0;
`;

export const PostStats = styled.div`
    color: #bbbbbb;
    text-align: center;
    width: 10%;
`;

export const QuestionMid = styled.div`
    width: 60%;
`;

export const PostTitle = styled.div`
    color: cornflowerblue;
    font-weight: bold;
`;

export const QuestionTags = styled.div`
    margin-top: 10px;
`;

export const QuestionTagButton = styled(Button)`
    text-transform: lowercase;
    color: black;
    background: lightskyblue;
    border-radius: 10px;
    margin-left: 10px;
`;

export const LastActivity = styled.div`
    width: 30%;
    display: flex;
    flex-direction: row;
`;

export const QuestionAuthor = styled.div`
    color: grey;
`;

export const QuestionMeta = styled.div`
    color: #bbbbbb;
`;
