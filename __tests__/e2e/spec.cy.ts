describe('Navigating', () => {
  it('to a board goes smoothly', () => {
    // Index
    cy.visit('http://localhost:3000');
    cy.contains('✵ Welcome to Tegachan! ✵');
    cy.contains('Random').click();

    // The "Random" board
    cy.url().should('include', 'random');
    cy.contains('✵ Random ✵');
  })
});

describe('Posting', () => {
  const rand = Math.random();
  it('form submits new thread and it can be seen in catalogue', () => {
    cy.visit('http://localhost:3000/dashboard/random');
    cy.intercept('POST', '/api/posts').as('postFormRequest');
    //const rand = Math.random();

    // Find form and post new thread
    cy.contains('Post new thread');
    cy.get('#postForm').should('exist');
    cy.get('[data-testid="postFormTextArea"]').should('exist');
    cy.get('[data-testid="postFormTextArea"]').type(`Cypress posted this thread ${rand}`);
    cy.get('#postBtn').click();

    // 201 = successful creation
    cy.wait('@postFormRequest').its('response.statusCode').should('eq', 201);
    cy.contains(`Cypress posted this thread ${rand}`);
  })

  it('post throttling (anti-spam) works', () => {
    cy.visit('http://localhost:3000/dashboard/random');
    cy.intercept('POST', '/api/posts').as('postFormRequest');

    // Thread's post content is visible and it's clickable
    cy.contains(`Cypress posted this thread ${rand}`).click();

    // Title/content can now be seen, again
    cy.contains(`Cypress posted this thread ${rand}`);

    // Find form and post reply
    cy.contains('Reply', { timeout: 10000 });
    cy.get('#postForm').should('exist');
    cy.get('[data-testid="postFormTextArea"]').should('exist');
    cy.get('[data-testid="postFormTextArea"]').type(`Cypress attempted to reply`);
    cy.get('#postBtn').click();

    // 429 = too many requests
    cy.wait('@postFormRequest').its('response.statusCode').should('eq', 429);

    /* Hold for 30 seconds for post throttling to disable before next test.
      This is necessary because these tests run more slowly on Github Actions
      so making the throttle window smaller (i.e. 2 secs) just for smoother
      testing won't work.
     */
    cy.wait(30000);
  })

  it('form submits new reply', () => {
    cy.visit('http://localhost:3000/dashboard/random');
    cy.intercept('POST', '/api/posts').as('postFormRequest');

    cy.contains(`Cypress posted this thread ${rand}`).click();

    // Find form and post reply
    cy.contains('Reply');
    cy.get('#postForm').should('exist');
    cy.get('[data-testid="postFormTextArea"]').should('exist');
    cy.get('[data-testid="postFormTextArea"]').type(`Cypress posted this reply ${rand}`);
    cy.get('#postBtn').click();

    // 201 = successful creation
    cy.wait('@postFormRequest').its('response.statusCode').should('eq', 201);
    cy.contains(`Cypress posted this reply ${rand}`);
  })
})