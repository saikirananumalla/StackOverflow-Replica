import { When, Then, And } from "cypress-cucumber-preprocessor/steps";
import createQuestion from "./util/util";
import "./util/dbSetup";

function answerQuestion(title, text) {
    cy.contains(title).click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type(text);
    cy.contains("Post Answer").click();
    cy.contains("Questions").click();
}

When("The user clicks on the {string} tab", (tabName) => {
    cy.contains(tabName).click();
});

Then("The user should see a message indicating there are no unanswered questions", () => {
    cy.contains("0 Questions");
});

And("The user has posted a new question titled {string}", (title) => {
    createQuestion(title, "Test content for an unanswered question", "bdd");
});

Then("The user should see the question titled {string}", (expectedTitle) => {
    cy.get(".postTitle").first().should("contain", expectedTitle);
});

And("The user answers the question titled {string}", (title) => {
    answerQuestion(title, "Here's a quick answer");
});

Then("The question titled {string} should not appear in the list", (title) => {
    cy.contains("0 Questions");
});
