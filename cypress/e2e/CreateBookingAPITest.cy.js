/// <reference types = 'cypress'/>


describe('Create Booking using an API request', () => {

  it('Case 1 - Create a new booking an validate the response using an API request)', () => {

    cy.request({
      method: 'POST', url: 'https://restful-booker.herokuapp.com/booking',
      header: { 'Content-Type': 'application/json' },
      body: {
        "firstname": "Jim",
        "lastname": "Brown",
        "totalprice": 111,
        "depositpaid": true,
        "bookingdates": {
          "checkin": "2024-07-13",
          "checkout": "2024-07-14"
        },
        "additionalneeds": "Lunch"
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('bookingid')
      expect(response.body.booking).to.deep.equal({
        "firstname": "Jim",
        "lastname": "Brown",
        "totalprice": 111,
        "depositpaid": true,
        "bookingdates": {
          "checkin": "2024-07-13",
          "checkout": "2024-07-14"
        },
        "additionalneeds": "Lunch"
      })
    })
  })
  it('Case 2 - Create a new booking and Verify that the id of the new booking is present in the response of GetBookingIds)', () => {

    cy.request({
      method: 'POST', url: 'https://restful-booker.herokuapp.com/booking',
      header: { 'Content-Type': 'application/json' },
      body: {
        "firstname": "Jim",
        "lastname": "Brown",
        "totalprice": 111,
        "depositpaid": true,
        "bookingdates": {
          "checkin": "2024-07-13",
          "checkout": "2024-07-14"
        },
        "additionalneeds": "Lunch"
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('bookingid')
      const bookingid = response.body.bookingid
      cy.wrap(bookingid).as('bookingid')  //create alias for bookingid
      expect(response.body.booking).to.deep.equal({
        "firstname": "Jim",
        "lastname": "Brown",
        "totalprice": 111,
        "depositpaid": true,
        "bookingdates": {
          "checkin": "2024-07-13",
          "checkout": "2024-07-14"
        },
        "additionalneeds": "Lunch"
      })
    })

    cy.request('GET', 'https://restful-booker.herokuapp.com/booking').then(response => {
      expect(response.status).to.eq(200)
      cy.get('@bookingid').then(bookingid => {
        const bookingIds = response.body.map(booking => booking.bookingid)
        expect(bookingIds).to.include(bookingid)
      })
    })
  })
})
