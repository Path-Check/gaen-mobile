package org.pathcheck.covidsafepaths.bridge;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import org.pathcheck.covidsafepaths.exposurenotifications.DebugMenuModule;
import org.pathcheck.covidsafepaths.exposurenotifications.DeviceInfoModule;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureHistoryModule;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureKeyModule;
import org.pathcheck.covidsafepaths.exposurenotifications.ExposureNotificationsModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

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

        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
