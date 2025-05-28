import React from "react";
import PageClass from ".";
import QuestionPage from "../questionPage/questionPageView";

/**
 * `HomePageClass` extends the base `PageClass` and is responsible for
 * rendering the `QuestionPage` component. It provides props to filter
 * and sort questions based on search queries and selected order.
 */
export default class HomePageClass extends PageClass {
  /**
   * Returns the JSX content to be rendered on the homepage.
   * Renders a list of questions based on the current order and search query.
   *
   * @returns {React.ReactNode} A React node rendering the `QuestionPage` component with relevant props.
   */
  getContent(): React.ReactNode {
    return (
        <QuestionPage
            title_text={this.title}
            order={this.questionOrder.toLowerCase()}
            search={this.search}
            setQuestionOrder={this.setQuestionOrder}
            clickTag={this.clickTag}
            handleAnswer={this.handleAnswer}
            handleNewQuestion={this.handleNewQuestion}
            csrfToken={this.csrfToken}
        />
    );
  }

  /**
   * Returns the identifier for the selected sidebar tab.
   * For the homepage, this corresponds to the "questions" tab.
   *
   * @returns {string} The selected tab identifier ("q").
   */
  getSelected(): string {
    return "q";
  }
}
