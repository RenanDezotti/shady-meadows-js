Feature: Room Inventory API

  Background:
    * url baseUrl

  Scenario: GET /room/ returns 200
    Given path '/room/'
    When method GET
    Then status 200

  Scenario: GET /room/ response contains a rooms array
    Given path '/room/'
    When method GET
    Then status 200
    And match response.rooms == '#array'
    And match response.rooms == '#[_ > 0]'

  Scenario: GET /room/ at least one room has roomPrice greater than zero
    Given path '/room/'
    When method GET
    Then status 200
    * def prices = $response.rooms[*].roomPrice
    And match each prices == '#number'
    And match prices[0] == '#? _ > 0'

  Scenario: GET /room/ each room has required fields
    Given path '/room/'
    When method GET
    Then status 200
    And match each response.rooms contains { roomid: '#number', roomName: '#string', type: '#string', roomPrice: '#number' }

  Scenario: GET /room/ can store first roomid for downstream use
    Given path '/room/'
    When method GET
    Then status 200
    * def firstRoomId = response.rooms[0].roomid
    And match firstRoomId == '#number'
    And match firstRoomId == '#? _ > 0'
