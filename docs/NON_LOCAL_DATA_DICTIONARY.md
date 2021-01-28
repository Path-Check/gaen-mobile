## Non-Local Data Dictionary

This file lists all of the data which could theoretically leave the
device.

### General Notes

- Many application features are configurable and optionally enabled on a per
  build basis, so not every item listed here is necessarily included in a public
  release of the app via the App Store or the Play Store. If a build does not
  require an optional feature, it is not included.

- All network communication is encrypted with standard SSL security protections.

- No network communication includes personally-identifying information such as a
  device id or IP address.

- No extra data is shared that is not essential to the proper functioning of
  the application.

- All data that leaves the device must be explicitly agreed to be sent by
  the user to be shared.

#### GAEN Exposure Notification Related Data

`src/AffectedUserFlow/verificationAPI.ts`
`src/AffectedUserFlow/exposureNotificationAPI.ts`

All builds of the app have a feature for users to submit their device's local
exposure keys to their region's exposure notification server; this includes two
requests that leave the device with a data payload:

1. submission of a verification token to a verification server.
2. one or more submissions of local randomly generated keys to an exposure notification server.

Users must explicitly agree to share these keys before they can be
sent.

Reference:

[wiki/Exposure_Notification](https://en.wikipedia.org/wiki/Exposure_Notification)

[Verification Flow Diagram](https://developers.google.com/android/exposure-notifications/verification-system#flow-diagram)

#### Error Reporting (Optional)

`src/logger.ts`

Builds that have error reporting enabled send crash and error information to an
error reporting service. Currently, we only support
[Bugsnag](https://docs.bugsnag.com/). Bugsnag generates random Ids, referred to
as 'Device Ids' by Bugsnag, but are not associated with device UUIDs.

#### Contact Tracer Callback Form (Optional)

`src/Callback/callbackAPI.tsx`

Builds that include the Callback form feature have a form in which users can
submit their phone numbers and optionally their names to be put on a queue to be
called back by a contact tracer. If the user chooses to submit their phone
number and name, the application sends the phone number and name to a back-end
service configured on a per build basis.

#### Product Analytics (Optional)

`src/ProductAnalytics/Context.tsx`

Builds that include this feature have a prompt during onboarding and a toggle to
update if a user has opted into sharing product analytics info. If a user opts
to share product analytics, the application sends specific user actions as
events to an aggregating server. No event has personally-identifying
information. Readers can find a list of all events here: [Product Analytics
Events](PRODUCT_ANALYTICS_EVENTS.md)

#### Share Symptom History (Optional)

`src/SymptomHistory/index.tsx`

Builds that include the symptom history feature allow users to construct a
history of symptoms over the past 14 days to assist contact tracing efforts.
Users have the option to 'share' this history. If a user chooses to share the
history, the application will paste the symptom history to the user's device
clipboard as text.
