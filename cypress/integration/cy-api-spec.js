describe('employees API tests with cy.api', () => {

  beforeEach(() => {
    cy
      .log('starting test')
  })

  it('get all the employees', () => {
    cy
      .api(
        {
          url: '/'
        }
      )
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response).to.have.property('headers')
        expect(response).to.have.property('duration')
        expect(response.headers['content-type']).to.include('application/json')
        expect(response.body).to.have.length(50)
      })
  })

  it('add and delete an employee', function () {
    const firstName = 'Jane'
    const lastName = 'Tester'
    const email = 'jane.tester@googling.com'

    cy
      .api({
        method: 'POST',
        url: '/',
        form: false,
        body: {
          first_name: firstName,
          last_name: lastName,
          email: email
        }
      })
      .then((response) => {
        expect(response.body).to.not.be.null
        expect(response.status).to.eq(201)
        expect(response.body.first_name).to.eq(firstName)
        expect(response.body.last_name).to.eq(lastName)
        expect(response.body.email).to.eq(email)
      })

      .as('newbie')

    cy
      .then(() => {
        cy
          .api({
            method: 'get',
            url: "/" + this.newbie.body.id
          })
          .then((response) => {
            expect(response.body).to.not.be.null
            expect(response.status).to.eq(200)
            expect(response.body.first_name).to.eq(firstName)
            expect(response.body.last_name).to.eq(lastName)
            expect(response.body.email).to.eq(email)
          })

        cy
          .api({
            method: 'delete',
            url: "/" + this.newbie.body.id
          })
          .then((response) => {
            expect(response.status).to.eq(200)
          })

        cy
          .api({
            method: 'get',
            url: "/" + this.newbie.body.id,
            failOnStatusCode: false
          })
          .then((response) => {
            expect(response.status).to.eq(404)
          })
      })
  })
})

