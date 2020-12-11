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
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;

/**
 * Key value storage for ExposureNotification.
 */
public class ExposureNotificationSharedPreferences {

  private static final String SHARED_PREFERENCES_FILE =
      "ExposureNotificationSharedPreferences.SHARED_PREFERENCES_FILE";

  private static final String LAST_DETECTION_PROCESS_DATE =
      "ExposureNotificationSharedPreferences.LAST_DETECTION_PROCESS_DATE";

  private static final String TRIGGER_THRESHOLD_WEIGHTED_DURATION =
      "ExposureNotificationSharedPreferences.TRIGGER_THRESHOLD_WEIGHTED_DURATION";

  private static final String ATTENUATION_DURATION_THRESHOLDS =
      "ExposureNotificationSharedPreferences.ATTENUATION_DURATION_THRESHOLDS";

  private static final String ATTENUATION_BUCKET_WEIGHTS =
      "ExposureNotificationSharedPreferences.ATTENUATION_BUCKET_WEIGHTS";

  private static final String REPORT_TYPE_WEIGHTS =
      "ExposureNotificationSharedPreferences.REPORT_TYPE_WEIGHTS";

  private static final String INFECTIOUSNESS_WEIGHTS =
      "ExposureNotificationSharedPreferences.INFECTIOUSNESS_WEIGHTS";

  private static final String INFECTIOUSNESS_WHEN_DAY_SINCE_ONSET_MISSING =
      "ExposureNotificationSharedPreferences.INFECTIOUSNESS_WHEN_DAY_SINCE_ONSET_MISSING";

  private static final String DAYS_SINCE_ONSET_TO_INFECTIOUSNESS =
      "ExposureNotificationSharedPreferences.DAYS_SINCE_ONSET_TO_INFECTIOUSNESS";

  private static final String REPORT_TYPE_WHEN_MISSING =
      "ExposureNotificationSharedPreferences.REPORT_TYPE_WHEN_MISSING";

  private static final String ESCROW_VERIFICATION_ACCESS_TOKEN =
      "ExposureNotificationSharedPreferences.ESCROW_VERIFICATION_ACCESS_TOKEN";

  private static final String ESCROW_VERIFICATION_REFRESH_TOKEN =
      "ExposureNotificationSharedPreferences.ESCROW_VERIFICATION_REFRESH_TOKEN";

  private final SharedPreferences sharedPreferences;

  public ExposureNotificationSharedPreferences(Context context) {
    // These shared preferences are stored in {@value Context#MODE_PRIVATE} to be made only
    // accessible by the app.
    sharedPreferences = context.getSharedPreferences(SHARED_PREFERENCES_FILE, Context.MODE_PRIVATE);
  }

  public void setLastDetectionProcessDate(Long date) {
    sharedPreferences.edit().putLong(LAST_DETECTION_PROCESS_DATE, date).commit();
  }

  public Long getLastDetectionProcessDate() {
    long date = sharedPreferences.getLong(LAST_DETECTION_PROCESS_DATE, -1);
    return date != -1 ? date : null;
  }

  public void setTriggerThresholdWeightedDuration(Integer duration) {
    sharedPreferences.edit().putInt(TRIGGER_THRESHOLD_WEIGHTED_DURATION, duration).commit();
  }

  public Integer getTriggerThresholdWeightedDuration(Integer defaultValue) {
    return sharedPreferences.getInt(TRIGGER_THRESHOLD_WEIGHTED_DURATION, defaultValue);
  }

  public void setAttenuationDurationThresholds(List<Integer> thresholds) {
    sharedPreferences.edit().putString(ATTENUATION_DURATION_THRESHOLDS, new Gson().toJson(thresholds)).commit();
  }

  public List<Integer> getAttenuationDurationThresholds(List<Integer> defaultValue) {
    String json = sharedPreferences.getString(ATTENUATION_DURATION_THRESHOLDS, null);
    return json == null
        ? defaultValue
        : new Gson().fromJson(json, new TypeToken<List<Integer>>() {}.getType());
  }

