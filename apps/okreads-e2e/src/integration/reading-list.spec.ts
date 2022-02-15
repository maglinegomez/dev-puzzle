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

  it('Then: I should see mark as read functionality', () => {
    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();

    //adding book to the reading list
    cy.get('[data-testing="add-to-reading-list"]:enabled').first().should('exist').click();

    //opening reading list
    cy.get('[data-testing="toggle-reading-list"]').click();

    //marking book as finished 
    cy.get('[data-testing="mark-as-read-cta"]').last().should('exist').click();
    cy.get('[data-testing="toggle-reading-list-close"]').click();
    cy.get('[data-testing="add-to-reading-list"]:disabled').first().should('have.text', 'Finished');

    //removing book from the list
    cy.get('[data-testing="toggle-reading-list-close"]').click();
    cy.get('[data-testing="remove-item"]').last().should('exist').click();

    //adding book to the reading list
    cy.get('[data-testing="add-to-reading-list"]:enabled').first().should('exist').click();

    //opening reading list
    cy.get('[data-testing="toggle-reading-list"]').click();

    //For the same book, finished button should be visible
    cy.get('[data-testing="mark-as-read-cta"]').last().should('exist');
  });
});
