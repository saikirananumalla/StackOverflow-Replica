import React from "react";
import PageClass from ".";
import AnswerPage from "../answerPage/answerPageView";

/**
 * `AnswerPageClass` extends the base `PageClass` and represents
 * the dynamic logic required to render the answer page for a specific question.
 * It provides the JSX content for rendering the `AnswerPage` and defines what is selected in the nav (if any).
 */
export default class AnswerPageClass extends PageClass {
  /**
   * Returns the JSX content to be rendered on the answer page.
   *
   * @returns {React.ReactNode} A React node rendering the `AnswerPage` component with injected props.
   */
  getContent(): React.ReactNode {
    return (
        <AnswerPage
            qid={this.qid}
            rid={Math.random()}
            handleNewQuestion={this.handleNewQuestion}
            handleNewAnswer={this.handleNewAnswer}
            handleComment={this.handleComment}
            csrfToken={this.csrfToken}
            mod={this.mod}
            handleDeleteQuestion={this.handleDeleteQuestion}
            handleDeleteAnswer={this.handleDeleteAnswer}
            handleDeleteComment={this.handleDeleteComment}
        />
    );
  }

  /**
   * Returns the selected item identifier for navigation highlighting.
   * For the answer page, this returns an empty string as no tab is selected.
   *
   * @returns {string} An empty string.
   */
  getSelected(): string {
    return "";
  }
}
