describe('Test page contents', () => {
  it('visit flood map page and assert all components are loaded', () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-cy=app]").should("be.visible");
    cy.get("[data-cy=main-body]").should("be.visible");
    cy.get("[data-cy=flood-map]").should("be.visible");
  })
})