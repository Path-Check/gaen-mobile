import Alamofire

public enum GenericResult<T> {

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


public enum SubmissionError: CustomNSError {
  case `default`(message: String?)
  case noKeysOnDevice

  public var errorDescription: String? {
    switch self {
    case .noKeysOnDevice:
      return String.noKeysOnDevice
    case .default(message: let message):
      return message  ?? String.emptyMessageError
    }
  }

  public var errorCode: Int {
    switch self {
    case .noKeysOnDevice:
      return 999
    default:
      return 0
    }
  }

}

public let GenericSuccess = GenericResult.success(())
