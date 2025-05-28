import styled from "styled-components";

export const TagPageContainer = styled.div`
    margin-top: 80px;
    display: flex;
    flex-direction: column;
`;

export const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
`;

export const TagList = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
`;

export const PageHeaderText = styled.h5`
    font-family: Arial, sans-serif;
    font-weight: bold;
    margin: 0;
`;
