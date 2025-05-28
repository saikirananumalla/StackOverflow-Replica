import Form from "../baseComponents/form/formView";
import Input from "../baseComponents/input/inputView";
import Textarea from "../baseComponents/textarea/textAreaView";
import { useNewQuestion } from "../../../hooks/useNewQuestion";
import { VoidFunctionType } from "../../../types/functionTypes";
import { TagPageContainer } from "../tagPage/tagPageViewStyle";
import { Button, Typography } from "@mui/material";

/**
 * Props for the NewQuestion component.
 */
interface NewQuestionProps {
    handleQuestions: VoidFunctionType;
    csrfToken: string;
}

/**
 * NewQuestion component renders a form for users to submit a new question.
 * It manages title, text, and tags using the `useNewQuestion` hook,
 * performs basic validation, and saves the question to the database.
 * On successful submission, it calls `handleQuestions` to refresh the question list.
 *
 * @param {NewQuestionProps} props - Contains CSRF token and a callback to refresh question list.
 * @returns {JSX.Element} The rendered new question form.
 */
const NewQuestion = ({
                         handleQuestions,
                         csrfToken
                     }: NewQuestionProps): JSX.Element => {
    const {
        title,
        setTitle,
        text,
        setText,
        tag,
        setTag,
        titleErr,
        textErr,
        tagErr,
        postQuestion
    } = useNewQuestion(handleQuestions, csrfToken);

    return (
        <TagPageContainer>
            <Form>
                <Input
                    title="Question Title"
                    id="formTitleInput"
                    hint="Limit title to 100 characters or less"
                    val={title}
                    setState={setTitle}
                    err={titleErr}
                />
                <Textarea
                    title="Question Text"
                    id="formTextInput"
                    hint="Add details"
                    val={text}
                    setState={setText}
                    err={textErr}
                />
                <Input
                    title="Tags"
                    id="formTagInput"
                    mandatory={true}
                    hint="Add keywords separated by whitespace"
                    val={tag}
                    setState={setTag}
                    err={tagErr}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                        variant="contained"
                        style={{ marginRight: "10px", background: "black" }}
                        onClick={postQuestion}
                    >
                        Post Question
                    </Button>
                    <Typography variant="body2">
                        * all fields are mandatory
                    </Typography>
                </div>
            </Form>
        </TagPageContainer>
    );
};

export default NewQuestion;
