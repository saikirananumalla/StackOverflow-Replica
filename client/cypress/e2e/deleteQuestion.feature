Feature: Deleting a question
  As a mod of Fake Stack Overflow
  I want to delete questions which are breaching TOS.

  Scenario: A mod can delete a question
    Given The mod is on the homepage
    When The user clicks on the question titled "Programmatically navigate using React router"
    And clicks the delete button for the question
    Then The question is deleted and the mod is rerouted to the home page

  Scenario: A user cannot Delete a question
    Given a user is logged in and is viewing a question
    Then No delete icon is shown to the user to delete a question