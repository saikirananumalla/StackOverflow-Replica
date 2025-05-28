import { Button } from "@mui/material";
import Comment from "./comment/comment";
import React from "react";
import { styled } from "@mui/system";
import {
    DeleteCommentFunctionType,
    StringFunctionType
} from "../../../../types/functionTypes";
import { useComments } from "../../../../hooks/useComments";

/**
 * Styled "Show More Comments" button with custom margin and font style.
 */
const ShowMoreButton = styled(Button)({
    marginTop: '8px',
    fontStyle: "italic",
    textTransform: "lowercase"
});

/**
 * Type definition for an individual comment.
 */
export interface CommentType {
    text: string;
    comment_by: string;
    comment_date_time: string;
    vote_count: number;
    _id: string;
}

/**
 * Props for the Comments component.
 */
interface CommentsProps {
    comments: CommentType[];
    csrfToken: string;
    mod: string;
    qid: string;
    parentId: string;
    parentType: string;
    handleDeleteComment: DeleteCommentFunctionType;
    handleError: StringFunctionType;
}

/**
 * Comments component displays a list of comments associated with a question or answer.
 * Initially shows up to 3 comments with an option to expand and view all.
 *
 * @param {CommentsProps} props - Props required to display and manage the comment list.
 * @returns {JSX.Element} Rendered list of Comment components with toggle option.
 */
const Comments = ({
                      comments, csrfToken, mod,
                      qid, parentId, parentType,
                      handleDeleteComment, handleError
                  }: CommentsProps): JSX.Element => {

    const { showAllComments, toggleShowAllComments } = useComments();

    return (
        <>
            {showAllComments ? (
                comments.map((comment, index: number) => (
                    <Comment
                        key={index}
                        text={comment.text}
                        author={comment.comment_by}
                        date={comment.comment_date_time}
                        votes={comment.vote_count}
                        csrfToken={csrfToken}
                        cid={comment._id}
                        mod={mod}
                        qid={qid}
                        parentId={parentId}
                        parentType={parentType}
                        handleDeleteComment={handleDeleteComment}
                        handleError={handleError}
                    />
                ))
            ) : (
                comments.slice(0, 3).map((comment, index) => (
                    <Comment
                        key={index}
                        text={comment.text}
                        author={comment.comment_by}
                        date={comment.comment_date_time}
                        votes={comment.vote_count}
                        csrfToken={csrfToken}
                        cid={comment._id}
                        mod={mod}
                        qid={qid}
                        parentId={parentId}
                        parentType={parentType}
                        handleDeleteComment={handleDeleteComment}
                        handleError={handleError}
                    />
                ))
            )}

            {!showAllComments && comments.length > 3 && (
                <ShowMoreButton variant="text" onClick={toggleShowAllComments}>
                    Show More Comments
                </ShowMoreButton>
            )}
        </>
    );
};

export default Comments;
