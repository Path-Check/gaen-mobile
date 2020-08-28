import Foundation
import BackgroundTasks

protocol BackgroundTaskScheduler {
  @discardableResult func register(forTaskWithIdentifier identifier: String, using queue: DispatchQueue?, launchHandler: @escaping (BGTask) -> Void) -> Bool
  func submit(_ taskRequest: BGTaskRequest) throws
}

extension BGTaskScheduler: BackgroundTaskScheduler { }
