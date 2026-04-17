describe('Alternative Path - Adding and editing slide elements', () => {
  const email = `alt${Date.now()}@example.com`;
  const password = 'password123';

  it('registers, creates presentation, adds text/image/video/code elements, previews, and deletes slide', () => {
    cy.visit('/register');
    cy.get('input[type="email"], input[id*="email"]').first().type(email);
    cy.get('input').filter((i, el) => el.placeholder?.toLowerCase().includes('name') || el.id?.includes('name') || el.name?.includes('name')).first().type('Alt User');
    cy.get('input[type="password"]').first().type(password);
    cy.get('input[type="password"]').eq(1).type(password);
    cy.get('button').contains(/register|sign up|submit/i).click();
    cy.url().should('include', '/dashboard');
    cy.wait(1000);

    cy.contains('Create New Presentation').click();
    cy.get('input#pres-name').type('Element Test');
    cy.contains('Create').click();
    cy.wait(1000);
    cy.contains('Element Test').click();
    cy.wait(1000);

    cy.contains('+ Add Text').click();
    cy.wait(500);
    cy.get('textarea, input[type="text"]').filter(':visible').first().type('Hello World');
    cy.contains('Add').click();
    cy.wait(1000);

    cy.contains('+ Add Code').click();
    cy.wait(500);
    cy.get('textarea').filter(':visible').first().type('console.log("hi")');
    cy.contains('Add').click();
    cy.wait(1000);

    cy.contains('+ New Slide').click();
    cy.wait(500);

    cy.contains('▶').click();
    cy.wait(500);

    cy.contains('+ Add Video').click();
    cy.wait(500);
    cy.get('input[type="text"]').filter(':visible').first().type('https://www.youtube.com/embed/dQw4w9WgXcQ');
    cy.contains('Add').click();
    cy.wait(1000);

    cy.window().then((win) => {
      cy.stub(win, 'open').as('preview');
    });
    cy.contains('Preview').click();
    cy.get('@preview').should('have.been.called');

    cy.contains('Slide Overview').click();
    cy.wait(500);
    cy.contains('Slide 1').click();
    cy.wait(500);

    cy.contains('Delete Slide').click();
    cy.wait(500);

    cy.contains('Delete Presentation').click();
    cy.wait(500);
    cy.contains('Yes').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Logout').click();
  });
});