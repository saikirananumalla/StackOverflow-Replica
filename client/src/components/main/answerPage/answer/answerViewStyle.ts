import { styled } from "@mui/system";
import { Button, Typography, Box } from "@mui/material";

export const AnswerContainer = styled('div')({
    marginTop: '16px',
    padding: '16px',
    borderLeft: '4px solid #f0f0f0',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    alignItems: 'flex-start',
});

export const AnswerContent = styled(Box)({
    marginLeft: '16px',
    width: '100%',
    alignItems: 'center',
});

export const AnswerText = styled(Typography)({
    marginBottom: '8px',
});

export const MetaText = styled(Typography)({
    color: '#6a737c',
});

export const AddCommentButton = styled(Button)({
    background: "black",
    fontSize: "xx-small",
});

export const DeleteButton = styled(Button)({
    border: "white",
});
