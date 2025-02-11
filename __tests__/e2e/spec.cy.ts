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

  it('form submits new reply', () => {
    cy.visit('http://localhost:3000/dashboard/random');
    cy.intercept('POST', '/api/posts').as('postFormRequest');

    // Thread's post content is visible and it's clickable
    cy.contains(`Cypress posted this thread ${rand}`).click();
    
    // Title/content can now be seen, again
    cy.contains(`Cypress posted this thread ${rand}`);

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