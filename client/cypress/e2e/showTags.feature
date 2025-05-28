Feature: Show tags in the system
  As a user of fake stack overflow
  I want to view all tags and the number of questions linked to each
  So that I can explore questions by topic

  Scenario: Display all tags and their associated question count
    Given The user is on the homepage
    When The user clicks on the "Tags" menu item
    Then The user should see all tags
    And Each tag should show the number of questions linked to it

  Scenario: Tags get updated after posting a question with new tag
    Given The user is on the homepage
    And The user posts a question with tag "bdd-new"
    When The user clicks on the "Tags" menu item
    Then The user should see the tag "bdd-new"
    And It should show 1 question linked to it

  Scenario: Clicking on a tag shows related questions
    Given The user is on the homepage
    And The user posts a question with tag "react-testing"
    When The user clicks on the "Tags" menu item
    And The user clicks on the tag named "react-testing"
    Then The user should see only questions tagged with "react-testing"
