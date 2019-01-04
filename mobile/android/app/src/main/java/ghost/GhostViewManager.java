package ghost;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import org.love2d.android.GameActivity;

public class GhostViewManager extends SimpleViewManager<GhostView> {
  public static final String REACT_CLASS = "GhostView";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected GhostView createViewInstance(ThemedReactContext reactContext) {
    Activity activity = reactContext.getCurrentActivity();
    Intent intent = new Intent(activity, GameActivity.class);
    activity.startActivity(intent);
    return new GhostView(reactContext);
  }
}
