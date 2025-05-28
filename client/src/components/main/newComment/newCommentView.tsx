import Form from "../baseComponents/form/formView";
import { Button, Typography } from "@mui/material";
import { IdFunctionType } from "../../../types/functionTypes";
import { useNewCommentView } from "../../../hooks/useNewCommentView";
import { TagPageContainer } from "../tagPage/tagPageViewStyle";
import Textarea from "../baseComponents/textarea/textAreaView";

/**
 * Props for the NewComment component.
 */
interface NewCommentViewProps {
    handleAnswer: IdFunctionType;
    qid: string;
    pid: string;
    parent: string;
    csrfToken: string;
}

/**
 * NewComment component renders a form for submitting a new comment on a question or answer.
 * Uses a custom hook to manage form state, validation, and submission logic.
 *
 * @param {NewCommentViewProps} props - Props include question ID, parent ID, parent type, CSRF token, and callback.
 * @returns {JSX.Element} The rendered comment submission form.
 */
const NewComment = ({
                        handleAnswer,
                        qid,
                        pid,
                        parent,
                        csrfToken
                    }: NewCommentViewProps): JSX.Element => {

    const { text, textErr, setText, postComment } =
        useNewCommentView(handleAnswer, qid, pid, parent, csrfToken);

    return (
        <TagPageContainer>
            <Form>
                <Textarea
                    title="Comment Text"
                    id="formTextInput"
                    hint="Add details"
                    val={text}
                    setState={setText}
                    err={textErr}
                />

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                        variant="contained"
                        style={{ marginRight: "10px", background: "black" }}
                        onClick={postComment}
                    >
                        Post Comment
                    </Button>
                    <Typography variant="body2">
                        * all fields are mandatory
                    </Typography>
                </div>
            </Form>
        </TagPageContainer>
    );
};

export default NewComment;
