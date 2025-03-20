/// <reference types="cypress" />

describe('Конструктор бургера', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
      cy.visit('/');
      cy.wait('@getIngredients');
    });

    it('Проверка добавления булки', function () {
      cy.get('[data-cy=constructor-bun-top]').should('not.contain', 'Краторная булка N-200i');
      cy.get('[data-cy=constructor-bun-bottom]').should('not.contain', 'Краторная булка N-200i');
      
      cy.get('[data-cy=select-bun]').contains('Краторная булка N-200i').parent().contains('Добавить').click();
      
      cy.get('[data-cy=constructor-bun-top]').should('contain', 'Краторная булка N-200i');
      cy.get('[data-cy=constructor-bun-bottom]').should('contain', 'Краторная булка N-200i');
  });
    
  it('Проверка добавления начинки и соуса', function () {
    cy.get('[data-cy=constructor-ingredients]').should('not.contain', 'Биокотлета из марсианской Магнолии');
    cy.get('[data-cy=constructor-ingredients]').should('not.contain', 'Соус Spicy-X');
  
    cy.get('[data-cy=select-main]').contains('Биокотлета из марсианской Магнолии').parent().contains('Добавить').click();
    cy.get('[data-cy=select-sauce]').contains('Соус Spicy-X').parent().contains('Добавить').click();
  
    cy.get('[data-cy=constructor-ingredients]').should('contain', 'Биокотлета из марсианской Магнолии');
    cy.get('[data-cy=constructor-ingredients]').should('contain', 'Соус Spicy-X');
  });

  it('Открытие модального окна при клике на ингредиент', function () {
    cy.get('[data-cy=select-main]').contains('Биокотлета из марсианской Магнолии').parent().click();

    cy.get('[data-cy=modal]').should('be.visible');
  });
  
  it('Закрытие модального окна при клике на крестик', function () {
    cy.get('[data-cy=select-main]').contains('Биокотлета из марсианской Магнолии').parent().click();

    cy.get('[data-cy=modal]').should('be.visible');

    cy.get('[data-cy=modal-close]').click();

    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('Закрытие модального окна при клике на оверлей', function () {
    cy.get('[data-cy=select-main]').contains('Биокотлета из марсианской Магнолии').parent().click();

    cy.get('[data-cy=modal]').should('be.visible');

    cy.get('[data-cy=modal-overlay]').click({ force: true });

    cy.get('[data-cy=modal]').should('not.exist');
  });
});


