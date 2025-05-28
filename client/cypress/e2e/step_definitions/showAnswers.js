import { When, Then, And } from "cypress-cucumber-preprocessor/steps";
import createQuestion from "./util/util";
import "./util/dbSetup";

When("The user clicks on the question titled {string}", (title) => {
    cy.contains(title).click();
});


Then("The user should see all the answers for that question", () => {
    cy.get(".answerText").should("exist");
    cy.get(".answerText").should("have.length.greaterThan", 0);
});

And("The view count should be increased by 1", () => {
    cy.contains("Views: 11");
})

And("The user posts a new question titled {string}", (title) => {
    createQuestion(title, "Temporary question to test empty answers", "bdd");
});

Then("The user should see a message indicating there are no answers yet", () => {
    cy.contains("Answers: 0");
});
