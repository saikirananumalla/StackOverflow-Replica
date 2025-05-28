import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import createQuestion, {Q1_TITLE, Q2_TITLE, Q3_TITLE, Q4_TITLE, Q5_TITLE} from "./util/util";
import "./util/dbSetup";
import {CLIENT_URL} from "./util/cypressConstants";

function verifyActiveOrder() {
    const qTitleByActivity = [
        Q1_TITLE,
        Q2_TITLE,
        Q3_TITLE,
        Q4_TITLE,
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", qTitleByActivity[index]);
    });
}

function createAnswer(qtitle, text) {
    cy.contains(qtitle).click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type(text);
    cy.contains("Post Answer").click();
}

// Scenario: Show all questions in active order on user request
//     Given The user can access the homepage "http://localhost:3000"
//     And can see the homepage "All Questions"
//     When The user clicks on the "Active" tab
//     Then The user should see all questions in the database with the most recently posted answers first

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("123456");
    cy.get("#LoginButton").click();
});

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
});

When('The user clicks on the {string} tab', (orderName) => {
    cy.contains(orderName).click();
});

Then('The user should see all questions in the database with the most recently posted answers first', () => {
    verifyActiveOrder();
});

// Scenario Outline: Return to the Active tab after viewing questions in another order
//     Given The user is viewing questions in "<currentOrder>"
//     When The user clicks on the "Active" order
//     Then The user should see all questions in the database with the most recently posted answers first

Given('The user is viewing questions in {string}', (currentOrder) => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("123456");
    cy.get("#LoginButton").click();
    cy.contains(currentOrder).click();
});

When('The user clicks on the {string} order', (orderName) => {
    cy.contains(orderName).click();
});

Then('The user should see all questions in the database with the most recently posted answers first', () => {
    verifyActiveOrder();
});

Given('The user is viewing the homepage {string}', (url) => {
    cy.visit(url);
    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("123456");
    cy.get("#LoginButton").click();
});

When('The user clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
});

And('clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
});

And('clicks on the {string} tab', (tabName) => {
    cy.contains(tabName).click();
});

Then('The user should see all questions in the database with the most recently posted answers first', () => {
    verifyActiveOrder();
});

And('The user has created a new question', () => {
    createQuestion(Q5_TITLE, "Test Question A Text", "javascript");
});

And('answers the new question', () => {
    createAnswer(Q5_TITLE, "abc3");
});

And('The user answers an existing question from the {string} page', (pageName) => {
    cy.contains(pageName).click();
    createAnswer(Q4_TITLE, "abc4");
});

When('The user clicks on the {string} tab in the {string} page', (tabName, pageName) => {
    cy.contains(pageName).click();
    cy.contains(tabName).click();
});

Then('The user should see all questions in the database in new active order', () => {
    const newActiveOrder = [
        Q4_TITLE,
        Q5_TITLE,
        Q1_TITLE,
        Q2_TITLE,
        Q3_TITLE
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", newActiveOrder[index]);
    });
});
