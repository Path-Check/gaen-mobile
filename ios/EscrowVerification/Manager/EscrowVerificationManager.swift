import Foundation
import ExposureNotification

@objc(EscrowVerificationManager)
class EscrowVerificationManager: NSObject {
  @objc static let shared = EscrowVerificationManager()

  @objc func submitPhoneNumber(phoneNumber: String, completionHandler: @escaping(Error?) -> Void) {
    getCodableKeysWithRiskLevel { result in
      switch result {
      case .success(let keys):
        NetworkServiceController.shared.postKeysAndPhone(keyData: keys, phone: phoneNumber) { result in
          switch result {
          case let .failure(error):
            completionHandler(error)
          case .success:
            completionHandler(nil)
          }
        }
      default:
        break
      }
    }
  }

  @objc func submitDiagnosisKeys(_ verificationCode: String, date: Int, completionHandler: @escaping (Error?) -> Void) {
    let date = date.fromPosixRepresentation
    getCodableKeysWithRiskLevel { result in
      switch result {
      case .success(let keys):
        NetworkServiceController.shared.generateDeviceToken { result in
          let token: Data
          switch result {
          case let .failure(error):
            completionHandler(error)
            return
          case let .success(data):
            token = data
          }

          let submission = DiagnosisSubmission(
            verificationCode: verificationCode,
            testDate: date,
            deviceVerificationPayload: token,
            temporaryExposureKeys: keys
          )

          // post keys to backend
          NetworkServiceController.shared.postDiagnosisKeysWithVerification(submission) { result in
            switch result {
            case let .failure(error):
              completionHandler(error)
            case .success(_):
              completionHandler(nil)
            }
          }
        }
      default:
        break
      }
    }
  }
}

private extension EscrowVerificationManager {

  func getCodableKeysWithRiskLevel(_ completionHandler: @escaping(Result<[CodableDiagnosisKey], Error>) -> Void) {
    ExposureManager.shared?.manager.getDiagnosisKeys { keys, error in
      if let error = error {
        completionHandler(.failure(error))
        return
      }

      guard let keys = keys else {
        return
      }

      var codableKeys: [CodableDiagnosisKey] = keys.compactMap { $0.toValidCodableDiagnosisKey() } .sorted {
        // sort, most recent to least recent
        $0.rollingStartNumber > $1.rollingStartNumber
      }

      // limit to no more than 15 results
      if codableKeys.count > 15 {
        codableKeys = Array(codableKeys[0..<15])
      }

      completionHandler(.success(codableKeys))
    }
  }

}
