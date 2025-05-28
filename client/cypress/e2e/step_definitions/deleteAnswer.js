import { Given, Then, And } from 'cypress-cucumber-preprocessor/steps';
import "./util/dbSetup";
import {CLIENT_URL} from "./util/cypressConstants";

Given("The user is on the homepage {string}", (url) => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("123456");
    cy.get("#LoginButton").click();
});

Given("The mod is on the homepage", () => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user3");
    cy.get("#formPassword").type("123456");
    cy.get("#LoginButton").click();
});

And("clicks the delete button for an answer", () => {
    cy.get(".deleteAnswerButton").eq(0).click();
});

Then("The answer is deleted and the mod should not see the answer displayed below the question", () => {
    cy.get(".commentBody").should("not.contain", "This is comment4");
});

Then("No delete icon is shown to the user to delete an answer", () => {
    cy.get(".deleteAnswerButton").should("have.length", 0);
});
