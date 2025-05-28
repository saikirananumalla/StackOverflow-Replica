import React from "react";
import { Box, Divider } from "@mui/material";
import VoteButtons from "../../voteButtons/voteButton";
import {
    CommentContainer,
    CommentContent,
    CommentText,
    MetaText,
    DeleteButton
} from "./commentStyle";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    DeleteCommentFunctionType,
    StringFunctionType
} from "../../../../../types/functionTypes";
import { getMetaData, handleHyperlink } from "../../../../../utils";

/**
 * Props for the Comment component.
 */
interface CommentProps {
    text: string;
    author: string;
    date: string;
    cid: string;
    csrfToken: string;
    votes: number;
    qid: string;
    mod: string;
    parentId: string;
    parentType: string;
    handleDeleteComment: DeleteCommentFunctionType;
    handleError: StringFunctionType;
}

/**
 * Comment component displays a single comment with voting and optional deletion.
 *
 * @param {CommentProps} props - The props required to render and manage a comment.
 * @returns {JSX.Element} A rendered comment block with metadata and delete functionality for moderators.
 */
const Comment = ({
                     text, author, date,
                     cid, csrfToken, votes,
                     qid, mod, parentId,
                     parentType, handleDeleteComment, handleError
                 }: CommentProps): JSX.Element => {
    return (
        <CommentContainer>
            <VoteButtons
                parentId={cid}
                parentType="comment"
                csrfToken={csrfToken}
                numberOfVotes={votes}
                handleError={handleError}
            />
            <CommentContent className="commentBody">
                <CommentText variant="body2">{handleHyperlink(text)}</CommentText>
                <Box display="flex" alignItems="center">
                    <MetaText variant="body2">
                        <strong>Comment By:</strong> {author}
                    </MetaText>
                    <MetaText variant="body2" sx={{ marginLeft: 'auto' }}>
                        <strong>Commented:</strong> {getMetaData(new Date(date))}
                    </MetaText>
                    {mod && (
                        <DeleteButton
                            variant="outlined"
                            size="small"
                            onClick={() =>
                                handleDeleteComment(qid, parentId, parentType, cid, csrfToken)
                            }
                            className="deleteCommentButton"
                        >
                            <DeleteIcon />
                        </DeleteButton>
                    )}
                </Box>
            </CommentContent>
            <Divider />
        </CommentContainer>
    );
};

export default Comment;
