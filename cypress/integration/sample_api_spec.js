let newId;

describe('employees API', () => {

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
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  })

  it('get all the employees part 2', () => {
    cy
      .api(
        {
          url: '/'
        }
      )
      .as('employees')

    cy
      .get('@employees').should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.length(50)
        expect(response).to.have.property('headers')
        expect(response).to.have.property('duration')
      })
  })

  it('add a new employee', function () {
    const firstName = "New"
    const lastName = "Dude"
    const email = "newguy@googling.com"

    cy
      .api({
        method: 'POST',
        url: '/',
        form: false, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
        body: {
          first_name: firstName,
          last_name: lastName,
          email: email
        },
      })

      .as('newbie')

    cy
      .get('@newbie').should((response) => {
        expect(response.status).to.eq(201)
        assert.isNotNull(response.body, 'verify response is not null')
        assert.equal(response.body.first_name, firstName)
        assert.equal(response.body.last_name, lastName)
        assert.equal(response.body.email, email)
      })

    cy
      .then(() => {
        cy
          .api({
            method: 'get',
            url: "/" + this.newbie.body.id
          })

        cy
          .api({
            method: 'delete',
            url: "/" + this.newbie.body.id
          })

        cy
          .api({
            method: 'get',
            url: "/" + this.newbie.body.id,
            failOnStatusCode: false
          })
          .then(
            (response) => {
              expect(response.status).to.eq(404)
            })
      })
  })
})

