import Header from "./header";
import Main from "./main/mainView";
import { VoidFunctionType } from "../types/functionTypes";
import { useFakeStackOverflow } from "../hooks/useFakeStackOverflow";

/**
 * Props for the FakeStackOverflow root component.
 */
interface FSOPageProps {
    csrfToken: string;
    mod: string;
    handleLogout: VoidFunctionType;
}

/**
 * `FakeStackOverflow` is the root component of the application.
 * It combines the `Header` and `Main` layout and manages page navigation through hooks.
 *
 * State and routing logic is encapsulated in the `useFakeStackOverflow` custom hook,
 * which controls:
 * - `search`: the current search query
 * - `setQuestionPage`: function to switch the displayed content
 * - `pageInstance`: the current page object to render inside `<Main />`
 * - `handleQuestions`, `handleTags`, `handleUser`: handlers for sidebar navigation
 *
 * @param {FSOPageProps} props - Contains CSRF token, moderator role, and logout handler.
 * @returns {JSX.Element} The rendered Fake Stack Overflow application.
 */
const FakeStackOverflow = ({
                               csrfToken,
                               mod,
                               handleLogout
                           }: FSOPageProps): JSX.Element => {
    const {
        search,
        setQuestionPage,
        pageInstance,
        handleQuestions,
        handleTags,
        handleUser
    } = useFakeStackOverflow(handleLogout, csrfToken, mod);

    return (
        <>
            <Header
                search={search}
                setQuestionPage={setQuestionPage}
            />
            <Main
                page={pageInstance}
                handleQuestions={handleQuestions}
                handleTags={handleTags}
                handleUser={handleUser}
            />
        </>
    );
};

export default FakeStackOverflow;
