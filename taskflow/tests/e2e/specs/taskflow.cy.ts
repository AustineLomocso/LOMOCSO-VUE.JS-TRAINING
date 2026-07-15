// Core-flow e2e for TaskFlow. Assumes the Vite dev server is running
// (baseUrl http://localhost:5173 from cypress.config.ts): `npm run dev`.
describe('TaskFlow', () => {
  beforeEach(() => {
    // Start each test from a clean slate so seed data is deterministic.
    cy.clearAllLocalStorage();
    cy.visit('/');
  });

  it('shows the Tasks tab with pending seed tasks only', () => {
    cy.contains('ion-title', 'Tasks').should('be.visible');
    // Pending seed task is listed...
    cy.contains('ion-item', 'Build the Tasks tab').should('exist');
    // ...but a completed seed task must NOT appear on the Tasks tab (double-listing fix).
    cy.contains('ion-item', 'Set up the project').should('not.exist');
  });

  it('lists completed tasks on the Completed tab', () => {
    cy.contains('ion-tab-button', 'Completed').click();
    cy.contains('ion-item', 'Set up the project').should('exist');
  });

  it('filters the list with the search bar', () => {
    cy.get('ion-searchbar input').type('Completed');
    cy.contains('ion-item', 'Build the Completed tab').should('exist');
    cy.contains('ion-item', 'Build the Tasks tab').should('not.exist');
  });

  it('surfaces the stats dashboard on Settings', () => {
    cy.contains('ion-tab-button', 'Settings').click();
    cy.contains('Total tasks').should('exist');
    cy.contains('Progress').should('exist');
  });
});
