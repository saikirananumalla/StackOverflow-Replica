import {Then, And} from 'cypress-cucumber-preprocessor/steps';
import "./util/dbSetup";

And('clicks the delete button for the question', () => {
    cy.get(".deleteQuestionButton").eq(0).click();
});

Then('The question is deleted and the mod is rerouted to the home page', () => {
    cy.get(".postTitle").should("have.length", 3);
});

Then('No delete icon is shown to the user to delete a question', () => {
    cy.get(".deleteQuestionButton").should("have.length", 0);
});
