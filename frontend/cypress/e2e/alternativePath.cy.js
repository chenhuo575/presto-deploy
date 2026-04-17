describe('Alternative Path - Adding and editing slide elements', () => {
  const email = `alt${Date.now()}@example.com`;
  const password = 'password123';

  it('registers, creates presentation, adds text/video/code elements, previews, and deletes slide', () => {
    cy.visit('/register');
    cy.get('input[type="email"]').first().type(email);
    cy.get('input[type="text"]').first().type('Alt User');
    cy.get('input[type="password"]').first().type(password);
    cy.get('input[type="password"]').eq(1).type(password);
    cy.get('button').contains(/register|sign up|submit/i).click();
    cy.url().should('include', '/dashboard');
    cy.wait(1000);

    cy.contains('Create New Presentation').click();
    cy.wait(500);
    cy.get('div').contains('Create').parent().parent().find('input[type="text"]').first().type('Element Test');
    cy.contains('button', /^Create$/).click();
    cy.wait(1000);
    cy.contains('Element Test').click();
    cy.wait(1000);

    cy.contains('button', '+ Add Text').click();
    cy.wait(500);
    cy.get('textarea').filter(':visible').first().type('Hello World');
    cy.get('form').filter(':visible').find('button[type="submit"], button').last().click();
    cy.wait(1000);

    cy.contains('button', '+ Add Code').click();
    cy.wait(500);
    cy.get('textarea').filter(':visible').first().type('console.log("hi")');
    cy.get('div').filter(':visible').contains('Add Code').parent().find('button').last().click();
    cy.wait(1000);

    cy.contains('button', '+ New Slide').click();
    cy.wait(500);
    cy.get('button').contains('▶').click();
    cy.wait(500);

    cy.contains('button', '+ Add Video').click();
    cy.wait(500);
    cy.get('input[type="text"]').filter(':visible').first().type('https://www.youtube.com/embed/dQw4w9WgXcQ');
    cy.get('div').filter(':visible').contains('Add Video').parent().find('button').last().click();
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