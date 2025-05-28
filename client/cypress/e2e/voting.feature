Feature: Voting

  As a user of the platform
  I want to up vote or down vote a question, answer and a comment
  So that the most relevant posts are easily highlighted.

  Scenario Outline: User successfully up votes a "<post>" which was previously un-voted by the user
    Given a user is logged in and is viewing a question
    When they click the up vote button on the "<post>"
    Then the vote count increases by one for the "<post>"

    Examples:
      | post |
      | question |
      | answer |
      | comment |

  Scenario Outline: User successfully down votes a "<post>" which was previously un-voted by the user
    Given a user is logged in and is viewing a question
    When they click the down vote button on the "<post>"
    Then the vote count decreases by one for the "<post>"

    Examples:
      | post |
      | question |
      | answer |
      | comment |

  Scenario Outline: User successfully up votes a "<post>" which was previously un-voted by the user
    Given a user is logged in and is viewing a question
    When they click the up vote button on the "<post>"
    Then the vote count increases by one for the "<post>"

    Examples:
      | post |
      | question |
      | answer |
      | comment |

  Scenario Outline: User successfully up votes a "<post>" which was previously down-voted by the user
    Given a user is logged in and is viewing a question
    When they click the up vote button on the "<post>" which the user had down-voted
    Then the vote count increases by two for the "<post>"

    Examples:
      | post |
      | question |
      | answer |
      | comment |

  Scenario Outline: User successfully down votes a "<post>" which was previously up-voted by the user
    Given a user is logged in and is viewing a question
    When they click the down vote button on the "<post>" which the user had up-voted
    Then the vote count decreases by two for the "<post>"

    Examples:
      | post |
      | question |
      | answer |
      | comment |

  Scenario Outline: User cannot up vote a "<post>" which was previously up-voted by the user
    Given a user is logged in and is viewing a question
    When they click the up vote button on the "<post>" which the user had up-voted
    Then the vote count does not increase for the "<post>" and an error message is shown: You've already up_voted this answer

    Examples:
      | post |
      | question |
      | answer |
      | comment |

  Scenario Outline: User cannot down vote a "<post>" which was previously down-voted by the user
    Given a user is logged in and is viewing a question
    When they click the down vote button on the "<post>" which the user had down-voted
    Then the vote count does not decrease for the "<post>" and an error message is shown: You've already down_voted this answer

    Examples:
      | post |
      | question |
      | answer |
      | comment |

  Scenario: User who is not logged cannot vote
    Given a user is not logged in
    Then They cannot vote to anything
