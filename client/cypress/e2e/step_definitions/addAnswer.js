import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
import "./util/dbSetup";
import {CLIENT_URL} from "./util/cypressConstants";

const errorMessages = {
    username: "Username cannot be empty",
    text: "Answer text cannot be empty"
};

const validAnswer = {
    text: "Here’s how you can do that using React Router v6..."
};

const validAnswerWithHyperlink = {
    text: "[Netflix](https://www.netflix.com)"
};

const invalidAnswerWithHyperlink = {
    text: "[Netflix](htps://www.netflix)"
};

function fillAnswerForm(answer) {
    if (answer.text) cy.get("#answerTextInput").type(answer.text);
}

Given("The user is on the homepage", () => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("123456");
    cy.get("#LoginButton").click();
});

When("The user clicks on the question titled {string}", (title) => {
    cy.contains(title).click();
});

And("clicks the {string} button", (buttonText) => {
    cy.contains(buttonText).click();
});

And("fills in the answer form with valid information", () => {
    fillAnswerForm(validAnswer);
});

And("clicks the {string} button", (buttonText) => {
    cy.contains(buttonText).click();
});

Then("The user should see their answer displayed below the question", () => {
    cy.get(".answerText").should("contain", validAnswer.text);
    cy.contains("user1");
});

And("fills in the answer form with missing {string}", (field) => {
    const answerCopy = { ...validAnswer };
    answerCopy[field] = "";
    fillAnswerForm(answerCopy);
});

And("fills in the answer form with invalid hyperlink", () => {
    fillAnswerForm(invalidAnswerWithHyperlink);
});

And("fills in the answer form with valid hyperlink", () => {
    fillAnswerForm(validAnswerWithHyperlink);
});

Then("The user should see an error message for the {string}", (field) => {
    const message = errorMessages[field];
    cy.contains(message).should("exist");
});

Then("The user should see an error for invalid hyperlink", () => {
    const message = "Invalid hyperlink";
    cy.contains(message).should("exist");
});


Then("The user should see the new answer with hyperlinks with the metadata information", () => {
    cy.get(".answerText").should("contain", "Netflix");
    cy.contains("user1");
});

