import UIKit
import ExposureNotification
import DeviceCheck
import ZIPFoundation

struct TokenRequestBody: Codable {
  var deviceCode: String
  var grantType: String = "device_code"
  var deviceType: String = "iOS"
  var client_id: String = Bundle.main.bundleIdentifier!
}

struct TokenRefreshBody: Codable {
  var grantType: String = "refresh_token"
  var refreshToken: String
  var clientID: String = Bundle.main.bundleIdentifier!
}

struct TokenResponse: Codable {
  var tokenType: String
  var accessToken: String
  var expiresIn: Int
  var refreshToken: String?
}

enum NetworkServiceControllerError: Error {
  case diagnosisKeySubmissionError,
       keyAndPhoneSubmissionError,
       dataError,
       verificationCodeSubmissionError,
       deviceTokenUnsupportedError,
       deviceTokenGenerationError,
       downloadLocationError,
       moveFileError
}

enum TokenRequestType {
  case request, refresh
}

let BASE_URL = URL(string: ReactNativeConfig.env(for: "ESCROW_VERIFICATION_BASE_URL"))!

class NetworkServiceController: NSObject, FileManagerDelegate {
  static let shared = NetworkServiceController()
  
  // post key submission with verification code
  func postDiagnosisKeysWithVerification(_ submission: DiagnosisSubmission, completion: @escaping (Result<Data, Error>) -> Void) {
    getJWT { result in
      switch result {
      case .failure(let error):
        completion(.failure(error))
      case .success(let token):
        let url = URL(string: "\(BASE_URL)/verification/postVerificationCode")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        let jsonData = try! encoder.encode(submission)
        
        let task = URLSession.shared.uploadTask(with: request, from: jsonData) { data, response, error in
          if let error = error {
            completion(.failure(error))
            return
          } else if let response = response as? HTTPURLResponse, response.statusCode >= 300 {
            completion(.failure(NetworkServiceControllerError.verificationCodeSubmissionError))
            return
          } else {
            if let data = data {
              completion(.success(data))
            } else {
              completion(.failure(NetworkServiceControllerError.dataError))
            }
          }
        }
        task.resume()
      }
    }
  }
  
  func getJWT(completion: @escaping (Result<String, Error>) -> Void) {
    // guard against no stored token
    guard let token = DataStore.shared.authToken else {
      // get fresh token
      requestTokenWithType(.request, completionHandler: completion)
      return
    }
    
    if let expiration = DataStore.shared.tokenExpiration {
      if expiration < Date() {
        if DataStore.shared.refreshToken == nil {
          requestTokenWithType(.request, completionHandler: completion)
        } else {
          requestTokenWithType(.refresh, completionHandler: completion)
        }
        return
      }
    }
    
    // all good, run handler with token
    completion(.success(token))
  }
  
  func requestTokenWithType(_ type: TokenRequestType, completionHandler: @escaping(Result<String, Error>) -> Void) {
    // get device token
    generateDeviceToken{ result in
      switch result {
      case .failure(let error):
        completionHandler(.failure(error))
        return
      case .success(let data):
        let deviceCode = data.base64EncodedString()
        let url = URL(string: "\(BASE_URL)/authtracking/token")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        var items: [URLQueryItem] = []
        switch type {
        case .request:
          items = [
            URLQueryItem(name: "device_code", value: deviceCode),
            URLQueryItem(name: "grant_type", value: "device_code"),
            URLQueryItem(name: "device_type", value: "IOS"),
          ]
        case .refresh:
          // if we don't have a refresh token, try again to request a token
          guard let refreshToken = DataStore.shared.refreshToken else {
            self.requestTokenWithType(.request, completionHandler: completionHandler)
            return
          }
          items = [
            URLQueryItem(name: "grant_type", value: "refresh_token"),
            URLQueryItem(name: "refresh_token", value: refreshToken),
          ]
        }
        
        let bodyStr = items.urlEncode()
        
        let bodyData = bodyStr.data(using: .utf8)!
        request.addValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        request.httpBody = bodyData
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
          if let error = error {
            switch type {
            case .refresh:
              self.requestTokenWithType(.request, completionHandler: completionHandler)
            case .request:
              completionHandler(.failure(error))
            }
            return
          }
          
          if let response = response as? HTTPURLResponse, response.statusCode >= 300 {
            switch type {
            case .refresh:
              self.requestTokenWithType(.request, completionHandler: completionHandler)
            case .request:
              completionHandler(.failure(NetworkServiceControllerError.deviceTokenGenerationError))
            }
            return
          }
          
          if let data = data {
            let token = self.processTokenData(data)
            completionHandler(.success(token))
          }
        }
        
        task.resume()
      }
    }
  }
  
  func postKeysAndPhone(keyData: [CodableDiagnosisKey], phone: String, completionHandler: @escaping(Result<Bool, Error>) -> Void) {
    getJWT { result in
      switch result {
      case let .failure(error):
        completionHandler(.failure(error))
      case let .success(token):
        let url = URL(string: "\(BASE_URL)/verification/postMetaInfo")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.addValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyItems = [
          URLQueryItem(name: "tek_sha512", value: keyData.toVerificationHash()),
          URLQueryItem(name: "phone_number", value: phone)
        ]
        
        let bodyStr = bodyItems.urlEncode()
        let bodyData = bodyStr.data(using: .utf8)!
        request.httpBody = bodyData
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
          if let error = error {
            completionHandler(.failure(error))
            return
          }
          
          guard let response = response as? HTTPURLResponse, response.statusCode < 300 else {
            completionHandler(.failure(NetworkServiceControllerError.keyAndPhoneSubmissionError))
            return
          }
          
          guard data != nil else {
            completionHandler(.failure(NetworkServiceControllerError.dataError))
            return
          }
          
          completionHandler(.success(true))
        }
        
        task.resume()
      }
    }
  }
  
  func processTokenData(_ data: Data) -> String {
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = .convertFromSnakeCase
    let tokenResponse = try! decoder.decode(TokenResponse.self, from: data)
    DataStore.shared.authToken = tokenResponse.accessToken
    DataStore.shared.refreshToken = tokenResponse.refreshToken ?? DataStore.shared.refreshToken
    DataStore.shared.tokenExpiration = Date().addingTimeInterval(TimeInterval(tokenResponse.expiresIn))
    
    return tokenResponse.accessToken
  }
  
  func generateDeviceToken(completion: @escaping (Result<Data, Error>) -> Void) {
    let device = DCDevice.current
    
    guard device.isSupported else {
      completion(.failure(NetworkServiceControllerError.deviceTokenUnsupportedError))
      return
    }
    
    device.generateToken { data, error in
      if let error = error {
        completion(.failure(error))
      } else if let data = data {
        completion(.success(data))
      }
    }
  }
}
