package org.pathcheck.covidsafepaths.exposurenotifications.dto;

import java.util.UUID;

public class RNDiagnosisKey {
  private String id;
  private long rollingStartNumber;

  public RNDiagnosisKey(long rollingStartNumber) {
    this.id = UUID.randomUUID().toString();
    this.rollingStartNumber = rollingStartNumber;
  }
}
