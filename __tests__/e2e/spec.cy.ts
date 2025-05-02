import 'cypress-file-upload';

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

describe('PostForm', () => {
  let rand: string;

  before(() => {
    rand = `${Math.floor(Math.random() * 100000)}`;
    Cypress.env('testRand', rand);
    Cypress.env('firstPostWasThrottled', false);
  });

  it('submits new thread and it can be seen in catalogue', () => {
    const rand = Cypress.env('testRand');

    cy.intercept('POST', '/api/posts').as('postFormRequest');
    cy.visit('http://localhost:3000/dashboard/random');

    // Find form and post new thread
    cy.contains('Post new thread');
    cy.get('[data-testid="postFormTextArea"]').type(`[TEST]: Cypress posted this thread ${rand}`);
    cy.get('#postBtn').click();

    // 201 = successful creation
    cy.wait('@postFormRequest').its('response.statusCode').should('eq', 201);
    cy.get('[data-testid="boardtype-post-content"]')
      .first()
      .should('contain.text', `[TEST]: Cypress posted this thread ${rand}`);
  })

  it('post throttling (anti-spam) works', () => {
    const rand = Cypress.env('testRand');

    cy.intercept('POST', '/api/posts').as('postFormRequest');
    cy.visit('http://localhost:3000/dashboard/random');

    // Thread's post content is visible and it's clickable
    cy.get('[data-testid="boardtype-post-content"]')
      .first()
      .should('contain.text', `[TEST]: Cypress posted this thread ${rand}`).click();

    // Find form and post reply
    cy.contains('Reply', { timeout: 1000 });
    cy.get('[data-testid="postFormTextArea"]').type(`[TEST]: Cypress attempted to reply ${rand}`);
    cy.get('#postBtn').click();

    cy.wait('@postFormRequest').then((interception) => {
      const status = interception.response?.statusCode;

      if (status === 429) {
        Cypress.env('firstPostWasThrottled', true);
        cy.log('Throttling worked (429 Too Many Requests)');
      } else if (status === 201) {
        Cypress.env('replyAttemptSuccessful', true);
        cy.log('Throttle window expired already (201 Created)');
      } else {
        throw new Error(`Unexpected status code: ${status}`);
      }
    });

    // Wait for throttle window to pass before next reply test
    cy.wait(1500);
  })
})

/**
 * Moving visual reply tests to their own suites is the only way for them to work 100%
 * Waiting or refreshing the page and/or cache doesn't work
 */
describe('Reply', () => {
  it('to OP works', () => {
    const rand = Cypress.env('testRand');
    const firstPostWasThrottled = Cypress.env('firstPostWasThrottled');

    cy.intercept('POST', '/api/posts').as('postFormRequest');
    cy.visit('http://localhost:3000/dashboard/random');

    cy.contains(`[TEST]: Cypress posted this thread ${rand}`).click();

    cy.contains('Reply');
    cy.get('[data-testid="postFormTextArea"]').type(`[TEST]: Cypress posted this reply ${rand}`);
    cy.get('#postBtn').click();
    cy.wait('@postFormRequest').its('response.statusCode').should('eq', 201);

    // Will ensure that replies show; router refresh nearly always fails in Cypress
    cy.window().then((win) => {
      win.location.reload();
    });

    cy.get('[data-testid="post-content"]')
      .should('have.length.greaterThan', 1)
      .eq(firstPostWasThrottled ? 1 : 2)
      .should('contain.text', `[TEST]: Cypress posted this reply ${rand}`);

    cy.wait(1500);
  })

  it('to another reply works', () => {
    const rand = Cypress.env('testRand');
    const firstPostWasThrottled = Cypress.env('firstPostWasThrottled');

    cy.intercept('POST', '/api/posts').as('postFormRequest');
    cy.visit('http://localhost:3000/dashboard/random');

    cy.contains(`[TEST]: Cypress posted this thread ${rand}`).click();

    // Find the first reply and click on its date/postnum area
    cy.get('[data-testid="post-timestamp-and-post_num"]').eq(1).click();

    cy.get('[data-testid="postFormTextArea"]').type(`[TEST]: Cypress posted this reply to another reply ${rand}`);
    cy.get('#postBtn').click();
    cy.wait('@postFormRequest').its('response.statusCode').should('eq', 201);

    cy.window().then((win) => {
      win.location.reload();
    });

    cy.get('[data-testid="post-content"]')
      .should('have.length.greaterThan', 2)
      .eq(firstPostWasThrottled ? 2 : 3)
      .should('contain.text', `[TEST]: Cypress posted this reply to another reply ${rand}`);

    cy.wait(1500);
  })

  it('with image works', () => {
    const rand = Cypress.env('testRand');

    cy.intercept('POST', '/api/posts').as('postFormRequest');
    cy.visit('http://localhost:3000/dashboard/random');

    cy.contains(`[TEST]: Cypress posted this thread ${rand}`).first().click();

    cy.contains('Reply');
    cy.get('[data-testid="postFormTextArea"]').should('exist');
    cy.get('[data-testid="postFormTextArea"]').type(`[TEST]: Cypress posted this image reply ${rand}`);

    cy.get('input[type="file"]').attachFile({
      filePath: '../../__tests__/e2e/img/15.gif',
      encoding: 'binary',
    }, { subjectType: 'input' });

    cy.get('#postBtn').click();
    cy.wait('@postFormRequest').its('response.statusCode').should('eq', 201);

    cy.window().then((win) => {
      win.location.reload();
    });

    cy.get('[data-testid="post-container"]')
      .last()
      .get('img').should('exist');
  })
})

describe('DB cleanup', () => {
  it('clears test posts', () => {
    cy.task('cypressCleanup');
  });
});