import React from "react";
import PageClass from ".";
import NewQuestion from "../newQuestion/newQuestionView";

/**
 * `NewQuestionPageClass` represents the page where a user can create and submit a new question.
 * It extends the base `PageClass` and provides the context required for the question creation form.
 */
export default class NewQuestionPageClass extends PageClass {
  /**
   * Returns the JSX content to render the new question form.
   *
   * @returns {React.ReactNode} A React node rendering the `NewQuestion` component.
   */
  getContent(): React.ReactNode {
    return (
        <NewQuestion
            handleQuestions={this.handleQuestions}
            csrfToken={this.csrfToken}
        />
    );
  }

  /**
   * Returns the selected sidebar/tab identifier for this page.
   * For the New Question Page, no tab is selected, so it returns an empty string.
   *
   * @returns {string} An empty string.
   */
  getSelected(): string {
    return "";
  }
}
