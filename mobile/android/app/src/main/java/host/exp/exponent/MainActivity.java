package host.exp.exponent;

import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.ReactPackage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import expo.core.interfaces.Package;
import host.exp.exponent.generated.DetachBuildConstants;
import host.exp.exponent.experience.DetachActivity;

public class MainActivity extends DetachActivity {

  @Override
  public String publishedUrl() {
    return "exp://exp.host/@nikki/castle";
  }

  @Override
  public String developmentUrl() {
    return DetachBuildConstants.DEVELOPMENT_URL;
  }

  @Override
  public List<String> sdkVersions() {
    return new ArrayList<>(Arrays.asList("30.0.0"));
  }

  @Override
  public List<ReactPackage> reactPackages() {
    return ((MainApplication) getApplication()).getPackages();
  }

  @Override
  public List<Package> expoPackages() {
    // Here you can add your own packages.
    return super.expoPackages();
  }

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @Override
  public Bundle initialProps(Bundle expBundle) {
    // Add extra initialProps here
    return expBundle;
  }


  @Override
  public boolean dispatchKeyEvent(KeyEvent event) {
    // System behavior for volume, camera, zoom buttons
    int keyCode = event.getKeyCode();
    if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN ||
        keyCode == KeyEvent.KEYCODE_VOLUME_UP ||
        keyCode == KeyEvent.KEYCODE_CAMERA ||
        keyCode == KeyEvent.KEYCODE_ZOOM_IN ||
        keyCode == KeyEvent.KEYCODE_ZOOM_OUT) {
      return false;
    }
    return super.dispatchKeyEvent(event);
  }


  // Called from JNI by Love's code

  public void setImmersiveMode(boolean immersive_mode) {
  }

  public boolean getImmersiveMode() {
    return false;
  }
}
