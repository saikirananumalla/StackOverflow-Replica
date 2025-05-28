import React from "react";
import { Box, Divider } from "@mui/material";
import { handleHyperlink } from "../../../../utils";
import VoteButtons from "../voteButtons/voteButton";
import Comments, { CommentType } from "../comments/comments";
import {
    AnswerContainer,
    AnswerContent,
    AnswerText,
    MetaText,
    AddCommentButton,
    DeleteButton
} from "./answerViewStyle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    CommentFunctionType,
    DeleteAnswerFunctionType,
    DeleteCommentFunctionType,
    StringFunctionType
} from "../../../../types/functionTypes";

/**
 * Props for the Answer component.
 */
interface AnswerViewProps {
    aid: string;
    qid: string;
    text: string;
    ansBy: string;
    meta: string;
    comments: CommentType[];
    csrfToken: string;
    handleComment: CommentFunctionType;
    votes: number;
    mod: string;
    handleDeleteAnswer: DeleteAnswerFunctionType;
    handleDeleteComment: DeleteCommentFunctionType;
    handleError: StringFunctionType;
}

/**
 * Answer component renders a single answer with voting, metadata, and comment functionality.
 *
 * @param {AnswerViewProps} props - All props required to display and manage an answer.
 * @returns {JSX.Element} A rendered answer block with vote buttons, comments, and delete options for moderators.
 */
const Answer = ({
                    qid, text, ansBy,
                    meta, comments, aid,
                    votes, csrfToken, handleComment,
                    mod, handleDeleteAnswer, handleDeleteComment, handleError
                }: AnswerViewProps): JSX.Element => {

    return (
        <AnswerContainer>
            <VoteButtons
                parentId={aid}
                parentType="answer"
                csrfToken={csrfToken}
                numberOfVotes={votes}
                handleError={handleError}
            />
            <AnswerContent>
                <AnswerText variant="body1" className="answerText">
                    {handleHyperlink(text)}
                </AnswerText>

                <Box display="flex" alignItems="center">
                    <MetaText variant="body2">
                        <strong>Answered By:</strong> {ansBy}
                    </MetaText>
                    <MetaText variant="body2" sx={{ marginLeft: 'auto' }}>
                        <strong>Answered:</strong> {meta}
                    </MetaText>

                    {mod && (
                        <DeleteButton
                            variant="outlined"
                            size="small"
                            onClick={() => handleDeleteAnswer(qid, aid, csrfToken)}
                            className="deleteAnswerButton"
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
                        parentId={aid}
                        parentType="answer"
                        handleDeleteComment={handleDeleteComment}
                        handleError={handleError}
                    />
                )}

                <AddCommentButton
                    variant="contained"
                    onClick={() => handleComment(aid, qid, "answer")}
                    className="addCommentAnswerButton"
                >
                    Add Comment
                </AddCommentButton>
            </AnswerContent>
        </AnswerContainer>
    );
};

export default Answer;
