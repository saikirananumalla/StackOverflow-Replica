import { StyledTitle, StyledAppBar, StyledButton, StyledToolbar } from "./headerViewStyle";
import { VoidFunctionType } from "../../../../types/functionTypes";
import { Typography } from "@mui/material";

/**
 * Props for the AnswerHeader component.
 */
interface AnswerHeaderProps {
    ansCount: number;
    title: string;
    handleNewQuestion: VoidFunctionType;
}

/**
 * AnswerHeader component renders the top bar of the answer page.
 * Displays the number of answers, the question title, and a button to post a new question.
 *
 * @param {AnswerHeaderProps} props - Contains the number of answers, question title, and handler for creating a new question.
 * @returns {JSX.Element} The rendered header bar for the answer page.
 */
const AnswerHeader = ({
                          ansCount, title, handleNewQuestion,
                      }: AnswerHeaderProps): JSX.Element => {

    return (
        <StyledAppBar position="static">
            <StyledToolbar>
                <Typography variant="h6">Answers: {ansCount}</Typography>
                <StyledTitle>{title}</StyledTitle>
                <StyledButton variant="contained" onClick={handleNewQuestion}>
                    Ask a Question
                </StyledButton>
            </StyledToolbar>
        </StyledAppBar>
    );
};

export default AnswerHeader;
