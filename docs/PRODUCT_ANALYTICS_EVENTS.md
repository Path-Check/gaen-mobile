### Product Analytics Events

This file is an list of all events that could be recorded if a user opts into
sharing product analytics information. If a user does not explicitly opt into
sharing product analytics events, no events will be recorded

When events occur they are recorded to a analytics server configured to the
build.

Note that this is an optionally enabled feature and not every build includes it.


#### Events:

- User agrees to analytics app is backgrounded during onboarding (Category: product_analytics, Action: onboarding_analytics_opt_in)

- User denies EN permissions during onboarding (Category: product_analytics, Action: onboarding_en_permissions_denied)

- User accepts EN permissions during onboarding (Category: product_analytics, Action: onboarding_en_permissions_accept)

- Onboarding completed (Category: product_analytics, Action: onboarding_completed)

- EN received (Category: epi_analytics, Action: en_notification_received)

- Keys submitted Category: (product_analytics, Action: key_submission_consented_to)

- Number of ENs preceding key submission (Category: epi_analytics, Action: ens_preceding_positive_diagnosis_count)

- Session length

- Screen views
