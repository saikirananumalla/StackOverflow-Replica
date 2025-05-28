Feature: User Management
  As a potential user for the platform
  I want to signup and login to the platform

  Scenario: User successfully creates an account
    Given a user is on the register screen and provides a valid email, unique username, and password
    When they click on the register button
    Then they are logged in successfully and the home screen is shown

  Scenario: User cannot create an account with an existing username
    Given a user is on the register screen and tries to register with an already taken username
    When they click on the register button
    Then an error message is displayed: "Please ensure your password is more than 6 characters, and email address is valid. If both the above are true, try with a different username"

  Scenario: User cannot create an account with an invalid password
    Given a user is on the register screen and tries to register with an invalid password less than 6 characters
    When they click on the register button
    Then an error message is displayed: "Please ensure your password is more than 6 characters, and email address is valid. If both the above are true, try with a different username"

  Scenario: User cannot create an account with an invalid email
    Given a user is on the register screen and tries to register with an invalid email with improper format
    When they click on the register button
    Then an error message is displayed: "Please ensure your password is more than 6 characters, and email address is valid. If both the above are true, try with a different username"

  Scenario Outline: User cannot create an account while not providing valid details
    Given a user is on the register screen and tries to register
    And they give details with a missing "<field>"
    When they click on the register button
    Then an error message is displayed: "Please ensure your password is more than 6 characters, and email address is valid. If both the above are true, try with a different username"

    Examples:
      | field    |
      | username |
      | password |
      | email    |

  Scenario: User can login
    Given a user is on the login screen and provide valid credentials
    When they click on the login button
    Then they are logged in successfully and the home screen is shown

  Scenario: User cannot login with a non-existing username
    Given a user is on the login screen and tries to login with a non-existing username
    When they click on the login button
    Then an error message is displayed: "Invalid username or password, please retry"

  Scenario: User cannot login with an invalid password
    Given a user is on the login screen and tries to login with an invalid password
    When they click on the login button
    Then an error message is displayed: "Invalid username or password, please retry"

  Scenario Outline: user tries to login with an invalid form
    Given a user is on the login screen and tries to login
    And they give details with a missing "<field>"
    When they click on the login button
    Then an error message is displayed: "Invalid username or password, please retry"

    Examples:
      | field    |
      | username |
      | password |

  Scenario: User can view their information on the User Tab
    Given a user logs in successfully
    When they click on the User tab
    Then can see their user details

  Scenario: User can logout
    Given a user logs in successfully
    When they click on the User tab and clicks on the Logout button
    Then the user is logged out
