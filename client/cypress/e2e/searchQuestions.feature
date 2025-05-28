Feature: Search for questions
  As a user of Fake Stack Overflow
  I want to search for questions using keywords or tags
  So that I can quickly find relevant content

  Scenario: Search questions using a keyword
    Given The user is on the homepage
    When The user enters "react" in the search bar and submits
    Then The user should see only questions with titles or content matching "react"

  Scenario: Search questions using a tag
    Given The user is on the homepage
    When The user enters "[storage]" in the search bar and submits
    Then The user should see only questions tagged with "storage"

  Scenario: Search with no matching results
    Given The user is on the homepage
    When The user enters "sai-kiran-anumalla" in the search bar and submits
    Then The user should see a message indicating that no questions were found
