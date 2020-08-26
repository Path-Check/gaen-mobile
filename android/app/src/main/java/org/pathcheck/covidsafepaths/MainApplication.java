package org.pathcheck.covidsafepaths;

import android.app.Application;
import android.content.Context;
import com.bugsnag.android.Bugsnag;
import com.bugsnag.android.Configuration;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.jakewharton.threetenabp.AndroidThreeTen;
import io.realm.Realm;
import java.lang.reflect.InvocationTargetException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.pathcheck.covidsafepaths.bridge.ExposureNotificationsPackage;

public class MainApplication extends Application implements ReactApplication {

  private static Context context;

  private final ReactNativeHost reactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          List<ReactPackage> packages = new PackageList(this).getPackages();
          packages.add(new ExposureNotificationsPackage());


          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return reactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    MainApplication.context = getApplicationContext();
    AndroidThreeTen.init(this);
    SoLoader.init(this, /* native exopackage */ false);
    Realm.init(this);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
    initializeBugsnag();
  }

  @SuppressWarnings("ConstantConditions")
  private void initializeBugsnag() {
    Configuration config = Configuration.load(this);
    // Disable bugsnag for release builds
    config.setReleaseStage("release".equals(BuildConfig.BUILD_TYPE) ? "production" : "development");
    Set<String> enabledStages = new HashSet<>();
    enabledStages.add("development");
    config.setEnabledReleaseStages(enabledStages);
    Bugsnag.start(this, config);
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context application context.
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> flipperClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        flipperClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException | NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }

  public static Context getContext() {
    return MainApplication.context;
  }
}
