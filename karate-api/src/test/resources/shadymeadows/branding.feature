Feature: Branding API Verification

  Background:
    * url baseUrl

  Scenario: GET /branding/ returns 200 and correct name
    Given path '/branding/'
    When method GET
    Then status 200
    And match response.name == 'Shady Meadows B&B'

  Scenario: GET /branding/ contact email is valid
    Given path '/branding/'
    When method GET
    Then status 200
    And match response.contact.email == '#regex [a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}'

  Scenario: GET /branding/ returns all required fields
    Given path '/branding/'
    When method GET
    Then status 200
    And match response contains { name: '#string', description: '#string' }

  Scenario: GET /branding/ name and description are not empty
    Given path '/branding/'
    When method GET
    Then status 200
    And match response.name == '#? _.length > 0'
    And match response.description == '#? _.length > 0'

  Scenario: GET /branding/ contact object has required fields
    Given path '/branding/'
    When method GET
    Then status 200
    And match response.contact contains { phone: '#string', email: '#string', address: '#string' }
