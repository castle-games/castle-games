package ghost;

import android.app.Activity;
import android.content.Intent;
import android.view.ViewGroup;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.love2d.android.GameActivity;

import javax.annotation.Nullable;

public class GhostViewManager extends SimpleViewManager<ViewGroup> {
  private GameActivity gameActivity;

  @Override
  public String getName() {
    return "GhostView";
  }

  @Override
  protected ViewGroup createViewInstance(ThemedReactContext reactContext) {
    ensureGameActivityInitialized(reactContext);
    gameActivity.resetNative();
    gameActivity.startNative();
    gameActivity.resume();
    return gameActivity.getView();
  }

  private void ensureGameActivityInitialized(ThemedReactContext reactContext) {
    if (gameActivity == null) {
      Activity activity = reactContext.getCurrentActivity();
      gameActivity = new GameActivity();
      gameActivity.setContexts(activity, reactContext.getApplicationContext());
      gameActivity.handleIntent(new Intent(activity, GameActivity.class));
      GameActivity.setMetricsFromDisplay(activity.getWindowManager().getDefaultDisplay());
      gameActivity.loadLibraries();
    }
  }

  @ReactProp(name = "uri")
  public void setUri(ViewGroup view, @Nullable String uri) {
    GameActivity.ghostRootUri = uri;
  }
}
