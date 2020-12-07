import Foundation
import ExposureNotification
import CryptoKit

extension ENTemporaryExposureKey {
  private func toCodableDiagnosisKey() -> CodableDiagnosisKey {
    return CodableDiagnosisKey(
      key: self.keyData,
      transmissionRiskLevel: self.transmissionRiskLevel,
      rollingStartNumber: self.rollingStartNumber,
      rollingPeriod: self.rollingPeriod
    )
  }
  
  var validTransmissionRiskLevel: Bool {
    transmissionRiskLevel >= 0 && transmissionRiskLevel <= 7
  }
  
  var validRollingPeriod: Bool {
    rollingPeriod >= 1 && rollingPeriod <= 144
  }
  
  var validRollingStartNumber: Bool {
    let currentRollingStartNumber = Int(Date().timeIntervalSince1970 / 600)
    let minStartNumber = currentRollingStartNumber - (144 * 15)
    let maxStartNumber = currentRollingStartNumber - 143
    
    return Int(rollingStartNumber) > minStartNumber && Int(rollingStartNumber) < maxStartNumber
  }
  
  func toValidCodableDiagnosisKey() -> CodableDiagnosisKey? {
    guard validTransmissionRiskLevel && validRollingPeriod && validRollingStartNumber else {
      return nil
    }
    
    return toCodableDiagnosisKey()
  }
  
  convenience init(withKeyData data: CodableDiagnosisKey) {
    self.init()
    keyData = data.key
    transmissionRiskLevel = ENRiskLevel.init(data.transmissionRiskLevel)
    rollingStartNumber = data.rollingStartNumber
    rollingPeriod = data.rollingPeriod
  }
}

extension Array where Element == CodableDiagnosisKey {
  func toVerificationHash() -> String {
    let keyString = self.lazy.map {
      return "\($0.key.base64EncodedString()).\($0.rollingStartNumber).\($0.rollingPeriod).\($0.transmissionRiskLevel)"
    }.joined(separator: ",")
    
    let keyData = keyString.data(using: .utf8)!
    let keyDigest = SHA512.hash(data: keyData)
    let digestStr = keyDigest.map { String(format: "%02x", $0) }.joined()
    return digestStr
  }
}

extension Array where Element == URLQueryItem  {
  func urlEncode() -> String {
    return self.lazy
      .map { ($0.name, $0.value ?? "") }
      .map { "\(escape($0))=\(escape($1))"}
      .joined(separator: "&")
  }
}

// found here from Apple response: https://forums.developer.apple.com/thread/113632
func escape(_ str: String) -> String {
  // Convert LF to CR LF, then
  // Percent encoding anything that's not allow (this implies UTF-8), then
  // Convert " " to "+".
  //
  // Note: We worry about `addingPercentEncoding(withAllowedCharacters:)` returning nil
  // because that can only happen if the string is malformed (specifically, if it somehow
  // managed to be UTF-16 encoded with surrogate problems) <rdar://problem/28470337>.
  return str.replacingOccurrences(of: "\n", with: "\r\n")
    .addingPercentEncoding(withAllowedCharacters: sAllowedCharacters)!
    .replacingOccurrences(of: " ", with: "+")
}

let sAllowedCharacters: CharacterSet = {
  // Start with `CharacterSet.urlQueryAllowed` then add " " (it's converted to "+" later)
  // and remove "+" (it has to be percent encoded to prevent a conflict with " ").
  var allowed = CharacterSet.urlQueryAllowed
  allowed.insert(" ")
  allowed.remove("+")
  allowed.remove("/")
  allowed.remove("?")
  return allowed
}()

