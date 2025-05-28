Feature: Show unanswered questions
  As a user browsing fake stack overflow
  I want to view all questions that have no answers
  So that I can help answer them or find open issues to explore

  Scenario: Show no questions when there are no unanswered ones
    Given The user is on the homepage
    When The user clicks on the "Unanswered" tab
    Then The user should see a message indicating there are no unanswered questions

  Scenario: Show newly added question in the unanswered list and answering it should remove it from list
    Given The user is on the homepage
    And The user has posted a new question titled "Unanswered Test Question"
    When The user clicks on the "Unanswered" tab
    Then The user should see the question titled "Unanswered Test Question"
    And The user answers the question titled "Unanswered Test Question"
    When The user clicks on the "Unanswered" tab
    Then The question titled "Unanswered Test Question" should not appear in the list
