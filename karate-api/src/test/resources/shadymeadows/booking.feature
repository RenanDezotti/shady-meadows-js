Feature: Booking Creation API

  Background:
    * url baseUrl

  Scenario: POST /booking/ creates a booking successfully
    #get a valid room ID
    Given path '/room/'
    When method GET
    Then status 200
    * def roomId = response.rooms[0].roomid
    #create the booking
    Given path '/booking/'
    And header Content-Type = 'application/json'
    And request
      """
      {
        "roomid":      #(roomId),
        "firstname":   "James",
        "lastname":    "Brown",
        "depositpaid": true,
        "email":       "james@example.com",
        "phone":       "01234567890",
        "bookingdates": {
          "checkin":  "2025-12-01",
          "checkout": "2025-12-05"
        }
      }
      """
    When method POST
    Then status 200
    And match response.bookingid == '#number'
    And match response.booking.firstname == 'James'
    And match response.booking.lastname  == 'Brown'
    And match response.booking.depositpaid == true

  Scenario: POST /booking/ response matches expected schema
    Given path '/room/'
    When method GET
    Then status 200
    * def roomId = response.rooms[0].roomid
    Given path '/booking/'
    And header Content-Type = 'application/json'
    And request
      """
      {
        "roomid":      #(roomId),
        "firstname":   "Schema",
        "lastname":    "Test",
        "depositpaid": false,
        "email":       "schema@test.com",
        "phone":       "01234567890",
        "bookingdates": {
          "checkin":  "2025-12-10",
          "checkout": "2025-12-15"
        }
      }
      """
    When method POST
    Then status 200
    And match response ==
      """
      {
        "bookingid": '#number',
        "booking": {
          "bookingid":   '#number',
          "roomid":      '#number',
          "firstname":   '#string',
          "lastname":    '#string',
          "depositpaid": '#boolean',
          "email":       '#string',
          "phone":       '#string',
          "bookingdates": {
            "checkin":  '#string',
            "checkout": '#string'
          }
        }
      }
      """

  Scenario: POST /booking/ fails with invalid room ID
    Given path '/booking/'
    And header Content-Type = 'application/json'
    And request
      """
      {
        "roomid":      99999,
        "firstname":   "Invalid",
        "lastname":    "Room",
        "depositpaid": false,
        "email":       "test@test.com",
        "phone":       "01234567890",
        "bookingdates": {
          "checkin":  "2025-12-01",
          "checkout": "2025-12-05"
        }
      }
      """
    When method POST
    Then match responseStatus != 200
