describe('Alternative Path - Adding and editing slide elements', () => {
  const email = `alt${Date.now()}@example.com`;
  const password = 'password123';

  it('registers, creates presentation, adds text/video/code elements, previews, and deletes slide', () => {
    cy.visit('/register');
    cy.get('#register-email').type(email);
    cy.get('#register-name').type('Alt User');
    cy.get('#register-password').type(password);
    cy.get('#register-confirm-password').type(password);
    cy.get('button').contains(/register|sign up|submit/i).click();
    cy.url().should('include', '/dashboard');
    cy.wait(1000);

    cy.contains('Create New Presentation').click();
    cy.wait(500);
    cy.get('#pres-name').type('Element Test');
    cy.contains('button', /^Create$/).click();
    cy.wait(1000);
    cy.contains('Element Test').click();
    cy.url().should('include', '/presentation/');
    cy.wait(2000);

    // Dismiss any overlay/error popup if present
    cy.get('body').then(($body) => {
      const closeBtn = $body.find('div[style*="z-index: 1000"] button, div[style*="z-index:1000"] button');
      if (closeBtn.length) {
        closeBtn.first().trigger('click');
      }
    });
    cy.wait(500);

    cy.contains('button', '+ Add Text').click({ force: true });
    cy.wait(500);
    cy.get('textarea').filter(':visible').first().type('Hello World');
    cy.contains('button', /^Add$/).click();
    cy.wait(1000);

    cy.contains('button', '+ Add Code').click();
    cy.wait(500);
    cy.get('textarea').filter(':visible').first().type('console.log("hi")');
    cy.contains('button', /^Add$/).click();
    cy.wait(1000);

    cy.contains('button', '+ New Slide').click();
    cy.wait(500);
    cy.get('div[style*="aspect-ratio"]').find('button').contains('◀').click();
    cy.wait(500);
    cy.get('div[style*="aspect-ratio"]').find('button').contains('▶').click();
    cy.wait(500);

    cy.contains('button', '+ Add Video').click();
    cy.wait(500);
    cy.get('input[type="text"]').filter(':visible').first().type('https://www.youtube.com/embed/dQw4w9WgXcQ');
    cy.contains('button', /^Add$/).click();
    cy.wait(1000);

    cy.window().then((win) => {
      cy.stub(win, 'open').as('preview');
    });
    cy.contains('button', 'Preview').click();
    cy.get('@preview').should('have.been.called');

    cy.contains('button', 'Slide Overview').click();
    cy.wait(500);
    cy.contains('Slide 1').click();
    cy.wait(500);

    cy.contains('button', 'Delete Slide').click();
    cy.wait(500);

    cy.contains('button', 'Delete Presentation').click();
    cy.wait(500);
    cy.contains('button', 'Yes').click();
    cy.url().should('include', '/dashboard');
    cy.contains('button', 'Logout').click();
  });
});