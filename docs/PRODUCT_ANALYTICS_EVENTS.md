### Product Analytics Events

This file lists all events recorded if a user opts to
share product analytics information. If a user does not explicitly opt into
sharing product analytics events, the application will not record events.

The application posts analytics events to a remote server defined in the
application config.

Note that this is an optionally enabled feature, and not every build includes
it.


#### Events:

- User agrees to analytics app is backgrounded during onboarding (Category: product_analytics, Action: onboarding_analytics_opt_in)

- User denies EN permissions during onboarding (Category: product_analytics, Action: onboarding_en_permissions_denied)

- User accepts EN permissions during onboarding (Category: product_analytics, Action: onboarding_en_permissions_accept)

- Onboarding completed (Category: product_analytics, Action: onboarding_completed)

- EN received (Category: epi_analytics, Action: en_notification_received)

- Keys submitted Category: (product_analytics, Action: key_submission_consented_to)

- Number of ENs preceding key submission (Category: epi_analytics, Action: ens_preceding_positive_diagnosis_count)

- User tapped next steps button (Category: product_analytics, Action: tapped_next_steps_button)

- Session length

- Screen views
