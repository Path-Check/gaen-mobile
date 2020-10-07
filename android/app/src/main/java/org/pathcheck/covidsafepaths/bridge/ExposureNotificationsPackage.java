package org.pathcheck.covidsafepaths.bridge;

import androidx.annotation.NonNull;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.pathcheck.covidsafepaths.exposurenotifications.reactmodules.DebugMenuModule;
import org.pathcheck.covidsafepaths.exposurenotifications.reactmodules.DeviceInfoModule;
import org.pathcheck.covidsafepaths.exposurenotifications.reactmodules.ExposureHistoryModule;
import org.pathcheck.covidsafepaths.exposurenotifications.reactmodules.ExposureKeyModule;
import org.pathcheck.covidsafepaths.exposurenotifications.reactmodules.ExposureNotificationsModule;
import org.pathcheck.covidsafepaths.exposurenotifications.reactmodules.SymptomLogEntryModule;
import org.pathcheck.covidsafepaths.exposurenotifications.reactmodules.UtilsModule;

public class ExposureNotificationsPackage implements ReactPackage {
  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new ExposureNotificationsModule(reactContext));
    modules.add(new DebugMenuModule(reactContext));
    modules.add(new ExposureKeyModule(reactContext));
    modules.add(new DeviceInfoModule(reactContext));
    modules.add(new ExposureHistoryModule(reactContext));
    modules.add(new UtilsModule(reactContext));
    modules.add(new SymptomLogEntryModule(reactContext));

    return modules;
  }

  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
