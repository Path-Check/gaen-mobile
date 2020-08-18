package org.pathcheck.covidsafepaths.exposurenotifications.dto;

import java.util.UUID;

public class RNExposureInformation {
    private String id;
    private long date;
    private long duration; // Minutes

    public RNExposureInformation(long date, long duration) {
        this.id = UUID.randomUUID().toString();
        this.date = date;
        this.duration = duration;
    }
}
