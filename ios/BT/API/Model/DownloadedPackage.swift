import Foundation
import ZIPFoundation
import CryptoKit

protocol DownloadableFile {

  static func create(from data: Data) -> Self?
}

class DownloadedPackage: DownloadableFile {
  
  static func create(from data: Data) -> Self? {
    guard let archive = Archive(data: data, accessMode: .read) else {
      return nil
    }
    do {
      return try archive.extractKeyPackage() as? Self
    } catch {
      return nil
    }
  }


  init(keysBin: Data, signature: Data) {
    bin = keysBin
    self.signature = signature
  }

  let bin: Data
  let signature: Data

  func writeSignatureEntry(toDirectory directory: URL, filename: String) throws -> URL {
    let url = directory.appendingPathComponent(filename).appendingPathExtension("sig")
    try signature.write(to: url)
    return url
  }

  func writeKeysEntry(toDirectory directory: URL, filename: String) throws -> URL {
    let url = directory.appendingPathComponent(filename).appendingPathExtension("bin")
    try bin.write(to: url)
    return url
  }
}

private extension Archive {
  typealias KeyPackage = (bin: Data, sig: Data)
  enum KeyPackageError: Error {
    case binNotFound
    case sigNotFound
    case signatureCheckFailed
  }

  func extractData(from entry: Entry) throws -> Data {
    var data = Data()
    try _ = extract(entry) { slice in
      data.append(slice)
    }
    return data
  }

  func extractKeyPackage() throws -> DownloadedPackage {
    guard let binEntry = self["export.bin"] else {
      throw KeyPackageError.binNotFound
    }
    guard let sigEntry = self["export.sig"] else {
      throw KeyPackageError.sigNotFound
    }
    return DownloadedPackage(
      keysBin: try extractData(from: binEntry),
      signature: try extractData(from: sigEntry)
    )
  }
}
