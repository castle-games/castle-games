package ghost;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

public class GhostViewManager extends SimpleViewManager<GhostView> {
  public static final String REACT_CLASS = "GhostView";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected GhostView createViewInstance(ThemedReactContext reactContext) {
    return new GhostView(reactContext);
  }
}
