import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import createQuestion, {Q1_TITLE, Q2_TITLE, Q3_TITLE, Q4_TITLE, Q5_TITLE} from "./util/util";
import "./util/dbSetup";
import {CLIENT_URL} from "./util/cypressConstants";

function verifyNewestOrder() {
    const qTitlesByNewest = [Q3_TITLE, Q4_TITLE, Q2_TITLE, Q1_TITLE];
    cy.get(".postTitle").each(($el, index) => {
        cy.wrap($el).should("contain", qTitlesByNewest[index]);
    });
}

// Scenario: Show all questions in the newest order by default
Given("the user is on the homepage {string}", (url) => {
    cy.visit(url);
    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("123456");
    cy.get("#LoginButton").click();
});

And("can see the homepage {string}", (pageName) => {
    cy.contains(pageName);
});

Then("the user should see the {string} tab selected by default", (tabName) => {
    cy.contains(tabName);
});

And("the questions should be listed with the most recent question on top", () => {
    verifyNewestOrder();
});

// Scenario: Return to the newest questions after viewing tags
When("the user navigates to the {string} menu", (menuItem) => {
    cy.contains(menuItem).click();
});

And("returns to the {string} menu", (menuItem) => {
    cy.contains(menuItem).click();
});

Then("the {string} tab should be selected", (tabName) => {
    cy.contains(tabName);
});

And("the questions should be sorted by newest first", () => {
    verifyNewestOrder();
});

// Scenario: View the newest questions after changing sort order
Given("the user is viewing questions sorted by {string}", (tabName) => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("123456");
    cy.get("#LoginButton").click();
    cy.contains(tabName).click();
});

When("the user clicks the {string} tab", (tabName) => {
    cy.contains(tabName).click();
});

Then("the questions should be listed with the most recent question on top", () => {
    verifyNewestOrder();
});

// Scenario: View the newest questions after asking a new question
And("The user has created a new question", () => {
    createQuestion(Q5_TITLE, "Text for latest test question", "bdd");
});

Then("the first question should be latest add question", () => {
    const newOrder = [
        Q5_TITLE,
        Q3_TITLE,
        Q4_TITLE,
        Q2_TITLE,
        Q1_TITLE
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", newOrder[index]);
    });
});
