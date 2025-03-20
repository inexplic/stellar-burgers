/// <reference types="cypress" />

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'Bearer test-access-token');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.intercept('POST', '**/api/auth/token', {
      body: {
        success: true,
        accessToken: 'Bearer mock-access-token',
        refreshToken: 'mock-refresh-token'
      }
    }).as('refreshToken');

    cy.visit('/');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Собирает бургер, отправляет заказ и проверяет результат', () => {
    // Добавляем ингредиенты в бургер
    cy.get('[data-cy=select-bun]').contains('Краторная булка N-200i').parent().contains('Добавить').click();
    cy.get('[data-cy=select-main]').contains('Биокотлета из марсианской Магнолии').parent().contains('Добавить').click();
    cy.get('[data-cy=select-sauce]').contains('Соус Spicy-X').parent().contains('Добавить').click();

    // Нажимаем кнопку "Оформить заказ"
    cy.get('[data-cy=order-button]').contains('Оформить заказ').click();

    // Ждём отправки заказа
    cy.wait('@createOrder');

    // Проверяем, что модальное окно заказа открылось
    cy.get('[data-cy=modal]').should('be.visible');

    // Проверяем номер заказа в модальном окне
    cy.get('[data-cy=order-number]').should('contain', '12345');

    // Закрываем модальное окно
    cy.get('[data-cy=modal-close]').click();

    // Проверяем, что модальное окно закрылось
    cy.get('[data-cy=modal]').should('not.exist');

    // Проверяем, что конструктор очистился
    cy.get('[data-cy=constructor-bun-top]').should('not.contain', 'Краторная булка N-200i');
    cy.get('[data-cy=constructor-bun-bottom]').should('not.contain', 'Краторная булка N-200i');
    cy.getIngredients().should('not.contain', 'Биокотлета из марсианской Магнолии');
    cy.getIngredients().should('not.contain', 'Соус Spicy-X');
  });
});
