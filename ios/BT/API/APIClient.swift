import Alamofire

enum RequestType {
  case downloadKeys,
  exposureConfiguration
}

protocol APIClient {
  static var documentsDirectory: URL? { get }
  func request<T: APIRequest>(_ request: T,
                              requestType: RequestType,
                              completion: @escaping GenericCompletion) where T.ResponseType == Void
  func downloadRequest<T: APIRequest>(_ request: T,
                                      requestType: RequestType,
                                      completion: @escaping (GenericResult<T.ResponseType>) -> Void) where T.ResponseType: DownloadableFile
  func request<T: APIRequest>(_ request: T,
                              requestType: RequestType,
                              completion: @escaping (GenericResult<JSONObject>) -> Void) where T.ResponseType == JSONObject
  func request<T: APIRequest>(_ request: T,
                              requestType: RequestType,
                              completion: @escaping (GenericResult<T.ResponseType>) -> Void) where T.ResponseType: Decodable
  func requestList<T: APIRequest>(_ request: T,
                                  requestType: RequestType,
                                  completion: @escaping (GenericResult<[T.ResponseType.Element]>) -> Void) where T.ResponseType: Collection, T.ResponseType.Element: Decodable
  func requestString<T: APIRequest>(_ request: T,
                                    requestType: RequestType,
                                    completion: @escaping (GenericResult<T.ResponseType>) -> Void) where T.ResponseType == String
  func cancelAllRequests()
}

class BTAPIClient: APIClient {
  
  let downloadBaseUrl: URL
  let exposureConfigurationUrl: URL
  static let shared: BTAPIClient = {
    var exposureConfigurationUrl = URL(string: ReactNativeConfig.env(for: .exposureConfigurationUrlV1))!
    if #available(iOS 13.7, *) {
      exposureConfigurationUrl = URL(string: ReactNativeConfig.env(for: .exposureConfigurationUrlV6))!
    }
    return BTAPIClient(
      downloadBaseUrl: URL(string: ReactNativeConfig.env(for: .downloadBaseUrl))!,
      exposureConfigurationUrl: exposureConfigurationUrl
    )
  }()
  
  private let sessionManager: SessionManager

  init(downloadBaseUrl: URL,
       exposureConfigurationUrl: URL) {
    self.downloadBaseUrl = downloadBaseUrl
    self.exposureConfigurationUrl = exposureConfigurationUrl
    
    let configuration = URLSessionConfiguration.default
    
    let headers = SessionManager.defaultHTTPHeaders
    
    configuration.httpAdditionalHeaders = headers
    configuration.requestCachePolicy = .reloadIgnoringLocalAndRemoteCacheData
    
    sessionManager = SessionManager(configuration: configuration)
  }
  
  func request<T: APIRequest>(_ request: T, requestType: RequestType, completion: @escaping GenericCompletion) where T.ResponseType == Void {
    dataRequest(for: request, requestType: requestType)
      .validate(validate)
      .response { response in
        if let error = response.error {
          completion(.failure(error))
        }
        else {
          completion(GenericSuccess)
        }
    }
  }
  
  func downloadRequest<T: APIRequest>(_ request: T, requestType: RequestType, completion: @escaping (GenericResult<T.ResponseType>) -> Void) where T.ResponseType: DownloadableFile {
    downloadRequest(for: request, requestType: requestType).responseData { response in
      guard let data = response.result.value else {
        completion(.failure(GenericError.unknown))
        return
      }
      if let file = T.ResponseType.create(from: data) {
        completion(.success(file))
      } else {
        let error = GenericError(statusCode: response.response?.statusCode ?? 0)
        completion(.failure(error))
      }
    }
  }
  
  func request<T: APIRequest>(_ request: T, requestType: RequestType, completion: @escaping (GenericResult<JSONObject>) -> Void) where T.ResponseType == JSONObject {
    dataRequest(for: request, requestType: requestType)
      .validate(validate)
      .responseJSON { response in
        switch response.result {
        case .success(let value):
          completion(.success(value as? JSONObject ?? JSONObject()))
        case .failure(let error):
          completion(.failure(error))
        }
    }
  }
  
  func request<T: APIRequest>(_ request: T, requestType: RequestType, completion: @escaping (GenericResult<T.ResponseType>) -> Void) where T.ResponseType: Decodable {
    requestDecodable(request, requestType: requestType, completion: completion)
  }
  
  func requestList<T: APIRequest>(_ request: T, requestType: RequestType, completion: @escaping (GenericResult<[T.ResponseType.Element]>) -> Void) where T.ResponseType: Collection, T.ResponseType.Element: Decodable {
    requestDecodables(request, requestType: requestType, completion: completion)
  }
  
  func requestString<T: APIRequest>(_ request: T, requestType: RequestType, completion: @escaping (GenericResult<T.ResponseType>) -> Void) where T.ResponseType == String {
    dataRequest(for: request, requestType: requestType)
      .validate(validate)
      .responseData { response in
        switch response.result {
        case .success(let data):
          completion(.success(String(decoding: data, as: UTF8.self)))
        case .failure(let error):
          completion(.failure(error))
        }
    }
  }
  
  func cancelAllRequests() {
    sessionManager.session.getAllTasks { tasks in
      tasks.forEach { $0.cancel() }
    }
  }
  
  static var documentsDirectory: URL? {
    let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
    
    return paths.first
  }
  
}

