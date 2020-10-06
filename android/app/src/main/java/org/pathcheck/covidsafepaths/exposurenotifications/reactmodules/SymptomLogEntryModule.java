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
import org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.SymptomLogEntry;

@SuppressWarnings("unused")
@ReactModule(name = SymptomLogEntryModule.MODULE_NAME)
public class SymptomLogEntryModule extends ReactContextBaseJavaModule {
  static final String MODULE_NAME = "SymptomLogEntryModule";

  public SymptomLogEntryModule(ReactApplicationContext context) {
    super(context);
  }

  @NonNull
  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void addSymptomLogEntry(ReadableMap map, Promise promise) {
    SymptomLogEntry logEntry = SymptomLogEntry.Companion.fromReadableMap(map);
    RealmSecureStorageBte.INSTANCE.upsertLogEntry(logEntry);
    promise.resolve(null);
  }

  @ReactMethod
  public void updateSymptomLogEntry(ReadableMap map, Promise promise) {
    addSymptomLogEntry(map, promise);
  }

  @ReactMethod
  public void getSymptomLogEntries(Promise promise) {
    List<SymptomLogEntry> logEntries = RealmSecureStorageBte.INSTANCE.getLogEntries();

    WritableArray writableArray = new WritableNativeArray();
    for (SymptomLogEntry logEntry : logEntries) {
      writableArray.pushMap(logEntry.toReadableMap());
    }
    promise.resolve(writableArray);
  }

  @ReactMethod
  public void deleteSymptomLogEntry(String id, Promise promise) {
    RealmSecureStorageBte.INSTANCE.deleteLogEntry(id);
    promise.resolve(null);
  }

  @ReactMethod
  public void deleteSymptomLogs(Promise promise) {
    RealmSecureStorageBte.INSTANCE.deleteSymptomLogs();
    promise.resolve(null);
  }

  @ReactMethod
  public void deleteSymptomLogsOlderThan(Integer days, final Promise promise) {
    RealmSecureStorageBte.INSTANCE.deleteSymptomLogsOlderThan(days);
    promise.resolve(null);
  }
}
