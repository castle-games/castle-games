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
    Activity activity = reactContext.getCurrentActivity();
    Intent intent = new Intent(activity, GameActivity.class);

    // Launch activity normally -- works
//    activity.startActivity(intent);

    // Create own instance
    gameActivity = new GameActivity();
    gameActivity.setMetricsFromDisplay(activity.getWindowManager().getDefaultDisplay());
    gameActivity.setContexts(activity, reactContext.getApplicationContext());
    gameActivity.loadLibraries();
    gameActivity.onNewIntent(intent);
    gameActivity.resume();
    ViewGroup view = gameActivity.getView();
//    gameActivity.onCreate(null, null);

    return view;
  }
}
