package ghost;

import android.app.Activity;
import android.content.Intent;
import android.view.ViewGroup;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import org.love2d.android.GameActivity;

public class GhostViewManager extends SimpleViewManager<ViewGroup> {
  public static final String REACT_CLASS = "GhostView";

  private GameActivity gameActivity;

  @Override
  public String getName() {
    return REACT_CLASS;
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
}
