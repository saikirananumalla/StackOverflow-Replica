import React from 'react';
import { IconButton, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { VoteContainer } from './voteContainer';
import { StringFunctionType } from "../../../../types/functionTypes";
import useVote from "../../../../hooks/useVote";

/**
 * Props for the VoteButtons component.
 */
interface VoteProps {
    parentId: string;
    parentType: string;
    csrfToken: string;
    numberOfVotes: number;
    handleError: StringFunctionType;
}

/**
 * VoteButtons component renders upvote and downvote buttons for a post (question, answer, or comment),
 * and displays the current vote count. Uses a custom hook to manage vote state and interaction.
 *
 * @param {VoteProps} props - Contains post metadata, CSRF token, initial vote count, and error handler.
 * @returns {JSX.Element} The rendered voting component with buttons and vote count.
 */
const VoteButtons = ({
                         parentId,
                         parentType,
                         csrfToken,
                         numberOfVotes,
                         handleError
                     }: VoteProps): JSX.Element => {

    const { votes, handleVote } = useVote(parentId, parentType, csrfToken, numberOfVotes, handleError);

    return (
        <VoteContainer className="voteCount">
            <IconButton onClick={() => handleVote("up_vote")} size="small" className="upButton">
                <ThumbUpIcon />
            </IconButton>
            <Typography variant="body2">{votes}</Typography>
            <IconButton onClick={() => handleVote("down_vote")} size="small" className="downButton">
                <ThumbDownIcon />
            </IconButton>
        </VoteContainer>
    );
};

export default VoteButtons;
