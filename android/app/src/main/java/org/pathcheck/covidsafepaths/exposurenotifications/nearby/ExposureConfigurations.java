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

package org.pathcheck.covidsafepaths.exposurenotifications.nearby;

import android.content.Context;

import com.google.android.gms.nearby.exposurenotification.ExposureConfiguration;

import org.pathcheck.covidsafepaths.exposurenotifications.storage.ExposureNotificationSharedPreferences;

/**
 * A simple class to own setting configuration for this app's use of the EN API, with attenuation
 * settings, etc.
 */
public class ExposureConfigurations {

    private final ExposureNotificationSharedPreferences prefs;

    public ExposureConfigurations(Context context) {
        prefs = new ExposureNotificationSharedPreferences(context);
    }

    public ExposureConfiguration get() {
        return new ExposureConfiguration.ExposureConfigurationBuilder()
                .setMinimumRiskScore(15)
                .setDurationAtAttenuationThresholds(
                        prefs.getAttenuationThreshold1(53), prefs.getAttenuationThreshold2(60))
                .setAttenuationScores(1, 2, 3, 4, 5, 6, 7, 8)
                .setDaysSinceLastExposureScores(1, 2, 3, 4, 5, 6, 7, 8)
                .setDurationScores(1, 2, 3, 4, 5, 6, 7, 8)
                .setTransmissionRiskScores(1, 2, 3, 4, 5, 6, 7, 8)
                .build();
    }
}
