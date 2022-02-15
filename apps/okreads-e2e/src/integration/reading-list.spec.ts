describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to undo my added book', async () => {
    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();
    cy.get('[data-testing="add-to-reading-list"]:enabled').first().should('exist').click();
    cy.get('.mat-simple-snackbar-action button').click();
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="remove-reading-list"]').should('have.length', 0);
  });

  it('Then: I should be able to undo my removed book', async () => {
    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();
    cy.get('[data-testing="add-to-reading-list"]:enabled').first().should('exist').click();
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="remove-reading-list"]').should('have.length', 1);
    cy.get('[data-testing="remove-reading-list"]').click();
    cy.get('.mat-simple-snackbar-action button').click();
    cy.get('[data-testing="remove-reading-list"]').should('have.length', 1);
  });
});
