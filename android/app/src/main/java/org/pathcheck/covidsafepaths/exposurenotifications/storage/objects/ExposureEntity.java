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

package org.pathcheck.covidsafepaths.exposurenotifications.storage.objects;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;
import java.util.Objects;
import java.util.UUID;

/**
 * An exposure element for display in the exposures UI.
 *
 * <p>Partners should implement a daily TTL/expiry, for on-device storage of this data, and must
 * ensure compliance with all applicable laws and requirements with respect to encryption, storage,
 * and retention polices for end user data.
 */
public class ExposureEntity extends RealmObject {

  private @PrimaryKey long id = UUID.randomUUID().getMostSignificantBits();

  /**
   * The dateMillisSinceEpoch provided by the ExposureInformation in the Exposure Notifications
   * API.
   *
   * <p>Represents a date of an exposure in millis since epoch rounded to the day.
   */
  private long dateMillisSinceEpoch;

  /**
   * The timestamp in millis since epoch for when the exposure notification status update was
   * received.
   */
  private long receivedTimestampMs;

  public ExposureEntity() {
  }

  ExposureEntity(long dateMillisSinceEpoch, long receivedTimestampMs) {
    this.receivedTimestampMs = receivedTimestampMs;
    this.dateMillisSinceEpoch = dateMillisSinceEpoch;
  }

  /**
   * Creates an ExposureEntity.
   *
   * @param dateMillisSinceEpoch the date of an exposure in millis since epoch rounded to the day of
   *                             the detected exposure
   * @param receivedTimestampMs  the timestamp in milliseconds since epoch for when the exposure was
   *                             received by the app
   */
  public static ExposureEntity create(long dateMillisSinceEpoch, long receivedTimestampMs) {
    return new ExposureEntity(dateMillisSinceEpoch, receivedTimestampMs);
  }

  public long getId() {
    return id;
  }

  public long getReceivedTimestampMs() {
    return receivedTimestampMs;
  }

  public long getDateMillisSinceEpoch() {
    return dateMillisSinceEpoch;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ExposureEntity that = (ExposureEntity) o;
    return id == that.id
        && dateMillisSinceEpoch == that.dateMillisSinceEpoch
        && receivedTimestampMs == that.receivedTimestampMs;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, dateMillisSinceEpoch, receivedTimestampMs);
  }
}
