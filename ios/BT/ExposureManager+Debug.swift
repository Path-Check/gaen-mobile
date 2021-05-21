//
//  ExposureManager+Debug.swift
//  BT
//
//  Created by Emiliano Galitiello on 24/08/2020.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Foundation
import RealmSwift

protocol ExposureManagerDebuggable {
  func handleDebugAction(_ action: DebugAction,
                         resolve: @escaping RCTPromiseResolveBlock,
                         reject: @escaping RCTPromiseRejectBlock)
}

extension ExposureManager: ExposureManagerDebuggable {
  
  @objc func handleDebugAction(_ action: DebugAction,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
    switch action {
    case .fetchDiagnosisKeys:
      manager.getDiagnosisKeys { (keys, error) in
        if let error = error {
          reject(error.localizedDescription, "Failed to get exposure keys", error)
        } else {
          resolve(keys!.map { $0.asDictionary })
        }
      }
    case .simulateExposureDetectionError:
      btSecureStorage.exposureDetectionErrorLocalizedDescription = "Unable to connect to server."
      postExposureDetectionErrorNotification("Simulated Error")
      resolve(String.genericSuccess)
    case .simulateExposure:
      let exposure = Exposure(id: UUID().uuidString,
                              date: Date().posixRepresentation - Int(TimeInterval.random(in: 0...13)) * 24 * 60 * 60 * 1000,
                              weightedDurationSum: 2000.0)
      btSecureStorage.storeExposures([exposure])
      notifyUserExposureDetected()
      resolve("Exposures: \(btSecureStorage.userState.exposures)")
    case .fetchExposures:
      resolve(currentExposures)
    case .resetExposures:
      btSecureStorage.exposures = List<Exposure>()
      resolve("Exposures: \(btSecureStorage.exposures.count)")
    case .showLastProcessedFilePath:
      let path = btSecureStorage.userState.urlOfMostRecentlyDetectedKeyFile
      resolve(path)
    case .addOldExposure:
      // Store an old exposure in the phone's local storage to use later.
      let oldExposure = Exposure(id: UUID().uuidString,
                                 date: Date().posixRepresentation - 14 * 24 * 60 * 60 * 1000, weightedDurationSum: 2000.0)
      // Append an old exposure to our list of exposures
      btSecureStorage.exposures.append(oldExposure)
      
      // OR we can just store the exposure and forget the rest
      //      btSecureStorage.storeExposures([oldExposure])s
      notifyUserExposureDetected()
      resolve("Exposures: \(btSecureStorage.userState.exposures)")
    }
  }
}
