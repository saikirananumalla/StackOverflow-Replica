### Instructions to test the deployed application on Render

To test the application on Render, head on to https://frontend-server-fso.onrender.com
Backend API: https://backend-server-fso.onrender.com/api-docs/

You will be on the login page of the platform now (it might take sometime for the server to spin back up)
You can register using a unique username, password and an email
Now, you can view questions, tags and the user tabs on the side bar,
You can do the usual search with keyword, tags and also set the question order on the home screen
You can go to the tags page and view teh number of questions under each tag.
You can view the user information on the user tab (and also logout from here)
You can create a question using the "Ask a Question" button on the home page.
You need to provide valid details on the create question screen to successfully create a question
You can click on a question to view its metadata, answers and other voting details
On this page, we can add comments to questions and answers (must be valid)
We can vote for questions, answers and comments.

### Instructions to run the jest and cypress test cases.

To run jest tests, cd to the server directory and run the following command - "npx jest --coverage".

While we have aimed for comprehensive test coverage across controllers, services, routes, and utility functions, achieving 100% coverage was not fully possible due to the following pragmatic reasons:
Mongoose Static & Pre-Hook Logic

Certain logic within Mongoose model static methods and middleware hooks (e.g., pre("deleteOne"), pre("deleteMany")) are inherently bound to database lifecycle behaviors and depend on internal query state. These are hard to trigger deterministically in unit tests without deep integration or end-to-end setups.
Third-Party Middleware Integration

Modules like express-openapi-validator, lusca for CSRF protection, and express-session introduce layers that are either already well-tested externally or require complex environment mocking. Testing those lines would duplicate well-established behavior from trusted libraries.
Logger and Error Fallbacks

In places like catch blocks or error logging (log4js), we’ve included defensive code for robustness. However, those lines only execute during rare or artificial edge cases and don't affect critical application logic.
Express Custom Error Handler

The final error handler middleware is triggered only when an unhandled exception bubbles up from somewhere else in the stack. Testing it in isolation would involve simulating full request failure chains, which goes beyond the unit test scope and ventures into integration testing.

Despite these limitations, all core business logic, REST endpoints, request validation, and error scenarios have been rigorously tested to ensure functional correctness, reliability, and maintainability. We believe the current coverage strikes the right balance between test depth and developer efficiency, without introducing unnecessary test complexity for edge case coverage.

To run cypress tests:
1. Run mongo locally.
2. Run client and server locally (doing npm install and npm start on both the client and the server). cd to server and execute npm install and npm start.
3. In the client directory, use the command "npx cypress run" to run the cypress tests.

### Instructions to generate the coverage report for jest tests.

To run jest tests, cd to the server directory and run the following command.
This will generate the coverage report at location - /server/coverage/lcov-report/index.html

In terminal, run the command - "npx jest --coverage"

### Instructions to generate the CodeQL report for your application's server.

To create the database:

codeql database create database --language=javascript-typescript --overwrite

To generate the report 

codeql database analyze database --format="sarif-latest" --output report.sarif

A generated report can be found at the root of this project.


### Instructions to set environment variables that one may need to run any scripts or tests.

To run the application, head on this google doc and get the following secret:
https://docs.google.com/document/d/1ell89HxCoBIOhPQS6Gvtmvk6OWZoeL5j6jwfldgzKmU/edit?usp=sharing

Create a file called .env (in server/) and paste and the contents in the newly created file
