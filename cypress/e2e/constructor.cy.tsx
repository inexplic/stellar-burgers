/// <reference types="cypress" />

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-cy=constructor-bun-top]').as('bunTop');
    cy.get('[data-cy=constructor-bun-bottom]').as('bunBottom');
    cy.get('[data-cy=select-main]').as('selectMain');
  });

  it('Проверка добавления булки', function () {
    cy.get('@bunTop').should('not.contain', 'Краторная булка N-200i');
    cy.get('@bunBottom').should('not.contain', 'Краторная булка N-200i');
    
    cy.get('[data-cy=select-bun]').contains('Краторная булка N-200i').parent().contains('Добавить').click();
    
    cy.get('@bunTop').should('contain', 'Краторная булка N-200i');
    cy.get('@bunBottom').should('contain', 'Краторная булка N-200i');
});
  
it('Проверка добавления начинки и соуса', function () {
  cy.getIngredients().should('not.contain', 'Биокотлета из марсианской Магнолии');
  cy.getIngredients().should('not.contain', 'Соус Spicy-X');

  cy.get('@selectMain').contains('Биокотлета из марсианской Магнолии').parent().contains('Добавить').click();
  cy.get('[data-cy=select-sauce]').contains('Соус Spicy-X').parent().contains('Добавить').click();

  cy.getIngredients().should('contain', 'Биокотлета из марсианской Магнолии');
  cy.getIngredients().should('contain', 'Соус Spicy-X');
});

it('Открытие модального окна при клике на ингредиент', function () {
  cy.get('@selectMain').contains('Биокотлета из марсианской Магнолии').parent().click();

  cy.get('[data-cy=modal]').should('be.visible');
});

it('Закрытие модального окна при клике на крестик', function () {
  cy.get('@selectMain').contains('Биокотлета из марсианской Магнолии').parent().click();

  cy.get('[data-cy=modal]').should('be.visible').as('modal');

  cy.get('[data-cy=modal-close]').click();

  cy.get('@modal').should('not.exist');
});

it('Закрытие модального окна при клике на оверлей', function () {
  cy.get('@selectMain').contains('Биокотлета из марсианской Магнолии').parent().click();

  cy.get('[data-cy=modal]').should('be.visible').as('modal');

  cy.get('[data-cy=modal-overlay]').click({ force: true });

  cy.get('@modal').should('not.exist');
});
});
