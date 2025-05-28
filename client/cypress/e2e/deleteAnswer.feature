Feature: Deleting an answer to a question
  As a mod of Fake Stack Overflow
  I want to delete answers under questions which are breaching TOS

  Scenario: A mod can delete an answer to a question
    Given The mod is on the homepage
    When The user clicks on the question titled "Programmatically navigate using React router"
    And clicks the delete button for an answer
    Then The answer is deleted and the mod should not see the answer displayed below the question

  Scenario: A user cannot Delete an answer to a question
    Given a user is logged in and is viewing a question
    Then No delete icon is shown to the user to delete an answer