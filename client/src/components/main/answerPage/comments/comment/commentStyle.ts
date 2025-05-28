import { styled } from "@mui/system";
import {Typography, Button, Box} from "@mui/material";

export const CommentContainer = styled('div')({
    marginTop: '16px',
    padding: '8px',
    borderLeft: '4px solid #f0f0f0',
    display: 'flex',
    alignItems: 'flex-start',
});

export const CommentText = styled(Typography)({
    marginBottom: '8px',
});

export const CommentContent = styled(Box)({
    marginLeft: '16px',
    width: '100%',
});

export const MetaText = styled(Typography)({
    color: '#6a737c', // Lighter text color for metadata
});

export const DeleteButton = styled(Button)({
    border: "white",
});
