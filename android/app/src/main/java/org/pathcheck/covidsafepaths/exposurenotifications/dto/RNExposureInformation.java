package org.pathcheck.covidsafepaths.exposurenotifications.dto;

import java.util.UUID;

@SuppressWarnings({"FieldCanBeLocal", "unused"})
public class RNExposureInformation {
  private String id;
  private long date; // Milliseconds

  public RNExposureInformation(long date) {
    this.id = UUID.randomUUID().toString();
    this.date = date;
  }
}
