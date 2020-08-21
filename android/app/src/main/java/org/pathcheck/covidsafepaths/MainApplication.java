package org.pathcheck.covidsafepaths;

import android.app.Application;
import android.content.Context;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.jakewharton.threetenabp.AndroidThreeTen;
import com.bugsnag.android.Bugsnag;

import org.pathcheck.covidsafepaths.bridge.ExposureNotificationsPackage;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import io.realm.Realm;

public class MainApplication extends Application implements ReactApplication {

    private static Context context;

    private final ReactNativeHost mReactNativeHost =
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
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        MainApplication.context = getApplicationContext();
        AndroidThreeTen.init(this);
        SoLoader.init(this, /* native exopackage */ false);
        Realm.init(this);
        initializeFlipper(this); // Remove this line if you don't want Flipper enabled
        Bugsnag.start(this);
    }

    /**
     * Loads Flipper in React Native templates.
     *
     * @param context
     */
    private static void initializeFlipper(Context context) {
        if (BuildConfig.DEBUG) {
            try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
                Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
                aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }

    public static Context getContext() {
        return MainApplication.context;
    }
}
