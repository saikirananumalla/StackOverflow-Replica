import { TagPageContainer, PageHeader, TagList } from "./tagPageViewStyle";
import { Button, Typography } from "@mui/material";
import Tag from "./tag/tagView";
import { useTagPage } from "../../../hooks/useTagPage";
import {
    VoidFunctionType,
    ClickTagFunctionType,
} from "../../../types/functionTypes";

/**
 * Props for the TagPage component.
 */
interface TagPageProps {
    clickTag: ClickTagFunctionType;
    handleNewQuestion: VoidFunctionType;
    csrfToken: string;
}

/**
 * `TagPage` component displays a list of all tags available in the application.
 * Each tag shows the number of associated questions and is rendered using the `Tag` component.
 * Also includes a button to ask a new question.
 *
 * @param {TagPageProps} props - Contains tag click handler, question creation handler, and CSRF token.
 * @returns {JSX.Element} The rendered tag page component.
 */
const TagPage = ({
                     clickTag,
                     handleNewQuestion,
                     csrfToken
                 }: TagPageProps): JSX.Element => {
    const { tlist } = useTagPage(csrfToken);

    return (
        <TagPageContainer>
            <PageHeader>
                <Typography variant="h5">{tlist.length} Tags</Typography>
                <Typography variant="h5">All Tags</Typography>
                <Button
                    variant="contained"
                    onClick={handleNewQuestion}
                    style={{ marginRight: "10px", background: "black" }}
                >
                    Ask a Question
                </Button>
            </PageHeader>
            <TagList>
                {tlist.map((t, idx) => (
                    <Tag key={idx} t={t} clickTag={clickTag} />
                ))}
            </TagList>
        </TagPageContainer>
    );
};

export default TagPage;
