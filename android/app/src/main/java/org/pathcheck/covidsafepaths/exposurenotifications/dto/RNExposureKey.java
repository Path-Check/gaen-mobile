package org.pathcheck.covidsafepaths.exposurenotifications.dto;

@SuppressWarnings({"FieldCanBeLocal", "unused"})
public class RNExposureKey {
  private String key;
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
