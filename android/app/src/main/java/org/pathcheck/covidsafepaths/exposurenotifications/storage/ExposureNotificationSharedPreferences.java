/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package org.pathcheck.covidsafepaths.exposurenotifications.storage;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Key value storage for ExposureNotification.
 *
 * <p>Partners should implement a daily TTL/expiry, for on-device storage of this data, and must
 * ensure compliance with all applicable laws and requirements with respect to encryption, storage,
 * and retention polices for end user data.
 */
public class ExposureNotificationSharedPreferences {

  private static final String SHARED_PREFERENCES_FILE =
      "ExposureNotificationSharedPreferences.SHARED_PREFERENCES_FILE";

  private static final String LAST_DETECTION_PROCESS_DATE =
      "ExposureNotificationSharedPreferences.LAST_DETECTION_PROCESS_DATE";

  private final SharedPreferences sharedPreferences;

  public ExposureNotificationSharedPreferences(Context context) {
    // These shared preferences are stored in {@value Context#MODE_PRIVATE} to be made only
    // accessible by the app.
    sharedPreferences = context.getSharedPreferences(SHARED_PREFERENCES_FILE, Context.MODE_PRIVATE);
  }

  public Long getLastDetectionProcessDate() {
    long date = sharedPreferences.getLong(LAST_DETECTION_PROCESS_DATE, -1);
    return date != -1 ? date : null;
  }

  public void setLastDetectionProcessDate(Long date) {
    sharedPreferences.edit().putLong(LAST_DETECTION_PROCESS_DATE, date).commit();
  }
}
