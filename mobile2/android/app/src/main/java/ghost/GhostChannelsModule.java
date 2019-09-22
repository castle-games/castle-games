package ghost;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;

import org.love2d.android.Channels;

public class GhostChannelsModule extends ReactContextBaseJavaModule {
  GhostChannelsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "GhostChannels";
  }

  @ReactMethod
  void clearAsync(String name, Promise promise) {
    Channels.nativeClear(name);
    promise.resolve(null);
  }

  @ReactMethod
  void demandAsync(String name, ReadableMap options, Promise promise) {
    if (options.hasKey("timeout")) {
      promise.resolve(Channels.nativeDemand(name, options.getDouble("timeout")));
    } else {
      promise.resolve(Channels.nativeDemand(name, -1));
    }
  }

  @ReactMethod
  void getCountAsync(String name, Promise promise) {
    promise.resolve(Channels.nativeGetCount(name));
  }

  @ReactMethod
  void hasReadAsync(String name, Integer id, Promise promise) {
    promise.resolve(Channels.nativeHasRead(name, id));
  }

  @ReactMethod
  void peekAsync(String name, Promise promise) {
    promise.resolve(Channels.nativePeek(name));
  }

  @ReactMethod
  void popAsync(String name, Promise promise) {
    promise.resolve(Channels.nativePop(name));
  }

  @ReactMethod
  void popAllAsync(String name, Promise promise) {
    WritableArray array = Arguments.createArray();
    while (true) {
      String val = Channels.nativePop(name);
      if (val == null) {
        break;
      }
      array.pushString(val);
    }
    promise.resolve(array);
  }

  @ReactMethod
  void pushAsync(String name, String value, Promise promise) {
    promise.resolve(Channels.nativePush(name, value));
  }

  @ReactMethod
  void supplyAsync(String name, String value, ReadableMap options, Promise promise) {
    if (options.hasKey("timeout")) {
      promise.resolve(Channels.nativeSupply(name, value, options.getDouble("timeout")));
    } else {
      promise.resolve(Channels.nativeSupply(name, value, -1));
    }
  }

  static {
    System.loadLibrary("love");
  }
}
