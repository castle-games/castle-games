package org.love2d.android;

public class Channels {
  native public static void nativeClear(String name);
  native public static String nativeDemand(String name, double timeout);
  native public static int nativeGetCount(String name);
  native public static boolean nativeHasRead(String name, int id);
  native public static String nativePeek(String name);
  native public static String nativePop(String name);
  native public static int nativePush(String name, String value);
  native public static boolean nativeSupply(String name, String value, double timeout);
}