// MARK: - Private

private extension BTAPIClient {
  
  enum Key {
    static let error = "error"
    static let errorMessage = "error_description"
  }
  
  func downloadRequest<T: APIRequest>(for request: T,
                                      requestType: RequestType) -> DataRequest {
    let baseUrl = baseUrlFor(requestType)
    let r = request.path.isEmpty ? sessionManager.request(baseUrl) : sessionManager.request(baseUrl.appendingPathComponent(request.path))
    debugPrint(r)
    return r
  }

  func dataRequest<T: APIRequest>(for request: T,
                                  requestType: RequestType) -> DataRequest {
    let baseUrl = baseUrlFor(requestType)
    let r = sessionManager.request(
      baseUrl.appendingPathComponent(request.path, isDirectory: false),
      method: request.method,
      parameters: request.parameters,
      encoding: request.encoding
    )
    debugPrint(r)
    return r
  }
  
  func validate(request: URLRequest?, response: HTTPURLResponse, data: Data?) -> Request.ValidationResult {
    if (200...399).contains(response.statusCode) {
      return .success
    }
    
    // Attempt to deserialize structured error, if it exists
    if let data = data, let json = (try? JSONSerialization.jsonObject(with: data, options: [])) as? JSONObject, let errorJson = json[Key.error] as? JSONObject {
      do {
        return .failure(try StructuredError(json: errorJson))
      } catch {
        return .failure(error)
      }
    }
    
    // Fallback on a simple status code error
    return .failure(GenericError(statusCode: response.statusCode))
  }
  
  func requestDecodable<T: APIRequest>(_ request: T, requestType: RequestType, completion: @escaping (GenericResult<T.ResponseType>) -> Void) where T.ResponseType: Decodable {
    dataRequest(for: request, requestType: requestType)
      .validate(validate)
      .responseData { response in
        switch response.result {
        case .success(let data):
          do {
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .formatted(DateFormatter.iso8601Full)
            completion(.success(try decoder.decode(T.ResponseType.self, from: data)))
          } catch {
            completion(.failure(error))
          }
        case .failure(let error):
          completion(.failure(error))
        }
    }
  }
  
  func requestDecodables<T: APIRequest>(_ request: T, requestType: RequestType, completion: @escaping (GenericResult<[T.ResponseType.Element]>) -> Void) where T.ResponseType: Collection, T.ResponseType.Element: Decodable {
    requestDecodable(CollectionAPIRequest(request: request), requestType: requestType) { result in
      switch result {
      case .success(let value):
        completion(.success(value.results))
      case .failure(let error):
        completion(.failure(error))
      }
    }
  }

  func baseUrlFor(_ requestType: RequestType) -> URL {
    var baseUrl: URL!
    switch requestType {
    case .downloadKeys:
      baseUrl = downloadBaseUrl
    case .exposureConfiguration:
      baseUrl = exposureConfigurationUrl
    }
    return baseUrl
  }
}

private struct CollectionAPIRequest<T: APIRequest>: APIRequest where T.ResponseType: Collection, T.ResponseType.Element: Decodable {
  
  typealias ResponseType = ResultsContainer<T.ResponseType.Element>
  
  let request: T
  
  var method: HTTPMethod {
    return request.method
  }
  
  var path: String {
    return request.path
  }
  
  var parameters: Parameters? {
    return request.parameters
  }
  
}

private struct ResultsContainer<T: Decodable>: Decodable {
  var results: [T]
}

private extension GenericError {
  
  init(statusCode: Int) {
    switch statusCode {
    case 400:
      self = .badRequest
    case 401:
      self = .unauthorized
    case 404:
      self = .notFound
    default:
      self = .unknown
    }
  }
  
}

private extension DateFormatter {
  static let iso8601Full: DateFormatter = {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ"
    formatter.calendar = Calendar(identifier: .iso8601)
    formatter.timeZone = TimeZone(secondsFromGMT: 0)
    formatter.locale = Locale(identifier: "en_US_POSIX")
    return formatter
  }()
}
