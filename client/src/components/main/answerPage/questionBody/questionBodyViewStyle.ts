import { styled } from "@mui/system";
import { Button, Typography } from "@mui/material";

export const QuestionContainer = styled("div")({
    padding: "16px",
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "white",

});

export const QuestionContent = styled("div")({
    marginLeft: "16px",
    width: "100%",
    alignItems: "center",
});

export const QuestionText = styled(Typography)({
    marginBottom: "8px",
});

export const MetaText = styled(Typography)({
    color: "#6a737c",
    marginRight: "20px"// Lighter text color for metadata
});

export const AddCommentButton = styled(Button)({
    background: "black",
    fontSize: "xx-small",
});

export const DeleteButton = styled(Button)({
    border: "white",
});
