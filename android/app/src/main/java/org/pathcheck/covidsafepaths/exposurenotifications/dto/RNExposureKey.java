package org.pathcheck.covidsafepaths.exposurenotifications.dto;

import androidx.annotation.VisibleForTesting;

@SuppressWarnings({"FieldCanBeLocal", "unused"})
public class RNExposureKey {
  @VisibleForTesting
  public String key;
  private int rollingPeriod;
  private int rollingStartNumber;
  private int transmissionRisk;

  public RNExposureKey(String key, int rollingPeriod, int rollingStartNumber, int transmissionRisk) {
    this.key = key;
    this.rollingPeriod = rollingPeriod;
    this.rollingStartNumber = rollingStartNumber;
    this.transmissionRisk = transmissionRisk;
  }
}
