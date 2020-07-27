package covidsafepaths.bt.exposurenotifications.utils;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.Random;

public class Util {
    /**
     * Create an array in React Native friendly format. Helpful when sending an array in a {@link Callback}.
     * @param args The values that make up the array.
     * @return React Native friendly array format.
     */
    public static WritableArray toWritableArray(String... args) {
        WritableArray array = new WritableNativeArray();
        for (String str:
             args) {
            array.pushString(str);
        }

        return array;
    }

    public static WritableArray getEnStatusWritableArray(boolean enabled) {
        final String enablement = enabled ?  CallbackMessages.EN_ENABLEMENT_ENABLED : CallbackMessages.EN_ENABLEMENT_DISABLED;

        // Android differs from iOS in that an app can always request to enable Exposure Notifications. No need to have it authorized
        // in the OS settings prior to enabling it in the app. For this reason, whether this app is enabled or disabled, we can
        // safely say that it is authorized.
        return Util.toWritableArray(CallbackMessages.EN_AUTHORIZATION_AUTHORIZED, enablement);
    }
//
//    public static String generateRandomEncodedString() {
//        String randomString = getRandomString();
//        return Base64.encodeToString(randomString.getBytes(), Base64.DEFAULT);
//    }
//
//    private static String getRandomString() {
//        final String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
//        final StringBuilder salt = new StringBuilder();
//        final int length = getRandomNumber();
//        final Random rnd = new Random();
//
//        while (salt.length() < length) { // length of the random string.
//            int index = (int) (rnd.nextFloat() * SALTCHARS.length());
//            salt.append(SALTCHARS.charAt(index));
//        }
//        return salt.toString();
//
//    }

    public static int getRandomNumber() {
        final int min = 20;
        final int max = 200;
        return new Random().nextInt((max - min) + 1) + min;
    }
}