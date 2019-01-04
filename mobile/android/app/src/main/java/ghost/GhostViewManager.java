package ghost;

import android.view.View;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import org.love2d.android.GameActivity;

public class GhostViewManager extends SimpleViewManager<View> {
  public static final String REACT_CLASS = "GhostView";

  protected GameActivity mGameActivity;

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected View createViewInstance(ThemedReactContext reactContext) {
    if (mGameActivity == null) {
      mGameActivity = new GameActivity();
      mGameActivity.loadLibraries();
    }
    View view = mGameActivity.startNative(reactContext.getCurrentActivity());
    mGameActivity.resume();
    return view;
//    return new GhostView(reactContext, mGameActivity);
  }
}