  public void setAttenuationBucketWeights(List<Double> weights) {
    sharedPreferences.edit().putString(ATTENUATION_BUCKET_WEIGHTS, new Gson().toJson(weights)).commit();
  }

  public List<Double> getAttenuationBucketWeights(List<Double> defaultValue) {
    String json = sharedPreferences.getString(ATTENUATION_BUCKET_WEIGHTS, null);
    return json == null
        ? defaultValue
        : new Gson().fromJson(json, new TypeToken<List<Double>>() {}.getType());
  }

  public void setReportTypeWeights(List<Double> weights) {
    sharedPreferences.edit().putString(REPORT_TYPE_WEIGHTS, new Gson().toJson(weights)).commit();
  }

  public List<Double> getReportTypeWeights(List<Double> defaultValue) {
    String json = sharedPreferences.getString(REPORT_TYPE_WEIGHTS, null);
    return json == null
        ? defaultValue
        : new Gson().fromJson(json, new TypeToken<List<Double>>() {}.getType());
  }

  public void setInfectiousnessWeights(List<Double> weights) {
    sharedPreferences.edit().putString(INFECTIOUSNESS_WEIGHTS, new Gson().toJson(weights)).commit();
  }

  public List<Double> getInfectiousnessWeights(List<Double> defaultValue) {
    String json = sharedPreferences.getString(INFECTIOUSNESS_WEIGHTS, null);
    return json == null
        ? defaultValue
        : new Gson().fromJson(json, new TypeToken<List<Double>>() {}.getType());
  }

  public void setInfectiousnessWhenDaysSinceOnsetMissing(Integer infectiousness) {
    sharedPreferences.edit().putInt(INFECTIOUSNESS_WHEN_DAY_SINCE_ONSET_MISSING, infectiousness).commit();
  }

  public Integer getInfectiousnessWhenDaysSinceOnsetMissing(Integer defaultValue) {
    return sharedPreferences.getInt(INFECTIOUSNESS_WHEN_DAY_SINCE_ONSET_MISSING, defaultValue);
  }

  public void setDaysSinceOnsetToInfectiousness(Map<Integer, Integer> map) {
    sharedPreferences.edit().putString(DAYS_SINCE_ONSET_TO_INFECTIOUSNESS, new Gson().toJson(map)).commit();
  }

  public Map<Integer, Integer> getDaysSinceOnsetToInfectiousness(Map<Integer, Integer> defaultValue) {
    String json = sharedPreferences.getString(DAYS_SINCE_ONSET_TO_INFECTIOUSNESS, null);
    return json == null
        ? defaultValue
        : new Gson().fromJson(json, new TypeToken<Map<Integer, Integer>>() {}.getType());
  }

  public void setReportTypeWhenMissing(Integer reportType) {
    sharedPreferences.edit().putInt(REPORT_TYPE_WHEN_MISSING, reportType).commit();
  }

  public Integer getReportTypeWhenMissing(Integer defaultValue) {
    return sharedPreferences.getInt(REPORT_TYPE_WHEN_MISSING, defaultValue);
  }

  public void setEscrowVerificationTokens(@Nullable String accessToken, @Nullable String refreshToken) {
    sharedPreferences.edit()
        .putString(ESCROW_VERIFICATION_ACCESS_TOKEN, accessToken)
        .putString(ESCROW_VERIFICATION_REFRESH_TOKEN, refreshToken)
        .commit();
  }

  public String getEscrowVerificationAccessToken(String defaultValue) {
    return sharedPreferences.getString(ESCROW_VERIFICATION_ACCESS_TOKEN, defaultValue);
  }

  public String getEscrowVerificationRefreshToken(String defaultValue) {
    return sharedPreferences.getString(ESCROW_VERIFICATION_REFRESH_TOKEN, defaultValue);
  }
}
