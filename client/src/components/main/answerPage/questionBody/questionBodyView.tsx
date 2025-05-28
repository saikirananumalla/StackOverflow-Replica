import { Box, Divider, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {
    QuestionContainer,
    QuestionContent,
    AddCommentButton,
    DeleteButton,
    MetaText
} from "./questionBodyViewStyle";
import { handleHyperlink } from "../../../../utils";
import VoteButtons from "../voteButtons/voteButton";
import Comments, { CommentType } from "../comments/comments";
import {
    CommentFunctionType,
    DeleteCommentFunctionType,
    DeleteQuestionFunctionType,
    StringFunctionType
} from "../../../../types/functionTypes";
import { useQuestionBodyView } from "../../../../hooks/useQuestionBodyView";

/**
 * Props for the QuestionBody component.
 */
interface QuestionBodyViewProps {
    qid: string;
    views: number;
    text: string;
    askBy: string;
    meta: string;
    comments: CommentType[];
    csrfToken: string;
    handleComment: CommentFunctionType;
    votes: number;
    mod: string;
    handleDeleteQuestion: DeleteQuestionFunctionType;
    handleDeleteComment: DeleteCommentFunctionType;
    handleError: StringFunctionType;
}

/**
 * QuestionBody component displays the full body of a question,
 * including text, metadata, vote buttons, comments, and a delete option for moderators.
 *
 * @param {QuestionBodyViewProps} props - The props needed to display and manage the question body view.
 * @returns {JSX.Element} A rendered question body block with vote and comment sections.
 */
const QuestionBody = ({
                          qid, views, text,
                          askBy, meta, comments,
                          csrfToken, handleComment, votes,
                          mod, handleDeleteQuestion, handleDeleteComment, handleError
                      }: QuestionBodyViewProps): JSX.Element => {

    const { votesLoaded } = useQuestionBodyView(votes);

    return (
        <QuestionContainer>
            <Box display="flex" alignItems="flex-start">
                {votesLoaded && (
                    <VoteButtons
                        parentId={qid}
                        parentType="question"
                        csrfToken={csrfToken}
                        numberOfVotes={votes}
                        handleError={handleError}
                    />
                )}
                <QuestionContent>
                    <Box>
                        <Typography variant="body2" gutterBottom>
                            <strong>Views:</strong> {views}
                        </Typography>
                        <Typography variant="body2" gutterBottom id="questionBody">
                            <strong>{handleHyperlink(text)}</strong>
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <MetaText variant="body2">
                            <strong>Asked By:</strong> {askBy}
                        </MetaText>
                        <MetaText variant="body2" sx={{ marginLeft: 'auto' }}>
                            <strong>Asked:</strong> {meta}
                        </MetaText>
                        {mod && (
                            <DeleteButton
                                variant="outlined"
                                size="small"
                                onClick={() => handleDeleteQuestion(qid, csrfToken)}
                                className="deleteQuestionButton"
                            >
                                <DeleteIcon />
                            </DeleteButton>
                        )}
                    </Box>
                    <Divider />
                    {comments && comments.length > 0 && (
                        <Comments
                            comments={comments}
                            csrfToken={csrfToken}
                            mod={mod}
                            qid={qid}
                            parentId={qid}
                            parentType="question"
                            handleDeleteComment={handleDeleteComment}
                            handleError={handleError}
                        />
                    )}
                    <AddCommentButton
                        variant="contained"
                        onClick={() => handleComment(qid, qid, "question")}
                        className="addCommentQuestionButton"
                    >
                        Add Comment
                    </AddCommentButton>
                </QuestionContent>
            </Box>
        </QuestionContainer>
    );
};

export default QuestionBody;
