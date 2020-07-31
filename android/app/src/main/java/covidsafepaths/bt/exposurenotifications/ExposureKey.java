package covidsafepaths.bt.exposurenotifications;

public class ExposureKey {
    public String key;
    public int rollingPeriod;
    public int rollingStartNumber;
    public int transmissionRisk;

    public ExposureKey(String key, int rollingPeriod, int rollingStartNumber, int transmissionRisk) {
        this.key = key;
        this.rollingPeriod = rollingPeriod;
        this.rollingStartNumber = rollingStartNumber;
        this.transmissionRisk = transmissionRisk;
    }

}
