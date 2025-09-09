import { faker } from '@faker-js/faker';
describe('My First Test', () => {
  beforeEach(() => {
	
		cy.visit('/signin');
    cy.intercept('POST', 'http://localhost:3001/login').as('loginRequest');
	});
  //UI Verification Login Page Default State
  it('Verifies All UI Elements are properly displayed', () => {
    cy.get('svg.SignInForm-logo').should('be.visible');
    cy.get('.MuiTypography-h5').should('be.visible').and('have.text', 'Sign in');
    cy.get('#username-label').should('be.visible').and('have.text', 'Username');
    cy.get('[name="username"]').should('be.visible');
    cy.get('#password-label').should('be.visible').and('have.text', 'Password');
    cy.get('[name="password"]').should('be.visible')
    cy.get('[name="remember"]').should('not.be.checked');
    cy.get('.MuiFormControlLabel-root > .MuiTypography-root').should('be.visible').and('have.text', 'Remember me');
    cy.get('button[type="submit"]').should('be.visible').and('be.enabled').and('have.text', 'Sign In');
    cy.get('[data-test="signup"]').should('be.visible').should('have.attr', 'href').and('include', '/signup');
    cy.get('.MuiContainer-root > .MuiTypography-root').should('be.visible').and('have.text', 'Built by');
    cy.get('.MuiContainer-root a').should('be.visible').and('have.attr', 'href');
 

  })
  //Successful Login Test
  it('Visits Real World App Login Page - Succesful Login', () => {
    const username = Cypress.env('username');
    const password = Cypress.env('password');
    cy.get('[name="username"]').should('be.visible').type(username);
    cy.get('[name="password"]').should('be.visible').type(password);
    cy.get('button[type="submit"]').should('be.visible').and('be.enabled').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    
  })
  //Successful Login Test + Remember Me
    it('Visits Real World App Login Page - Remember Me + Succesful Login', () => {
    const username = Cypress.env('username');
    const password = Cypress.env('password');
    cy.get('[name="username"]').should('be.visible').type(username);
    cy.get('[name="password"]').should('be.visible').type(password);
    cy.get('[name="remember"]').should('not.be.checked').click();
    cy.get('button[type="submit"]').should('be.visible').and('be.enabled').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.reload();
    
  })
  //Invalid Password Test
  it('Visits Real World App Login Page - Invalid Password', () => {
    const randomPassword = faker.internet.password();
    const username = Cypress.env('username');
    cy.get('[name="username"]').should('be.visible').type(username);
    cy.get('[name="password"]').should('be.visible').type(randomPassword);
    cy.get('button[type="submit"]').should('be.visible').and('be.enabled').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    cy.get('[data-test="signin-error"]').should('be.visible');
  })
  //Valid Password and Invalid Username Test
  it('Visits Real World App Login Page - Negative - Valid Password and Invalid Username', () => {
    const randomUsername = faker.internet.username();
    const password = Cypress.env('password');
    cy.get('[name="username"]').should('be.visible').type(randomUsername);
    cy.get('[name="password"]').should('be.visible').type(password);
    cy.get('button[type="submit"]').should('be.visible').and('be.enabled').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    cy.get('[data-test="signin-error"]').should('be.visible');
  })
  //Empty Username and Password Test - No request is sent to BE
  it('Visits Real World App Login Page - Negative - Empty Username and Password', () => {
    cy.get('[name="username"]').should('be.visible');
    cy.get('[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('be.enabled').click();
    cy.get('@loginRequest.all').should('have.length', 0);
    
  })
})