import { getMetaData } from "../../../utils";
import Answer from "./answer/answerView";
import AnswerHeader from "./header/headerView";
import "./answerPageView.css";
import QuestionBody from "./questionBody/questionBodyView";
import {
    CommentFunctionType,
    DeleteAnswerFunctionType,
    DeleteCommentFunctionType,
    DeleteQuestionFunctionType,
    IdFunctionType,
    VoidFunctionType
} from "../../../types/functionTypes";
import { useAnswerPage } from "../../../hooks/useAnswerPage";
import { Snackbar } from "@mui/material";

/**
 * Props for the AnswerPage component.
 */
interface AnswerPageProps {
    qid: string;
    handleNewQuestion: VoidFunctionType;
    handleNewAnswer: IdFunctionType;
    rid: number;
    handleComment: CommentFunctionType;
    csrfToken: string;
    mod: string;
    handleDeleteQuestion: DeleteQuestionFunctionType;
    handleDeleteAnswer: DeleteAnswerFunctionType;
    handleDeleteComment: DeleteCommentFunctionType;
}

/**
 * AnswerPage component renders a complete Q&A view for a selected question.
 * Includes the question body, associated answers, comments, voting, and snackbar error feedback.
 *
 * @param {AnswerPageProps} props - Props including IDs, callbacks, CSRF token, and mod access.
 * @returns {JSX.Element | null} A fully rendered question with its answers, or null if the data hasn't loaded.
 */
const AnswerPage = ({
                        qid,
                        rid,
                        handleNewQuestion,
                        handleNewAnswer,
                        handleComment,
                        csrfToken,
                        mod,
                        handleDeleteQuestion,
                        handleDeleteAnswer,
                        handleDeleteComment
                    }: AnswerPageProps): JSX.Element | null => {

    const {
        question,
        handleError,
        errorMessage,
        openSnackbar,
        dismissSnackbar
    } = useAnswerPage(qid, rid, csrfToken);

    if (!question) {
        return null;
    }

    return (
        <>
            {question.answers && (
                <AnswerHeader
                    ansCount={question.answers.length}
                    title={question.title}
                    handleNewQuestion={handleNewQuestion}
                />
            )}

            {openSnackbar && (
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={openSnackbar}
                    autoHideDuration={7000}
                    onClose={dismissSnackbar}
                    message={errorMessage}
                />
            )}

            <QuestionBody
                votes={question.vote_count}
                handleComment={handleComment}
                views={question.views}
                comments={question.comments}
                text={question.text}
                askBy={question.asked_by}
                meta={getMetaData(new Date(question.ask_date_time))}
                qid={qid}
                csrfToken={csrfToken}
                mod={mod}
                handleDeleteQuestion={handleDeleteQuestion}
                handleDeleteComment={handleDeleteComment}
                handleError={handleError}
            />

            {question.answers.map((a, idx) => (
                <Answer
                    key={idx}
                    qid={qid}
                    aid={a._id}
                    handleComment={handleComment}
                    comments={a.comments}
                    text={a.text}
                    ansBy={a.ans_by}
                    meta={getMetaData(new Date(a.ans_date_time))}
                    votes={a.vote_count}
                    csrfToken={csrfToken}
                    mod={mod}
                    handleDeleteAnswer={handleDeleteAnswer}
                    handleDeleteComment={handleDeleteComment}
                    handleError={handleError}
                />
            ))}

            <button
                className="bluebtn ansButton"
                onClick={() => handleNewAnswer(qid)}
            >
                Answer Question
            </button>
        </>
    );
};

export default AnswerPage;
