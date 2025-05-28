import { HeaderContainer, Title, SearchBar } from "./indexStyle";
import { QuestionsPageQueryFuntionType } from "../../types/functionTypes";
import { useHeader } from "../../hooks/useHeader";
import { Toolbar } from "@mui/material";

/**
 * Props for the Header component.
 * @property {string} search - The current search term.
 * @property {QuestionsPageQueryFuntionType} setQuestionPage - Function to update the displayed questions page based on the query.
 */
interface HeaderProps {
    search: string;
    setQuestionPage: QuestionsPageQueryFuntionType;
}

/**
 * Header component for the Fake Stack Overflow application.
 * Displays the title and a search bar.
 * Handles search input and triggers page update on Enter key.
 *
 * @param {HeaderProps} props - The props for the Header component.
 * @returns {JSX.Element} The rendered Header component.
 */
const Header = ({ search, setQuestionPage }: HeaderProps): JSX.Element => {
    // Custom hook that handles search input state and behavior
    const { val, handleInputChange, handleKeyDown } = useHeader(search, setQuestionPage);

    return (
        <HeaderContainer id="header">
            <Toolbar>
                <Title>Fake Stack Overflow</Title>
                <SearchBar
                    placeholder="Search ..."
                    type="text"
                    value={val}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    id="searchBar"
                />
            </Toolbar>
        </HeaderContainer>
    );
};

export default Header;
