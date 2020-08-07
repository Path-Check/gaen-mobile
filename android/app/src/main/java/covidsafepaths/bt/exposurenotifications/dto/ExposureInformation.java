package covidsafepaths.bt.exposurenotifications.dto;

public class ExposureInformation {
    private String id;
    private long date;
    private long duration; // Minutes

    public ExposureInformation(String id, long date, long duration) {
        this.id = id;
        this.date = date;
        this.duration = duration;
    }
}
