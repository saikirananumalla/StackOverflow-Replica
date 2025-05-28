import {When, Then} from 'cypress-cucumber-preprocessor/steps';
import "./util/dbSetup";

When("they click the up vote button on the {string}", (post) => {
    if (post === "question") {
        cy.get(".voteCount").eq(0).within(() => {
            cy.get( ".upButton").click();
        });
    } else if (post === "answer") {
        cy.get(".voteCount").eq(2).within(() => {
            cy.get( ".upButton").click();
        });
    } else if (post === "comment") {
        cy.get(".voteCount").eq(3).within(() => {
            cy.get( ".upButton").click();
        });
    }
});

When("they click the down vote button on the {string}", (post) => {
    if (post === "question") {
        cy.get(".voteCount").eq(0).within(() => {
            cy.get( ".downButton").click();
        });
    } else if (post === "answer") {
        cy.get(".voteCount").eq(2).within(() => {
            cy.get( ".downButton").click();
        });
    } else if (post === "comment") {
        cy.get(".voteCount").eq(3).within(() => {
            cy.get( ".downButton").click();
        });
    }
});

When("they click the up vote button on the {string} which the user had down-voted", (post) => {
    if (post === "question") {
        cy.get(".voteCount").eq(0).within(() => {
            cy.get( ".downButton").click();
        });
        cy.get(".voteCount").eq(0).within(() => {
            cy.get( ".upButton").click();
        });
    } else if (post === "answer") {
        cy.get(".voteCount").eq(2).within(() => {
            cy.get( ".downButton").click();
        });
        cy.get(".voteCount").eq(2).within(() => {
            cy.get( ".upButton").click();
        });
    } else if (post === "comment") {
        cy.get(".voteCount").eq(3).within(() => {
            cy.get( ".downButton").click();
        });
        cy.get(".voteCount").eq(3).within(() => {
            cy.get( ".upButton").click();
        });
    }
});

When("they click the down vote button on the {string} which the user had up-voted", (post) => {
    if (post === "question") {
        cy.get(".voteCount").eq(0).within(() => {
            cy.get( ".upButton").click();
        });
        cy.get(".voteCount").eq(0).within(() => {
            cy.get( ".downButton").click();
        });
    } else if (post === "answer") {
        cy.get(".voteCount").eq(2).within(() => {
            cy.get( ".upButton").click();
        });
        cy.get(".voteCount").eq(2).within(() => {
            cy.get( ".downButton").click();
        });
    } else if (post === "comment") {
        cy.get(".voteCount").eq(3).within(() => {
            cy.get( ".upButton").click();
        });
        cy.get(".voteCount").eq(3).within(() => {
            cy.get( ".downButton").click();
        });
    }
});

When("they click the up vote button on the {string} which the user had up-voted", (post) => {
    if (post === "question") {
        cy.get(".voteCount").eq(0).within(() => {
            cy.get( ".upButton").click();
        });
        cy.get(".voteCount").eq(0).within(() => {
            cy.get( ".upButton").click();
        });
    } else if (post === "answer") {
        cy.get(".voteCount").eq(2).within(() => {
            cy.get( ".upButton").click();
        });
        cy.get(".voteCount").eq(2).within(() => {
            cy.get( ".upButton").click();
        });
    } else if (post === "comment") {
        cy.get(".voteCount").eq(3).within(() => {
            cy.get( ".upButton").click();
        });
        cy.get(".voteCount").eq(3).within(() => {
            cy.get( ".upButton").click();
        });
    }
});

When("they click the down vote button on the {string} which the user had down-voted", (post) => {
    if (post === "question") {
        cy.get(".voteCount").eq(0).within(() => {
            cy.get( ".downButton").click();
        });
        cy.get(".voteCount").eq(0).within(() => {
            cy.get( ".downButton").click();
        });
    } else if (post === "answer") {
        cy.get(".voteCount").eq(2).within(() => {
            cy.get( ".downButton").click();
        });
        cy.get(".voteCount").eq(2).within(() => {
            cy.get( ".downButton").click();
        });
    } else if (post === "comment") {
        cy.get(".voteCount").eq(3).within(() => {
            cy.get( ".downButton").click();
        });
        cy.get(".voteCount").eq(3).within(() => {
            cy.get( ".downButton").click();
        });
    }
});

Then("the vote count increases by one for the {string}", (post) => {
    if (post === "question") {
        cy.get(".voteCount").eq(0).should("contain", 12);
    } else if (post === "answer") {
        cy.get(".voteCount").eq(2).should("contain", 2);
    } else if (post === "comment") {
        cy.get(".voteCount").eq(3).should("contain", 21);
    }
});

Then("the vote count increases by two for the {string}", (post) => {
    if (post === "question") {
        cy.get(".voteCount").eq(0).should("contain", 12);
    } else if (post === "answer") {
        cy.get(".voteCount").eq(3).should("contain", 2);
    } else if (post === "comment") {
        cy.get(".voteCount").eq(3).should("contain", 21);
    }
});

Then("the vote count decreases by one for the {string}", (post) => {
    if (post === "question") {
        cy.get(".voteCount").eq(0).should("contain", 10);
    } else if (post === "answer") {
        cy.get(".voteCount").eq(2).should("contain", 0);
    } else if (post === "comment") {
        cy.get(".voteCount").eq(3).should("contain", 19);
    }
});

Then("the vote count decreases by two for the {string}", (post) => {
    if (post === "question") {
        cy.get(".voteCount").eq(0).should("contain", 10);
    } else if (post === "answer") {
        cy.get(".voteCount").eq(2).should("contain", 0);
    } else if (post === "comment") {
        cy.get(".voteCount").eq(3).should("contain", 19);
    }
});

Then("the vote count does not increase for the {string} and an error message is shown: You've already up_voted this answer", (post) => {
    if (post === "question") {
        cy.get(".voteCount").eq(0).should("contain", 12);
    } else if (post === "answer") {
        cy.get(".voteCount").eq(2).should("contain", 2);
    } else if (post === "comment") {
        cy.get(".voteCount").eq(3).should("contain", 21);
    }
    cy.get(".MuiSnackbarContent-message").contains("You've already up_voted this " + post);
});

Then("the vote count does not decrease for the {string} and an error message is shown: You've already down_voted this answer", (post) => {
    if (post === "question") {
        cy.get(".voteCount").eq(0).should("contain", 10);
    } else if (post === "answer") {
        cy.get(".voteCount").eq(2).should("contain", 0);
    } else if (post === "comment") {
        cy.get(".voteCount").eq(3).should("contain", 19);
    }
    cy.get(".MuiSnackbarContent-message").contains("You've already down_voted this " + post);
});

Then("They cannot vote to anything", () => {
    cy.get(".voteCount").should("have.length", 0);
});
