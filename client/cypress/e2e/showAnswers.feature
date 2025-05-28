Feature: Show answers to a question
  As a user browsing fake stack overflow
  I want to view all the answers to a question
  So that I can read the solutions and discussions provided

  Scenario: View answers for an existing question with answers
    Given The user is on the homepage
    When The user clicks on the question titled "Programmatically navigate using React router"
    Then The user should see all the answers for that question
    And The view count should be increased by 1

  Scenario: View answer section for a question with no answers
    Given The user is on the homepage
    And The user posts a new question titled "Question with no answers"
    When The user clicks on the question titled "Question with no answers"
    Then The user should see a message indicating there are no answers yet
