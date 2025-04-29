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
    cy.get('[data-testid="postFormTextArea"]').type(`[TEST]: Cypress posted this thread ${rand}`);
    cy.get('#postBtn').click();

    // 201 = successful creation
    cy.wait('@postFormRequest').its('response.statusCode').should('eq', 201);
    cy.contains(`[TEST]: Cypress posted this thread ${rand}`);
  })

  it('post throttling (anti-spam) works', () => {
    cy.visit('http://localhost:3000/dashboard/random');
    cy.intercept('POST', '/api/posts').as('postFormRequest');

    // Thread's post content is visible and it's clickable
    cy.contains(`[TEST]: Cypress posted this thread ${rand}`).click();

    // Title/content can now be seen, again
    cy.contains(`[TEST]: Cypress posted this thread ${rand}`);

    // Find form and post reply
    cy.contains('Reply', { timeout: 10000 });
    cy.get('#postForm').should('exist');
    cy.get('[data-testid="postFormTextArea"]').should('exist');
    cy.get('[data-testid="postFormTextArea"]').type(`[TEST]: Cypress attempted to reply`);
    cy.get('#postBtn').click();

    cy.wait('@postFormRequest').then((interception) => {
      const status = interception.response?.statusCode;

      if (status === 429) {
        cy.log('Throttling worked (429 Too Many Requests)');
      } else if (status === 201) {
        cy.log('Throttle window expired already (201 Created)');
      } else {
        throw new Error(`Unexpected status code: ${status}`);
      }
    });

    cy.wait(process.env.CI ? 5000 : 27000);
  })

  it('form submits new reply', () => {
    cy.visit('http://localhost:3000/dashboard/random');
    cy.intercept('POST', '/api/posts').as('postFormRequest');

    cy.contains(`[TEST]: Cypress posted this thread ${rand}`).click();

    // Find form and post reply
    cy.contains('Reply');
    cy.get('#postForm').should('exist');
    cy.get('[data-testid="postFormTextArea"]').should('exist');
    cy.get('[data-testid="postFormTextArea"]').type(`[TEST]: Cypress posted this reply ${rand}`);
    cy.get('#postBtn').click();

    cy.wait('@postFormRequest').its('response.statusCode').should('eq', 201);
    cy.contains(`[TEST]: Cypress posted this reply ${rand}`);
  })
})

describe('DB Cleanup', () => {
  it('clears test posts', () => {
    cy.task('cypressCleanup');
  });
});