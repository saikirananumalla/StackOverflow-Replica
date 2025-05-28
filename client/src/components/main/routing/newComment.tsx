import React from "react";
import PageClass from ".";
import NewComment from "../newComment/newCommentView";

/**
 * `NewCommentPageClass` represents the page where a user can create a new comment.
 * This class extends the base `PageClass` and provides the necessary context
 * (like parent type, parent ID, and associated question) to render the comment form.
 */
export default class NewCommentPageClass extends PageClass {
    /**
     * Returns the JSX content to render the new comment form.
     *
     * @returns {React.ReactNode} A React node rendering the `NewComment` component.
     */
    getContent(): React.ReactNode {
        return (
            <NewComment
                pid={this.pid}
                qid={this.pqid}
                parent={this.parent}
                handleAnswer={this.handleAnswer}
                csrfToken={this.csrfToken}
            />
        );
    }

    /**
     * Returns the selected sidebar/tab identifier for this page.
     * For the New Comment Page, no tab is selected, so it returns an empty string.
     *
     * @returns {string} An empty string.
     */
    getSelected(): string {
        return "";
    }
}
