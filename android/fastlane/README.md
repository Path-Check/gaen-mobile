fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## Android
### android release_increment_version_code
```
fastlane android release_increment_version_code
```
Increment version code
### android debug_bt
```
fastlane android debug_bt
```
Build a Debug APK
### android staging_apk
```
fastlane android staging_apk
```
Build a Staging APK
### android release_apk
```
fastlane android release_apk
```
Build a Release APK
### android release_aab
```
fastlane android release_aab
```
Build a Release AAB
### android android_alpha_apk
```
fastlane android android_alpha_apk
```
Submit APK to AppCenter

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
