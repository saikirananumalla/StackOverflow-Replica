import { SideBarNavContainer, MenuButton } from "./sideBarNavViewStyle";
import { Typography } from "@mui/material";
import { VoidFunctionType } from "../../../types/functionTypes";

/**
 * Props for the SideBarNav component.
 */
interface SideBarNavProps {
    selected?: string;
    handleQuestions: VoidFunctionType;
    handleTags: VoidFunctionType;
    handleUser: VoidFunctionType;
}

/**
 * `SideBarNav` is the sidebar navigation component used for navigating
 * between the Questions, Tags, and User pages.
 * Highlights the selected item based on the `selected` prop and
 * triggers corresponding view changes via provided handlers.
 *
 * @param {SideBarNavProps} props - Contains the selected tab and event handlers for each section.
 * @returns {JSX.Element} The rendered sidebar navigation component.
 */
const SideBarNav = ({
                        selected = "",
                        handleQuestions,
                        handleTags,
                        handleUser
                    }: SideBarNavProps): JSX.Element => {
    return (
        <SideBarNavContainer>
            <MenuButton
                onClick={handleQuestions}
                id="menu_question"
                className={`menu_button ${selected === "q" ? "menu_selected" : ""}`}
            >
                <Typography variant="body1">Questions</Typography>
            </MenuButton>
            <MenuButton
                onClick={handleTags}
                id="menu_tag"
                className={`menu_button ${selected === "t" ? "menu_selected" : ""}`}
            >
                <Typography variant="body1">Tags</Typography>
            </MenuButton>
            <MenuButton
                onClick={handleUser}
                id="menu_user"
                className={`menu_button ${selected === "u" ? "menu_selected" : ""}`}
            >
                <Typography variant="body1">User</Typography>
            </MenuButton>
        </SideBarNavContainer>
    );
};

export default SideBarNav;
