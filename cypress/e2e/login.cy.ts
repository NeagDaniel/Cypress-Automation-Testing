import { faker } from '@faker-js/faker';
import { LOGIN_TEST_IDS } from '../support/TestID/login';
describe('My First Test', () => {
  beforeEach(() => {
	
		cy.visit('/signin');
    cy.intercept('POST', 'http://localhost:3001/login').as('loginRequest');
	});
  //UI Verification Login Page Default State
  it('Verifies All UI Elements are properly displayed', () => {
    cy.get(LOGIN_TEST_IDS.LOGO).should('be.visible');
    cy.get(LOGIN_TEST_IDS.PAGE_TITLE).should('be.visible').and('have.text', 'Sign in');
    cy.get(LOGIN_TEST_IDS.USERNAME_LABEL).should('be.visible').and('have.text', 'Username');
    cy.get(LOGIN_TEST_IDS.USERNAME_INPUT).should('be.visible');
    cy.get(LOGIN_TEST_IDS.PASSWORD_LABEL).should('be.visible').and('have.text', 'Password');
    cy.get(LOGIN_TEST_IDS.PASSWORD_INPUT).should('be.visible')
    cy.get(LOGIN_TEST_IDS.REMEMBER_ME_CHECKBOX).should('not.be.checked');
    cy.get(LOGIN_TEST_IDS.REMEMBER_ME_LABEL).should('be.visible').and('have.text', 'Remember me');
    cy.get(LOGIN_TEST_IDS.SUBMIT_BUTTON).should('be.visible').and('be.enabled').and('have.text', 'Sign In');
    cy.get(LOGIN_TEST_IDS.SIGNUP_LINK).should('be.visible').should('have.attr', 'href').and('include', '/signup');
    cy.get(LOGIN_TEST_IDS.BUILT_BY_TEXT).should('be.visible').and('have.text', 'Built by');
    cy.get(LOGIN_TEST_IDS.BUILT_BY_LINK).should('be.visible').and('have.attr', 'href');
 

  })
  //Successful Login Test
  it('Visits Real World App Login Page - Succesful Login', () => {
    const username = Cypress.env('username');
    const password = Cypress.env('password');
    cy.get(LOGIN_TEST_IDS.USERNAME_INPUT).should('be.visible').clear().type(username);
    cy.get(LOGIN_TEST_IDS.PASSWORD_INPUT).should('be.visible').clear().type(password);
    cy.get(LOGIN_TEST_IDS.SUBMIT_BUTTON).should('be.visible').and('be.enabled').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    
  })
  //Successful Login Test + Remember Me
    it('Visits Real World App Login Page - Remember Me + Succesful Login', () => {
    const username = Cypress.env('username');
    const password = Cypress.env('password');
    cy.get(LOGIN_TEST_IDS.USERNAME_INPUT).should('be.visible').clear().type(username);
    cy.get(LOGIN_TEST_IDS.PASSWORD_INPUT).should('be.visible').clear().type(password);
    cy.get(LOGIN_TEST_IDS.REMEMBER_ME_CHECKBOX).should('not.be.checked').click();
    cy.get(LOGIN_TEST_IDS.SUBMIT_BUTTON).should('be.visible').and('be.enabled').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.reload();
    
  })
  //Invalid Password Test
  it('Visits Real World App Login Page - Invalid Password', () => {
    const randomPassword = faker.internet.password();
    const username = Cypress.env('username');
    cy.get(LOGIN_TEST_IDS.USERNAME_INPUT).should('be.visible').clear().type(username);
    cy.get(LOGIN_TEST_IDS.PASSWORD_INPUT).should('be.visible').clear().type(randomPassword);
    cy.get(LOGIN_TEST_IDS.SUBMIT_BUTTON).should('be.visible').and('be.enabled').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    cy.get(LOGIN_TEST_IDS.ERROR_MESSAGE).should('be.visible');
  })
  //Valid Password and Invalid Username Test
  it('Visits Real World App Login Page - Negative - Valid Password and Invalid Username', () => {
    const randomUsername = faker.internet.username();
    const password = Cypress.env('password');
    cy.get(LOGIN_TEST_IDS.USERNAME_INPUT).should('be.visible').clear().type(randomUsername);
    cy.get(LOGIN_TEST_IDS.PASSWORD_INPUT).should('be.visible').clear().type(password);
    cy.get(LOGIN_TEST_IDS.SUBMIT_BUTTON).should('be.visible').and('be.enabled').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    cy.get(LOGIN_TEST_IDS.ERROR_MESSAGE).should('be.visible');
  })
  //Empty Username and Password Test - No request is sent to BE
  it('Visits Real World App Login Page - Negative - Empty Username and Password', () => {
    cy.get(LOGIN_TEST_IDS.USERNAME_INPUT).should('be.visible');
    cy.get(LOGIN_TEST_IDS.PASSWORD_INPUT).should('be.visible');
    cy.get(LOGIN_TEST_IDS.SUBMIT_BUTTON).should('be.visible').and('be.enabled').click();
    cy.get('@loginRequest.all').should('have.length', 0);
    
  })

  //Individual Key Events Tests - Demonstrates cy.press() with supported Cypress.Keyboard.Keys
  
  it('Keyboard Navigation - TAB Key Forward Navigation', () => {
    const username = Cypress.env('username');
    const password = Cypress.env('password');
    
    // Start with username field and type
    cy.get(LOGIN_TEST_IDS.USERNAME_INPUT).should('be.visible').focus().clear();
    cy.get(LOGIN_TEST_IDS.USERNAME_INPUT).type(username);
    cy.get(LOGIN_TEST_IDS.USERNAME_INPUT).should('have.value', username);
    
    // Navigate to password field using TAB
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.get(LOGIN_TEST_IDS.PASSWORD_INPUT).should('be.focused').clear();
    cy.get(LOGIN_TEST_IDS.PASSWORD_INPUT).type(password);
    cy.get(LOGIN_TEST_IDS.PASSWORD_INPUT).should('have.value', password);
    
    // Navigate to remember me checkbox using TAB
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.get(LOGIN_TEST_IDS.REMEMBER_ME_CHECKBOX).should('be.focused');
    
    // Navigate to submit button using TAB
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.get(LOGIN_TEST_IDS.SUBMIT_BUTTON).should('be.focused');
  })

  it('Keyboard Navigation - SPACE Key for Checkbox Toggle', () => {
    // Focus on remember me checkbox
    cy.get(LOGIN_TEST_IDS.REMEMBER_ME_CHECKBOX).focus();
    cy.get(LOGIN_TEST_IDS.REMEMBER_ME_CHECKBOX).should('be.focused');
    
    // Toggle checkbox on using SPACE
    cy.press(Cypress.Keyboard.Keys.SPACE);
    cy.get(LOGIN_TEST_IDS.REMEMBER_ME_CHECKBOX).should('be.checked');
    
    // Toggle checkbox off using SPACE
    cy.press(Cypress.Keyboard.Keys.SPACE);
    cy.get(LOGIN_TEST_IDS.REMEMBER_ME_CHECKBOX).should('not.be.checked');
  })

  it('Keyboard Navigation - Complete Login Workflow', () => {
    const username = Cypress.env('username');
    const password = Cypress.env('password');
    
    // Complete login using only keyboard navigation
    cy.get(LOGIN_TEST_IDS.USERNAME_INPUT).should('be.visible').focus().clear();
    cy.get(LOGIN_TEST_IDS.USERNAME_INPUT).type(username); // Type username
    cy.press(Cypress.Keyboard.Keys.TAB); // Move to password
    cy.get(LOGIN_TEST_IDS.PASSWORD_INPUT).should('be.focused').clear();
    cy.get(LOGIN_TEST_IDS.PASSWORD_INPUT).type(password); // Type password
    cy.press(Cypress.Keyboard.Keys.TAB); // Move to remember me
    cy.press(Cypress.Keyboard.Keys.SPACE); // Check remember me
    cy.press(Cypress.Keyboard.Keys.TAB); // Move to submit button
    cy.get(LOGIN_TEST_IDS.SUBMIT_BUTTON).should('be.visible').and('be.focused');
    // Use type() with ENTER character to trigger form submission
    cy.get(LOGIN_TEST_IDS.SUBMIT_BUTTON).type('{enter}');
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
  })
})