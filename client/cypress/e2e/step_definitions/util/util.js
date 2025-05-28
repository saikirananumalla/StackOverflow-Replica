export default function createQuestion(title, text, tag) {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type(title);
    cy.get("#formTextInput").type(text);
    cy.get("#formTagInput").type(tag);
    cy.contains("Post Question").click();
}

// Constants
export const Q1_TITLE = "Programmatically navigate using React router";
export const Q2_TITLE = "android studio save string shared preference, start activity and load the saved string";
export const Q3_TITLE = "Quick question about storage on android";
export const Q4_TITLE = "Object storage for a web application";
export const Q5_TITLE = "Test Question A";