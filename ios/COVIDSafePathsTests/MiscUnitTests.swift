import Foundation
import XCTest
import ExposureNotification
import Alamofire

@testable import BT

class MiscelaneousUnitTests: XCTestCase {

  func testExposureError() {
    let error = ExposureError.default("error_message")
    XCTAssertEqual(error.localizedDescription, "error_message")

    let noMessageError = ExposureError.default(nil)
    XCTAssertEqual(noMessageError.localizedDescription, String.emptyMessageError)

    let dailyFileProcessingLimitExceededError = ExposureError.dailyFileProcessingLimitExceeded
    XCTAssertEqual(dailyFileProcessingLimitExceededError.localizedDescription,
                   String.dailyFileProcessingLimitExceeded.localized)

    let exposureDetectionCancelledError = ExposureError.cancelled
    XCTAssertEqual(exposureDetectionCancelledError.localizedDescription,
                   String.exposureDetectionCanceled.localized)
  }

  func testAPIError() {
    let error = APIError.default(message: "error_message")
    XCTAssertEqual(error.localizedDescription, "error_message")

    let noMessageError = APIError.default(message: nil)
    XCTAssertEqual(noMessageError.localizedDescription, String.emptyMessageError)
  }

  func testENTemporaryExposureKey() {
    let temporaryExposureKey = ENTemporaryExposureKey()
    temporaryExposureKey.keyData = Data()
    let exposureKey = temporaryExposureKey.asCodableKey
    XCTAssertNotNil(exposureKey)
  }

  func testKeychain() {
    let keychain = DefaultKeychainService.shared
    keychain.setRevisionToken("token")
    XCTAssertEqual(keychain.revisionToken, "token")
  }

  func testUnpackingFails() {
    let urls: [DownloadedPackage] = [MockDownloadedPackage(handler: { () -> URL in
      throw GenericError.unknown
    })]
    XCTAssertThrowsError( try urls.unpack { (urls) in
      //no op
    }, "A generic error is thrown") { (error) in
      XCTAssertEqual(error as! GenericError, GenericError.unknown)
    }
  }

  func testDefaultAPIRequest() {
    struct DefaultAPIRequest: APIRequest {
      var path: String = ""

      typealias ResponseType = Void
    }
    let defaultAPIRequest = DefaultAPIRequest()
    XCTAssertEqual(defaultAPIRequest.method, .get)
    struct POSTAPIRequest: APIRequest {
      var path: String = ""

      typealias ResponseType = Void

      var method: HTTPMethod {
        return .post
      }
    }
  }

  func testFetchExposureKeysSuccess() {
    let expectation = self.expectation(description: "a call is made to get the diagnosis keys")
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    exposureManager.fetchExposureKeys { (keys, error) in
      XCTAssertNil(error)
      XCTAssertEqual(keys?.count, 1)
      expectation.fulfill()
    }
    wait(for: [expectation], timeout: 0)
  }

  func testFetchExposureKeysError() {
    let expectation = self.expectation(description: "a call is made to get the diagnosis keys")
    let exposureManager = defaultExposureManager(withKeys: false, enAPIVersion: .v1)
    exposureManager.fetchExposureKeys { (keys, error) in
      XCTAssertEqual(error?.errorCode, ExposureManagerErrorCode.noExposureKeysFound.rawValue)
      XCTAssertNotNil(error?.underlyingError)
      expectation.fulfill()
    }
    wait(for: [expectation], timeout: 0)
  }

  func testFetchLastDetectionDate() {
    let userState = UserState()
    let exposureManager = defaultExposureManager(enAPIVersion: .v1, userState: userState)
    let rejectExpectation = self.expectation(description: "reject is called")
    let resolveExpectation = self.expectation(description: "resolve is called")

    exposureManager.fetchLastDetectionDate(resolve: {(posixDate) in
      XCTFail()
    }, reject: {(_, _, error) in
      rejectExpectation.fulfill()
    })

    let date = Date()
    userState.lastExposureCheckDate = date

    exposureManager.fetchLastDetectionDate(resolve: {(_) in
      resolveExpectation.fulfill()
    }, reject: {(_, _, _) in
      XCTFail()
    })

    wait(for: [rejectExpectation, resolveExpectation], timeout: 0)
  }

}
