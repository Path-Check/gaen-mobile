package org.pathcheck.covidsafepaths.exposurenotifications.dto;

import java.util.UUID;

@SuppressWarnings({"FieldCanBeLocal", "unused"})
public class RNExposureInformation {
  private String id;
  private long date; // Milliseconds
  private double duration; // Minutes

  public RNExposureInformation(long date, double duration) {
    this.id = UUID.randomUUID().toString();
    this.date = date;
    this.duration = duration;
  }
}
