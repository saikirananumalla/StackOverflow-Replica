import React from "react";
import PageClass from ".";
import NewAnswer from "../newAnswer/newAnswerView";

/**
 * `NewAnswerPageClass` is a page class for rendering the New Answer form view.
 * It extends the base `PageClass` and provides the JSX content required to
 * submit a new answer for a specific question.
 */
export default class NewAnswerPageClass extends PageClass {
  /**
   * Returns the JSX content to render the new answer submission form.
   *
   * @returns {React.ReactNode} A React node rendering the `NewAnswer` component.
   */
  getContent(): React.ReactNode {
    return (
        <NewAnswer
            qid={this.qid}
            handleAnswer={this.handleAnswer}
            csrfToken={this.csrfToken}
        />
    );
  }

  /**
   * Returns the selected sidebar/tab identifier for this page.
   * Returns an empty string as no tab should be selected.
   *
   * @returns {string} An empty string.
   */
  getSelected(): string {
    return "";
  }
}
