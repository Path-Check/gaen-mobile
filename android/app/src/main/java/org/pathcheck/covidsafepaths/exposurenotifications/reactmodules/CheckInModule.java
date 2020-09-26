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
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.CheckIn;

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
  public void addCheckIn(ReadableMap map, Promise promise) {
    CheckIn checkIn = CheckIn.Companion.fromReadableMap(map);
    RealmSecureStorageBte.INSTANCE.upsertCheckIn(checkIn);
    promise.resolve(null);
  }

  @ReactMethod
  public void getCheckIns(Promise promise) {
    List<CheckIn> checkIns = RealmSecureStorageBte.INSTANCE.getCheckIns();

    WritableArray writableArray = new WritableNativeArray();
    for (CheckIn checkInStatus : checkIns) {
      writableArray.pushMap(checkInStatus.toReadableMap());
    }
    promise.resolve(writableArray);
  }

  @ReactMethod
  public void deleteCheckins(Promise promise) {
    RealmSecureStorageBte.INSTANCE.deleteCheckins();
    promise.resolve(null);
  }
}
