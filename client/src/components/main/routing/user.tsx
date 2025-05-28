import React from "react";
import PageClass from ".";
import UserProfile from "../user/userProfile";

/**
 * `UserPageClass` is a page class that extends `PageClass` and renders the `UserProfile` component.
 * This page displays the user's profile information and provides a logout option.
 */
export default class UserPageClass extends PageClass {
    /**
     * Returns the JSX content to render the user profile page.
     *
     * @returns {React.ReactNode} A React node rendering the `UserProfile` component.
     */
    getContent(): React.ReactNode {
        return (
            <UserProfile
                csrfToken={this.csrfToken}
                handleLogout={this.handleLogout}
            />
        );
    }

    /**
     * Returns the identifier for the selected sidebar/tab.
     * In this case, "u" indicates the User tab should be highlighted.
     *
     * @returns {string} The selected tab identifier ("u").
     */
    getSelected(): string {
        return "u";
    }
}
