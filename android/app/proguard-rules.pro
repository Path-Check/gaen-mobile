# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
-dontobfuscate

-keepattributes LineNumberTable,SourceFile

# This allows proguard to strip isLoggable() blocks containing only <=INFO log
# code from release builds.
-assumenosideeffects class android.util.Log {
  public static *** d(...);
  public static *** v(...);
  public static *** isLoggable(...);
}

-dontwarn android.support.annotation.**

-keep class androidx.core.app.CoreComponentFactory { *; }

# Guava configuration.
-dontwarn com.google.errorprone.**
-dontwarn sun.misc.Unsafe
-dontwarn java.lang.ClassValue

# AutoValue configuration.
-keep class * extends com.google.auto
-dontwarn com.google.auto.**

# Storage
-dontwarn java.nio.ByteBuffer

# BLE Configuration constants
-keep class com.google.android.apps.exposurenotification.config.** { *; }

# GSON
-keepattributes Signature

# For using GSON @Expose annotation
-keepattributes *Annotation*

# Gson specific classes
-dontwarn sun.misc.**
#-keep class com.google.gson.stream.** { *; }

# Application classes that will be serialized/deserialized over Gson
-keep class org.pathcheck.covidsafepaths.exposurenotifications.dto.** { <fields>; }
-keep class org.pathcheck.covidsafepaths.exposurenotifications.storage.objects.** { <fields>; }

# Prevent proguard from stripping interface information from TypeAdapter, TypeAdapterFactory,
# JsonSerializer, JsonDeserializer instances (so they can be used in @JsonAdapter)
-keep class * extends com.google.gson.TypeAdapter
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Prevent R8 from leaving Data object members always null
-keepclassmembers,allowobfuscation class * {
  @com.google.gson.annotations.SerializedName <fields>;
}

# Volley.
-dontwarn org.apache.http.**
-dontwarn android.net.http.**
-dontwarn com.android.volley.**

# GMSCore
-keep class org.checkerframework.checker.nullness.qual.** { *; }
-dontwarn org.checkerframework.checker.nullness.qual.**

# Joda
-dontwarn org.joda.convert.**

# -----------------------------------------------
# React Native Libraries
# -----------------------------------------------

# react-native
-keep class com.facebook.react.devsupport.** { *; }
-dontwarn com.facebook.react.devsupport.**

# react-native-config, prevents obfuscating of .env flags
-keep class org.pathcheck.covidsafepaths.BuildConfig { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# react-native-svg
-keep public class com.horcrux.svg.** {*;}