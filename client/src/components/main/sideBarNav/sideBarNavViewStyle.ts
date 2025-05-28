import styled from "styled-components";

export const SideBarNavContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 200px;
    padding: 20px;
    border-radius: 10px;
    margin-top: 40px;
`;

export const MenuButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 100%;
    margin-top: 20px;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
    color: #333;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #e9ecef;
    }
`;
