describe('Happy Path', () => {
  const email = `test${Date.now()}@example.com`;
  const password = 'password123';
  const name = 'Test User';
  const presName = 'My Presentation';

  it('registers, creates presentation, edits, navigates, deletes, logs out and back in', () => {
    cy.visit('/register');
    cy.get('#register-email').type(email);
    cy.get('#register-name').type(name);
    cy.get('#register-password').type(password);
    cy.get('#register-confirm-password').type(password);
    cy.get('button').contains(/register|sign up|submit/i).click();
    cy.url().should('include', '/dashboard');
    cy.wait(1000);

    cy.contains('Create New Presentation').click();
    cy.wait(500);
    cy.get('#pres-name').type(presName);
    cy.get('#pres-desc').type('A test description');
    cy.contains('button', /^Create$/).click();
    cy.wait(1000);
    cy.contains(presName).should('be.visible');

    cy.contains(presName).click();
    cy.url().should('include', '/presentation/');
    cy.wait(1000);

    cy.contains('button', 'Edit Title').click();
    cy.wait(500);
    cy.get('input[type="text"]').filter(':visible').last().clear().type('Updated Title');
    cy.contains('button', 'Save').click();
    cy.wait(1000);
    cy.contains('Updated Title').should('be.visible');

    cy.contains('button', 'Thumbnail').click();
    cy.wait(500);
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64'),
      fileName: 'thumb.png',
      mimeType: 'image/png',
    });
    cy.wait(1000);
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Cancel")').length) {
        cy.contains('button', 'Cancel').click();
      }
    });
    cy.wait(500);

    cy.contains('+ New Slide').click();
    cy.wait(500);
    cy.contains('+ New Slide').click();
    cy.wait(500);

    cy.get('div[style*="aspect-ratio"]').find('button').contains('◀').click();
    cy.wait(500);
    cy.get('div[style*="aspect-ratio"]').find('button').contains('◀').click();
    cy.wait(500);
    cy.get('div[style*="aspect-ratio"]').find('button').contains('▶').click();
    cy.wait(500);
    cy.get('div[style*="aspect-ratio"]').find('button').contains('▶').click();
    cy.wait(500);
    cy.get('div[style*="aspect-ratio"]').find('button').contains('◀').click();
    cy.wait(500);

    cy.visit('/dashboard');
    cy.wait(1000);

    cy.contains('Updated Title').click();
    cy.wait(1000);
    cy.contains('button', 'Delete Presentation').click();
    cy.wait(500);
    cy.contains('button', 'Yes').click();
    cy.url().should('include', '/dashboard');
    cy.wait(1000);

    cy.contains('button', 'Logout').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.wait(1000);

    cy.visit('/login');
    cy.get('#login-email').type(email);
    cy.get('#login-password').type(password);
    cy.get('button').contains(/login|sign in|submit/i).click();
    cy.url().should('include', '/dashboard');
  });
});