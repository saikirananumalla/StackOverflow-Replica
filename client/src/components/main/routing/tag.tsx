import React from "react";
import PageClass from ".";
import TagPage from "../tagPage/tagPageView";

/**
 * `TagPageClass` extends the base `PageClass` and renders the `TagPage` component.
 * This page displays the list of available tags and allows the user to navigate by tag.
 */
export default class TagPageClass extends PageClass {
  /**
   * Returns the JSX content to render the tag page.
   *
   * @returns {React.ReactNode} A React node rendering the `TagPage` component.
   */
  getContent(): React.ReactNode {
    return (
        <TagPage
            clickTag={this.clickTag}
            handleNewQuestion={this.handleNewQuestion}
            csrfToken={this.csrfToken}
        />
    );
  }

  /**
   * Returns the identifier for the selected sidebar/tab.
   * In this case, "t" indicates the Tags tab should be highlighted.
   *
   * @returns {string} The selected tab identifier ("t").
   */
  getSelected(): string {
    return "t";
  }
}
