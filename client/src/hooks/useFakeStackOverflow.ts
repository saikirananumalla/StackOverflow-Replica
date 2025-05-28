import {
    VoidFunctionType
} from "../types/functionTypes";
import {useState} from "react";
import HomePageClass from "../components/main/routing/home";
import TagPageClass from "../components/main/routing/tag";
import UserPageClass from "../components/main/routing/user";
import AnswerPageClass from "../components/main/routing/answer";
import NewQuestionPageClass from "../components/main/routing/newQuestion";
import NewAnswerPageClass from "../components/main/routing/newAnswer";
import {delQuestion} from "../services/questionService";
import {delComment} from "../services/commentService";
import {delAnswer} from "../services/answerService";
import NewCommentPageClass from "../components/main/routing/newComment";

/**
 * Custom hook that manages routing, state, and navigation logic for the Fake Stack Overflow app.
 *
 * @param handleLogout - Function to log out the current user.
 * @param csrfToken - CSRF token for secure API interactions.
 * @param mod - Role/flag to determine if user is a moderator.
 * @returns Object containing search state, page rendering logic, and navigation handlers.
 */
export const useFakeStackOverflow = (
    handleLogout: VoidFunctionType,
    csrfToken: string,
    mod: string,
) => {

    const [search, setSearch] = useState<string>("");
    const [mainTitle, setMainTitle] = useState<string>("All Questions");
    const [questionOrder, setQuestionOrder] = useState("newest");
    const [qid, setQid] = useState<string>("");
    const [pid, setPid] = useState<string>("");
    const [pqid, setPQid] = useState<string>("");
    const [parent, setParent] = useState<string>("");

    /**
     * Handles the rendering of the NewCommentPage for a given comment.
     */
    const handleComment = (pid: string, pqid: string, parent: string) => {
        setPid(pid);
        setPQid(pqid);
        setParent(parent);
        setPageInstance(
            new NewCommentPageClass({
                search, title: mainTitle, setQuestionPage,
                questionOrder, setQuestionOrder, qid,
                handleQuestions, handleTags, handleAnswer,
                clickTag, handleNewQuestion, handleNewAnswer,
                csrfToken, handleLogout, mod, handleComment,
                handleDeleteQuestion, handleDeleteAnswer, handleDeleteComment,
                pid, pqid, parent
            })
        );
    };

    /**
     * Deletes a question by ID and refreshes the question list.
     */
    const handleDeleteQuestion = (qid: string, csrfToken: string) => {
        try {
            delQuestion(qid, csrfToken).then(() => handleQuestions());
        } catch (e) {
            alert("Error deleting question, please try again");
        }
    }

    /**
     * Deletes an answer and refreshes the corresponding question page.
     */
    const handleDeleteAnswer = (qid: string, aid: string, csrfToken: string) => {
        try {
            delAnswer(aid, csrfToken).then(() => handleAnswer(qid));
        } catch (e) {
            alert("Error deleting answer, please try again");
        }
    }

    /**
     * Deletes a comment and refreshes the corresponding question page.
     */
    const handleDeleteComment = (qid: string, parentId: string, parentType: string, cid: string, csrfToken: string) => {
        try {
            delComment(parentType, parentId, cid, csrfToken).then(() => handleAnswer(qid));
        } catch (e) {
            alert("Error deleting comment, please try again");
        }
    }

    /**
     * Sets the main page to display questions based on a search string.
     */
    const setQuestionPage = (
        search = "",
        title = "All Questions"
    ): void => {
        setSearch(search);
        setMainTitle(title);
        setPageInstance(
            new HomePageClass({
                search, title, setQuestionPage,
                questionOrder, setQuestionOrder, qid,
                handleQuestions, handleTags, handleAnswer,
                clickTag, handleNewQuestion, handleNewAnswer,
                csrfToken, handleLogout, mod,
                handleComment, handleDeleteQuestion, handleDeleteAnswer,
                handleDeleteComment, pid, pqid, parent,
            })
        );
    };

    /**
     * Navigates to the main questions page with default "All Questions" view.
     */
    const handleQuestions = () => {
        setSearch("");
        setMainTitle("All Questions");
        setPageInstance(
            new HomePageClass({
                search: "", title: "All Questions", setQuestionPage,
                questionOrder, setQuestionOrder, qid,
                handleQuestions, handleTags, handleAnswer,
                clickTag, handleNewQuestion, handleNewAnswer,
                csrfToken, handleLogout, mod,
                handleComment, handleDeleteQuestion, handleDeleteAnswer,
                handleDeleteComment, pid, pqid, parent,
            })
        );
    };

    /**
     * Navigates to the tags page.
     */
    const handleTags = () => {
        setPageInstance(
            new TagPageClass({
                search, title: mainTitle, setQuestionPage,
                questionOrder, setQuestionOrder, qid,
                handleQuestions, handleTags, handleAnswer,
                clickTag, handleNewQuestion, handleNewAnswer,
                csrfToken, handleLogout, mod,
                handleComment, handleDeleteQuestion, handleDeleteAnswer,
                handleDeleteComment, pid, pqid, parent,
            })
        );
    };

    /**
     * Navigates to the user profile page.
     */
    const handleUser = () => {
        setPageInstance(
            new UserPageClass({
                search, title: mainTitle, setQuestionPage,
                questionOrder, setQuestionOrder, qid,
                handleQuestions, handleTags, handleAnswer, clickTag,
                handleNewQuestion, handleNewAnswer, csrfToken,
                handleLogout, mod, handleComment, handleDeleteQuestion,
                handleDeleteAnswer, handleDeleteComment, pid,
                pqid, parent,
            })
        );
    };

    /**
     * Navigates to the answers page for a given question ID.
     */
    const handleAnswer = (qid: string) => {
        setQid(qid);
        setPageInstance(
            new AnswerPageClass({
                search, title: mainTitle, setQuestionPage,
                questionOrder, setQuestionOrder, qid,
                handleQuestions, handleTags, handleAnswer,
                clickTag, handleNewQuestion, handleNewAnswer,
                csrfToken, handleLogout, mod,
                handleComment, handleDeleteQuestion, handleDeleteAnswer,
                handleDeleteComment, pid, pqid, parent,
            })
        );
    };

    /**
     * Navigates to the questions page filtered by a tag.
     */
    const clickTag = (tname: string) => {
        setSearch("[" + tname + "]");
        setMainTitle(tname);
        setPageInstance(
            new HomePageClass({
                search: "[" + tname + "]", title: tname, setQuestionPage,
                questionOrder, setQuestionOrder, qid,
                handleQuestions, handleTags, handleAnswer,
                clickTag, handleNewQuestion, handleNewAnswer,
                csrfToken, handleLogout, mod,
                handleComment, handleDeleteQuestion, handleDeleteAnswer,
                handleDeleteComment, pid, pqid, parent,
            })
        );
    };

    /**
     * Navigates to the form to create a new question.
     */
    const handleNewQuestion = () => {
        setPageInstance(
            new NewQuestionPageClass({
                search, title: mainTitle, setQuestionPage,
                questionOrder, setQuestionOrder, qid,
                handleQuestions, handleTags, handleAnswer,
                clickTag, handleNewQuestion, handleNewAnswer,
                csrfToken, handleLogout, mod,
                handleComment, handleDeleteQuestion, handleDeleteAnswer,
                handleDeleteComment, pid, pqid, parent,
            })
        );
    };

    /**
     * Navigates to the form to create a new answer for a specific question.
     */
    const handleNewAnswer = (qid: string) => {
        setQid(qid);
        setPageInstance(
            new NewAnswerPageClass({
                search, title: mainTitle, setQuestionPage,
                questionOrder, setQuestionOrder, qid, handleQuestions,
                handleTags, handleAnswer, clickTag,
                handleNewQuestion, handleNewAnswer, csrfToken,
                handleLogout, mod, handleComment,
                handleDeleteQuestion, handleDeleteAnswer, handleDeleteComment,
                pid, pqid, parent,
            })
        );
    };

    /**
     * The current page object used to render the Main component.
     */
    const [pageInstance, setPageInstance] = useState(new HomePageClass({
            search: "", title: "All Questions", setQuestionPage,
            questionOrder, setQuestionOrder, qid,
            handleQuestions, handleTags, handleAnswer,
            clickTag, handleNewQuestion, handleNewAnswer,
            csrfToken, handleLogout, mod,
            handleComment, handleDeleteQuestion, handleDeleteAnswer,
            handleDeleteComment, pid, pqid, parent,
        })
    );

    // Keep page instance in sync with state
    pageInstance.search = search;
    pageInstance.questionOrder = questionOrder;
    pageInstance.qid = qid;
    pageInstance.title = mainTitle;

    return {
        search,
        setQuestionPage,
        pageInstance,
        handleQuestions,
        handleTags,
        handleUser
    };
};
