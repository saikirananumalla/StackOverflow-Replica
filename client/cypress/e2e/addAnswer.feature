Feature: Add an answer to a question
  As a user of Fake Stack Overflow
  I want to respond to questions
  So that I can contribute answers to the community

  Scenario: Post a valid answer to a question
    Given The user is on the homepage
    When The user clicks on the question titled "Programmatically navigate using React router"
    And clicks the "Answer Question" button
    And fills in the answer form with valid information
    And clicks the "Post Answer" button
    Then The user should see their answer displayed below the question

  Scenario Outline: Show error when required answer fields are missing
    Given The user is on the homepage
    When The user clicks on the question titled "Programmatically navigate using React router"
    And clicks the "Answer Question" button
    And fills in the answer form with missing "<field>"
    And clicks the "Post Answer" button
    Then The user should see an error message for the "<field>"

    Examples:
      | field    |
      | text     |

  Scenario: Show error when field has invalid hyperlinks
    Given The user has write access to the application
    When The user clicks on the question titled "Programmatically navigate using React router"
    And clicks the "Answer Question" button
    And fills in the answer form with invalid hyperlink
    And clicks the "Post Answer" button
    Then The user should see an error for invalid hyperlink

  Scenario: Show error when field has valid hyperlinks
    Given The user has write access to the application
    When The user clicks on the question titled "Programmatically navigate using React router"
    And clicks the "Answer Question" button
    And fills in the answer form with valid hyperlink
    And clicks the "Post Answer" button
    Then The user should see the new answer with hyperlinks with the metadata information
