import Form from "../baseComponents/form/formView";
import Textarea from "../baseComponents/textarea/textAreaView";
import { useNewAnswer } from "../../../hooks/useNewAnswer";
import { QuestionIdFunctionType } from "../../../types/functionTypes";
import { TagPageContainer } from "../tagPage/tagPageViewStyle";
import { Button, Typography } from "@mui/material";

/**
 * Props for the NewAnswer component.
 */
interface NewAnswerProps {
    qid: string;
    handleAnswer: QuestionIdFunctionType;
    csrfToken: string;
}

/**
 * NewAnswer component renders a form that allows users to submit a new answer to a question.
 * It uses a custom hook to manage input state and validation.
 * On submission, it sends the answer to the backend and updates the view using `handleAnswer`.
 *
 * @param {NewAnswerProps} props - Contains question ID, answer handler, and CSRF token.
 * @returns {JSX.Element} A rendered form to post a new answer.
 */
const NewAnswer = ({ qid, handleAnswer, csrfToken }: NewAnswerProps): JSX.Element => {

    const {
        text,
        setText,
        textErr,
        postAnswer
    } = useNewAnswer(qid, handleAnswer, csrfToken);

    return (
        <TagPageContainer>
            <Form>
                <Textarea
                    title="Answer Text"
                    id="answerTextInput"
                    val={text}
                    setState={setText}
                    err={textErr}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                        variant="contained"
                        style={{ marginRight: "10px", background: "black" }}
                        onClick={postAnswer}
                    >
                        Post Answer
                    </Button>
                    <Typography variant="body2">
                        * all fields are mandatory
                    </Typography>
                </div>
            </Form>
        </TagPageContainer>
    );
};

export default NewAnswer;
