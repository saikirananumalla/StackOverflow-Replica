import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import "./util/dbSetup";

Given("The user is on the homepage {string}", (url) => {
    cy.visit(url);
});

When("The user enters {string} in the search bar and submits", (query) => {
    cy.get("#searchBar").clear().type(`${query}{enter}`);
});

Then("The user should see only questions with titles or content matching {string}", (keyword) => {
    cy.get(".postTitle").each(($el) => {
        cy.wrap($el).invoke("text").then((text) => {
            expect(text.toLowerCase()).to.include(keyword.toLowerCase());
        });
    });
});

Then("The user should see only questions tagged with {string}", (tagName) => {
    cy.get(".question_list").each(($el) => {
        cy.wrap($el).should("contain", tagName);
    });
});

Then("The user should see a message indicating that no questions were found", () => {
    cy.contains("No Questions Found").should("exist");
});
