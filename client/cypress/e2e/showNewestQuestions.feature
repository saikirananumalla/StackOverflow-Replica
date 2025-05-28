Feature: Show Questions by newest order
  As a user who visits fake stack overflow
  I want to see the most recently asked questions at the top
  So that I can check out the latest activity first

  Scenario: Show all questions in newest order by default
    Given The user is on the homepage
    And can see the homepage "All Questions"
    Then the user should see the "Newest" tab selected by default
    And the questions should be listed with the most recent question on top

  Scenario: Return to newest questions after viewing tags
    Given The user is on the homepage
    When the user navigates to the "Tags" menu
    And returns to the "Questions" menu
    Then the "Newest" tab should be selected
    And the questions should be sorted by newest first

  Scenario: View newest questions after changing sort order
    Given the user is viewing questions sorted by "Active"
    When the user clicks the "Newest" tab
    Then the questions should be listed with the most recent question on top

  Scenario: View newest questions after asking a new question
    Given The user is on the homepage
    And The user has created a new question
    Then the first question should be latest add question
