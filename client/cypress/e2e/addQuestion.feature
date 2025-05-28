Feature: Adding new questions
  As a user with write access to Fake Stack Overflow
  I want to add a new question to the application
  So that I can ask a question to the community

  Scenario: Add a new question successfully
    Given The user has write access to the application
    When The user clicks the "Ask a Question" button
    And fills out the necessary fields
    And clicks the "Post Question" button
    Then The user should see the new question in the All Questions page with the metadata information

  Scenario Outline: Show error when required fields are missing
    Given The user has write access to the application
    When The user clicks the "Ask a Question" button
    And fills out the form with missing "<field>"
    And clicks the "Post Question" button
    Then The user should see an error for the "<field>"

    Examples:
      | field    |
      | title    |
      | text     |
      | tags     |

  Scenario Outline: Show error when fields have invalid hyperlinks
    Given The user has write access to the application
    When The user clicks the "Ask a Question" button
    And fills out the form with an invalid hyperlink in the field "<field>"
    And clicks the "Post Question" button
    Then The user should see an error for invalid hyperlink for the "<field>"

    Examples:
      | field    |
      | title    |
      | text     |

  Scenario: Show error when fields have valid hyperlinks
    Given The user has write access to the application
    When The user clicks the "Ask a Question" button
    And fills out the form with valid hyperlink in the fields
    And clicks the "Post Question" button
    Then The user should see the new question with hyperlinks in the All Questions page with the metadata information
