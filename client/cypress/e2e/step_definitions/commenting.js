import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import "./util/dbSetup";
import "./util/cypressConstants";
import {CLIENT_URL} from "./util/cypressConstants";

Given("a user is logged in and is viewing a question", () => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("123456");
    cy.get("#LoginButton").click();
    cy.contains("Programmatically navigate using React router").click();
});

Given("a mod is logged in and is viewing a question", () => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user3");
    cy.get("#formPassword").type("123456");
    cy.get("#LoginButton").click();
    cy.contains("Programmatically navigate using React router").click();
});

Given("a user is not logged in", () => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user3");
    cy.get("#formPassword").type("123456");
});

When("they type a comment to the {string} and submit it", (post) => {
    if (post === "question") {
        cy.get(".addCommentQuestionButton").eq(0).click();
        cy.get("#formTextInput").type("testing comment question");
        cy.contains("Post Comment").click();
    } else if (post === "answer") {
        cy.get(".addCommentAnswerButton").eq(0).click();
        cy.get("#formTextInput").type("testing comment answer");
        cy.contains("Post Comment").click();
    }
});

When("they give an empty comment to the {string} and submit it", (post) => {
    if (post === "question") {
        cy.get(".addCommentQuestionButton").eq(0).click();
        cy.contains("Post Comment").click();
    } else if (post === "answer") {
        cy.get(".addCommentAnswerButton").eq(0).click();
        cy.contains("Post Comment").click();
    }
});

When("they choose to delete a comment under a {string}", (post) => {
    if (post === "question") {
        cy.get(".deleteCommentButton").eq(0).click();
    } else if (post === "answer") {
        cy.get(".deleteCommentButton").eq(1).click();
    }
});

When("they type a comment to the {string} and submit it with valid hyperlinks", (post) => {
    if (post === "question") {
        cy.get(".addCommentQuestionButton").eq(0).click();
        cy.get("#formTextInput").type("[Netflix](https://www.netflix.com)");
        cy.contains("Post Comment").click();
    } else if (post === "answer") {
        cy.get(".addCommentAnswerButton").eq(0).click();
        cy.get("#formTextInput").type("[Netflix](https://www.netflix.com)");
        cy.contains("Post Comment").click();
    }
});

When("they type a comment to the {string} and submit it with invalid hyperlinks", (post) => {
    if (post === "question") {
        cy.get(".addCommentQuestionButton").eq(0).click();
        cy.get("#formTextInput").type("[Netflix](htps://www.netflix.com)");
        cy.contains("Post Comment").click();
    } else if (post === "answer") {
        cy.get(".addCommentAnswerButton").eq(0).click();
        cy.get("#formTextInput").type("[Netflix](http://wwnetflix.com)");
        cy.contains("Post Comment").click();
    }
});

Then("the comment is added to the {string} and displayed below the question", (post) => {
    if (post === "question") {
        cy.get(".commentBody").should("contain", "testing comment question");
    } else if (post === "answer") {
        cy.get(".commentBody").should("contain", "testing comment answer");
    }
});

Then("the comment is removed from the {string}", (post) => {
    if (post === "question") {
        cy.get(".commentBody").should("not.contain", "This is comment2");
    } else if (post === "answer") {
        cy.get(".commentBody").should("not.contain", "This is comment4");
    }
});

Then("an comment error message is displayed: Comment text cannot be empty", () => {
    cy.get(".input_error").should("contain", "Comment text cannot be empty");
});

Then("the comment with hyperlink is added to the {string} and displayed below the question", () => {
    cy.contains("Netflix");
});

Then("an comment error message is displayed: Invalid Hyperlink", () => {
    cy.get(".input_error").should("contain", "Invalid hyperlink");
});

Then("They cannot add a comment to anything", () => {
    cy.get(".addCommentQuestionButton").should("have.length", 0);
});