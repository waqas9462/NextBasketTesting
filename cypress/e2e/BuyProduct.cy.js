/// <reference types = 'cypress'/>

describe('Buy a product', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/')
    cy.url().should('include', 'teststoreforsouthafri.nextbasket.shop') //Validate URL
    cy.get('[data-testid="headerEmail"]').should('be.visible').and('contain.text', 'iris.dizon@nextbasket.com') //Validate user email
    cy.get('[data-testid="title"]').should('contain.text', 'New').and('be.visible')

    //Accept Cookies
    cy.get('[class*="CookieFooter_cookiebanner__actionButtons_accept_"]').should('be.visible').click() //Accept

  })

  it('Case 1 - Order the first in stock non-promo product (use South Africa as Country and Alberton as City)', () => {
    //selecting a non-promo product
    //Get product name
    cy.get('[data-testid="productCardContainer"]:first-child').find('[data-testid="productCardTitleContainer"] p').invoke('text').then(text => {
      cy.wrap(text).as('productName') //alias for later use
    })

    //Get Product price
    cy.get('[data-testid="productCardContainer"]:first-child').find('[data-testid="productPrice"]').invoke('text').then(text => {
      const priceMatch = text.match(/(\d+(\.\d{2})?)/);
      const price = priceMatch[0] // price index
      cy.log(priceMatch[0])
      cy.wrap(price).as('price') //alias for later use
    })
    //Add first item to cart
    cy.get('[data-testid="productCardContainer"]:first-child').trigger('mouseenter').wait(2000).click()// 1st product detail
    cy.get('[class*="PageBuilder_container"]:nth-child(2) button').eq(0).should('be.visible').and('contain.text', 'Add to basket').click() //Add to basket

    cy.get('[role="status"]').should('be.visible').and('contain.text', 'has been added to your basket') //toast
    cy.get('[role="status"] button').click() //close icon on toast

    //Go to basket
    cy.get('button[aria-label="Open basket menu"]').should('be.visible').click() //Basket menu icon
    cy.get('[text="Go to basket"]').should('be.visible').click() //Go to basket
    cy.get('main [class*="PageBuilder"]:nth-child(2)').eq(0).should('be.visible').and('contain.text', 'Your basket')
    //validate Product name
    cy.get('@productName').then(productName => {
      cy.get('[class*="text-base font-medium"]').eq(1).should('contain.text', productName)
    })
    //Validate product Price
    cy.get('@price').then(price => {
      cy.get('[class*="mb-6 PageBuilder_container_"] [class*="font-medium leading"]').should('be.visible').and('contain.text', price)
    })
    cy.get('h2.font-medium').should('contain.text', 'Order summary')
    cy.contains('Proceed to Checkout').should('be.visible').click({ force: true }) //Proceed to Checkout

    //Checkout
    cy.get('h1[class*="mb-6 w-full text-center font-medium"]').should('contain.text', 'Checkout')
    cy.get('[data-testid="email"]').should('be.visible').type('tester123@yopmail.com') //as a guest
    cy.get('[data-testid="guestLogin"]').should('contain.text', 'Continue as guest').click() //Continue as guest
    //Fill guest detail
    cy.contains('Personal data of receiver').should('be.visible') //Personal data of receiver
    cy.get('[data-testid="firstName"]').should('be.visible').type('Tester') //Name
    cy.get('[data-testid="lastName"]').should('be.visible').type('QA') //Surname
    cy.get('[data-testid="phone"]').should('be.visible').type('03138551122') //phone
    cy.contains('Delivery address').should('be.visible') //Delivery address
    //Delivery Address
    cy.get('[data-testid="autocompleteInput"]').eq(0).clear().wait(1000).type('South Africa')//Country
    cy.get('li[class*="Autocomplete_autocomplete__option"]').should('contain.text', 'South Africa').and('be.visible').click()
    cy.get('[data-testid="autocompleteInput"]').eq(1).clear().type('Alberton') //City
    cy.get('li[class*="Autocomplete_autocomplete__option"]').eq(0).should('contain.text', 'Alberton').and('be.visible').click() //Select Alberton
    cy.get('[name="shippingAddress.postCode"]').should('be.visible').clear().type('45000') //Postal Code
    cy.get('[name="shippingAddress.address"]').should('be.visible').type('Alberton') //Address
    cy.get('[data-testid="goToNextStep"]').should('contain.text', 'Confirm order').click() //Confirm order
    //Confirmation Page
    cy.get('h1').should('be.visible').and('contain.text', 'Thank you!')
    cy.get('[class*="OrderOutcome_order-outcome"] p').eq(0).should('contain.text', 'Your order has been placed successfully')
    cy.get('[class*="OrderOutcome_order-outcome"] p').eq(1).should('contain.text', 'We have emailed you the full order information and details')
    cy.get('img[alt="Order outcome"]').should('exist')

  })
  it('Case 2 - Verify that the "50% off" label is visible on a product', () => {
    cy.contains('-50 %').should('exist').parents('[data-testid="productCardContainer"]')
      .find('[data-testid="productCardTitleContainer"] p').invoke('text').then(productName => {
        cy.log('There is 50% discount! on: ' + productName)
      })
  })
})