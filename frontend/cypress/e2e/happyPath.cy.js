describe('Happy Path', () => {
  const email = `test${Date.now()}@example.com`;
  const password = 'password123';
  const name = 'Test User';
  const presName = 'My Presentation';

  it('registers, creates presentation, edits, navigates, deletes, logs out and back in', () => {
    cy.visit('/register');
    cy.get('input[type="email"], input[id*="email"], input[name*="email"]').first().type(email);
    cy.get('input').filter((i, el) => el.placeholder?.toLowerCase().includes('name') || el.id?.includes('name') || el.name?.includes('name')).first().type(name);
    cy.get('input[type="password"]').first().type(password);
    cy.get('input[type="password"]').eq(1).type(password);
    cy.get('button').contains(/register|sign up|submit/i).click();
    cy.url().should('include', '/dashboard');
    cy.wait(1000);

    cy.contains('Create New Presentation').click();
    cy.get('input#pres-name').type(presName);
    cy.get('textarea#pres-desc').type('A test description');
    cy.contains('Create').click();
    cy.wait(1000);
    cy.contains(presName).should('be.visible');

    cy.contains(presName).click();
    cy.url().should('include', '/presentation/');
    cy.wait(1000);

    cy.contains('✏').click();
    cy.wait(500);
    cy.get('input').last().clear().type('Updated Title');
    cy.contains('Save').click();
    cy.wait(1000);
    cy.contains('Updated Title').should('be.visible');

    cy.contains('🖼').click();
    cy.wait(500);
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64'),
      fileName: 'thumb.png',
      mimeType: 'image/png',
    });
    cy.contains('Save').click();
    cy.wait(1000);

    cy.contains('+ New Slide').click();
    cy.wait(500);
    cy.contains('+ New Slide').click();
    cy.wait(500);

    cy.contains('▶').click();
    cy.wait(500);
    cy.contains('▶').click();
    cy.wait(500);
    cy.contains('◀').click();
    cy.wait(500);

    cy.contains('Back').click();
    cy.url().should('include', '/dashboard');
    cy.wait(1000);

    cy.contains('Updated Title').click();
    cy.wait(1000);
    cy.contains('Delete Presentation').click();
    cy.wait(500);
    cy.contains('Yes').click();
    cy.url().should('include', '/dashboard');
    cy.wait(1000);

    cy.contains('Logout').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.wait(1000);

    cy.visit('/login');
    cy.get('input[type="email"], input[id*="email"]').first().type(email);
    cy.get('input[type="password"]').first().type(password);
    cy.get('button').contains(/login|sign in|submit/i).click();
    cy.url().should('include', '/dashboard');
  });
});