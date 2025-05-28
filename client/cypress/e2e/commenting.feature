Feature: Commenting on posts

  As a user of the platform
  I want to add comments to answers and questions
  As a mod of the platform
  I want to delete comments which breach TOS

  Scenario Outline: User successfully adds a comment to a "<post>"
    Given a user is logged in and is viewing a question
    When they type a comment to the "<post>" and submit it
    Then the comment is added to the "<post>" and displayed below the question

    Examples:
      | post |
      | answer |
      | question |

  Scenario Outline: User cannot post an empty comment to a  "<post>"
    Given a user is logged in and is viewing a question
    When they give an empty comment to the "<post>" and submit it
    Then an comment error message is displayed: Comment text cannot be empty

    Examples:
      | post |
      | answer |
      | question |

  Scenario Outline: A mod can delete any comment under any "<post>"
    Given a mod is logged in and is viewing a question
    When they choose to delete a comment under a "<post>"
    Then the comment is removed from the "<post>"

    Examples:
      | post |
      | answer |
      | question |

  Scenario Outline: User successfully adds a comment to a "<post>" with valid hyperlinks
    Given a user is logged in and is viewing a question
    When they type a comment to the "<post>" and submit it with valid hyperlinks
    Then the comment with hyperlink is added to the "<post>" and displayed below the question

    Examples:
      | post |
      | answer |
      | question |

  Scenario Outline: User cannot post a comment to a  "<post>" with invalid hyperlinks
    Given a user is logged in and is viewing a question
    When they type a comment to the "<post>" and submit it with invalid hyperlinks
    Then an comment error message is displayed: Invalid Hyperlink

    Examples:
      | post |
      | answer |
      | question |

  Scenario: User who is not logged cannot post comments
    Given a user is not logged in
    Then They cannot add a comment to anything
