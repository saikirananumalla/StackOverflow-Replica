import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import createQuestion from "./util/util";
import "./util/dbSetup";

Given("The user is on the homepage {string}", (url) => {
    cy.visit(url);
});

When("The user clicks on the {string} menu item", (menuItem) => {
    cy.contains(menuItem).click();
});

Then("The user should see all tags", () => {
    cy.get(".tagNode").should("have.length.greaterThan", 0);
});

And("Each tag should show the number of questions linked to it", () => {
    cy.get(".tagNode").each(($el) => {
        cy.wrap($el).contains("questions").should("exist");
    });
});

And("The user posts a question with tag {string}", (tag) => {
    createQuestion("New question for tag test", "Test content", tag);
});

Then("The user should see the tag {string}", (tag) => {
    cy.contains(tag).should("exist");
});

And("It should show 1 question linked to it", () => {
    cy.contains("1 question").should("exist");
});

And("The user clicks on the tag named {string}", (tagName) => {
    cy.contains(tagName).click();
});

Then("The user should see only questions tagged with {string}", (tagName) => {
    cy.get(".question_list").each(($el) => {
        cy.wrap($el).should("contain", tagName);
    });
});

