import Alamofire

public enum Result<T> {

  case success(T)
  case failure(Error)

}

public enum ExposureResult {

  case success(Int)
  case failure(Error)

}

public enum GenericError: Error {

  case unknown
  case badRequest
  case cancelled
  case notFound
  case notImplemented
  case unauthorized

}

public enum ExposureError: LocalizedError {

  case `default`(String?)
  case dailyFileProcessingLimitExceeded
  case cancelled

  /// TODO localize this
  public var errorDescription: String? {
    switch self {
    case .default(message: let message):
      return message ?? String.emptyMessageError
    case .dailyFileProcessingLimitExceeded:
      return String.dailyFileProcessingLimitExceeded.localized
    case .cancelled:
      return String.exposureDetectionCanceled.localized
    }
  }

}

public enum APIError: LocalizedError {
  case `default`(message: String?)

  public var errorDescription: String? {
    switch self {
    case .default(message: let message):
      return message  ?? String.emptyMessageError
    }
  }
}

public let GenericSuccess = GenericResult.success(())
