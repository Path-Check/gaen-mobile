package org.pathcheck.covidsafepaths.exposurenotifications.reactmodules;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.module.annotations.ReactModule;
import java.util.List;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.RealmSecureStorageBte;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.CheckInStatus;

@SuppressWarnings("unused")
@ReactModule(name = CheckInModule.MODULE_NAME)
public class CheckInModule extends ReactContextBaseJavaModule {
  static final String MODULE_NAME = "CheckInModule";

  public CheckInModule(ReactApplicationContext context) {
    super(context);
  }

  @NonNull
  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void saveCheckInStatus(ReadableMap map, Promise promise) {
    CheckInStatus checkInStatus = CheckInStatus.Companion.fromReadableMap(map);
    RealmSecureStorageBte.INSTANCE.upsertCheckInStatus(checkInStatus);
    promise.resolve(null);
  }

  @ReactMethod
  public void getCheckInStatuses(Promise promise) {
    List<CheckInStatus> checkInStatuses = RealmSecureStorageBte.INSTANCE.getCheckInStatuses();

    WritableArray writableArray = new WritableNativeArray();
    for (CheckInStatus checkInStatus : checkInStatuses) {
      writableArray.pushMap(checkInStatus.toReadableMap());
    }
    promise.resolve(writableArray);
  }
}
