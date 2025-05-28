import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
import "./util/dbSetup";
import {CLIENT_URL} from "./util/cypressConstants";

const validQuestion = {
    title: "How to add a question to the database?",
    text: "I am trying to add a question to the database using JavaScript, but I am not sure how to do it. Can someone help me?",
    tags: "database javascript",
};

function fillForm(question) {
    if (question.title) cy.get("#formTitleInput").type(question.title);
    if (question.text) cy.get("#formTextInput").type(question.text);
    if (question.tags) cy.get("#formTagInput").type(question.tags);
}

const fieldMap = {
    title: "title",
    text: "text",
    tags: "tags",
};

const fieldErrorMessage = {
    title: "Title cannot be empty",
    text: "Question text cannot be empty",
    tags: "Should have at least one tag"
};

Given('The user has write access to the application', () => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("123456");
    cy.get("#LoginButton").click();
});

When('The user clicks the {string} button', (buttonLabel) => {
    cy.contains(buttonLabel).click();
});

And('fills out the necessary fields', () => {
    fillForm(validQuestion);
});

And('clicks the {string} button', (buttonLabel) => {
    cy.contains(buttonLabel).click();
});

And('fills out the form with an invalid hyperlink in the field {string}', (field) => {
    const questionCopy = { ...validQuestion };
    questionCopy[fieldMap[field]] = "[Netflix](htps://www.netflix)";
    fillForm(questionCopy);
});

And('fills out the form with valid hyperlink in the fields', () => {
    const questionCopy = { ...validQuestion };
    questionCopy[fieldMap["title"]] = "[Netflix](https://www.netflix.com)";
    questionCopy[fieldMap["text"]] = "[Netflix](https://www.netflix.com)";
    fillForm(questionCopy);
});

Then('The user should see the new question in the All Questions page with the metadata information', () => {
    cy.contains("All Questions");
    cy.get(".postTitle").first().should("contain", validQuestion.title);
    cy.contains("user1");
    cy.contains("0 seconds");
});

And('fills out the form with missing {string}', (field) => {
    const questionCopy = { ...validQuestion };
    questionCopy[fieldMap[field]] = "";
    fillForm(questionCopy);
});

Then('The user should see an error for the {string}', (field) => {
    const message = fieldErrorMessage[field];
    cy.contains(message).should("exist");
});

Then('The user should see an error for invalid hyperlink for the {string}', (field) => {
    const message = "Invalid hyperlink";
    cy.contains(message).should("exist");
});

Then('The user should see the new question with hyperlinks in the All Questions page with the metadata information', () => {
    cy.contains("All Questions");
    cy.get(".postTitle").first().should("contain", "[Netflix](https://www.netflix.com)");
    cy.contains("user1");
    cy.contains("0 seconds");
});
