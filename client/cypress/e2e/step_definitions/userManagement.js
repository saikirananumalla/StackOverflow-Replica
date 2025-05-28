import {Given, When, Then, And} from 'cypress-cucumber-preprocessor/steps';
import "./util/dbSetup";
import {CLIENT_URL} from "./util/cypressConstants";

Given("a user is on the register screen and provides a valid email, unique username, and password", () => {
    cy.visit(CLIENT_URL);
    cy.get('#RegisterLink').click();
    cy.get("#formUsername").type("user9");
    cy.get("#formPassword").type("123456");
    cy.get("#formEmail").type("u9@mail.com");
});

Given("a user is on the register screen and tries to register with an already taken username", () => {
    cy.visit(CLIENT_URL);
    cy.get('#RegisterLink').click();

    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("password");
    cy.get("#formEmail").type("u@mail.com");
});

Given("a user is on the register screen and tries to register with an invalid password less than 6 characters", () => {
    cy.visit(CLIENT_URL);
    cy.get('#RegisterLink').click();

    cy.get("#formUsername").type("user5");
    cy.get("#formPassword").type("pass");
    cy.get("#formEmail").type("u5@mail.com");
});

Given("a user is on the register screen and tries to register with an invalid email with improper format", () => {
    cy.visit(CLIENT_URL);
    cy.get('#RegisterLink').click();

    cy.get("#formUsername").type("user5");
    cy.get("#formPassword").type("password");
    cy.get("#formEmail").type("u");
});

Given("a user is on the register screen and tries to register", () => {
    cy.visit(CLIENT_URL);
    cy.get('#RegisterLink').click();
});

Given("a user is on the login screen and provide valid credentials", () => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("123456");
});

Given("a user is on the login screen and tries to login with a non-existing username", () => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user12");
    cy.get("#formPassword").type("123456");
});

Given("a user is on the login screen and tries to login with an invalid password", () => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("123456789");
});

Given("a user is on the login screen and tries to login", () => {
    cy.visit(CLIENT_URL);
});

Given("a user logs in successfully", () => {
    cy.visit(CLIENT_URL);
    cy.get("#formUsername").type("user1");
    cy.get("#formPassword").type("123456");
    cy.get("#LoginButton").click();
});

And("they give details with a missing {string}", (field) => {

    if (field === "password") {
        cy.get("#formUsername").type("user1");
    }
    else if (field === "email") {
        cy.get("#formUsername").type("user1");
        cy.get("#formPassword").type("123456");
    }
    else if (field === "username") {
        cy.get("#formPassword").type("123456");
    }

});

When("they click on the register button", () => {
    cy.get("#RegisterButton").click();
});

When("they click on the login button", () => {
    cy.get("#LoginButton").click();
});

When("they click on the User tab", () => {
    cy.get("#menu_user").click();
});

When("they click on the User tab and clicks on the Logout button", () => {
    cy.get("#menu_user").click();
    cy.get("#logOutButton").click();
});

Then("they are logged in successfully and the home screen is shown", () => {
    cy.get(".postTitle").should("have.length", 4);
});

Then("an error message is displayed: {string}", (errorMessage) => {
    cy.contains(errorMessage);
});

Then("can see their user details", () => {
    cy.contains("user1");
    cy.contains("user1@test.com");
});

Then("the user is logged out", () => {
    cy.contains("Login");
});
