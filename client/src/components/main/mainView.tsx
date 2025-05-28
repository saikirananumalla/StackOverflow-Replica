import { MainContainer, ContentContainer } from "./mainViewStyle";
import SideBarNav from "./sideBarNav/sideBarNavView";
import PageClass from "./routing";

/**
 * Props for the Main component.
 */
interface MainProps {
    page: PageClass;
    handleQuestions: () => void;
    handleTags: () => void;
    handleUser: () => void;
}

/**
 * `Main` component is the core layout of the application.
 * It consists of the sidebar navigation (`SideBarNav`) and the main content area,
 * which is dynamically rendered based on the current `PageClass` instance.
 *
 * @param {MainProps} props - Contains the active page object and handlers for navigation (questions, tags, user).
 * @returns {JSX.Element} The rendered main layout of the application.
 */
const Main = ({ page, handleQuestions, handleTags, handleUser }: MainProps): JSX.Element => {
    return (
        <MainContainer>
            <SideBarNav
                selected={page.getSelected()}
                handleQuestions={handleQuestions}
                handleTags={handleTags}
                handleUser={handleUser}
            />
            <ContentContainer id="right_main" className="right_main">
                {page.getContent()}
            </ContentContainer>
        </MainContainer>
    );
};

export default Main;
