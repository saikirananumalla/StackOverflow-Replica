import { TagNode, TagName } from "./tagViewStyle";
import { ClickTagFunctionType } from "../../../../types/functionTypes";

/**
 * Props for the Tag component.
 */
interface TagProps {
    t: {
        name: string;
        qcnt: number;
    };
    clickTag: ClickTagFunctionType;
}

/**
 * `Tag` component renders a single tag on the tags page.
 * Displays the tag's name and the number of associated questions.
 * When clicked, it triggers the `clickTag` function to show questions filtered by the tag.
 *
 * @param {TagProps} props - Contains the tag data and a click handler for filtering questions.
 * @returns {JSX.Element} The rendered tag element.
 */
const Tag = ({ t, clickTag }: TagProps): JSX.Element => {
    return (
        <TagNode
            onClick={() => {
                clickTag(t.name);
            }}
            className="tagNode"
        >
            <TagName className="tagName">
                {t.name}
            </TagName>
            <div>{t.qcnt} questions</div>
        </TagNode>
    );
};

export default Tag;
