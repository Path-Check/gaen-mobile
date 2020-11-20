## Local Data Dictionary

This file is an list of all of the data which is stored locally on the
device.

#### GAEN Exposure Notification Related Data

`ios/BT/Storage/BTSecureStorage.swift`

All builds of the app store the following pieces of Exposure Notification related data:

1. The timestamp of any exposures detected by the [Exposure Notifications framework](https://developer.apple.com/documentation/exposurenotification/enmanager/3586331-detectexposures).
2. The timestamp of the last exposure check run in the background or manually requested from the app
3. The remote url path of the last key archive pulled down by the app from the key server

#### Symptom Log Data

All builds of the app store the symptom logs created in the app by the user. Users can delete these logs from their device by tapping the "Delete my data" button on the settings screen.

Reference:
[Exposure Notification (iOS)](https://developer.apple.com/documentation/exposurenotification)
