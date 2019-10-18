package ghost;

import android.content.Context;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.love2d.android.Channels;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

class GhostInputView extends View implements View.OnTouchListener {
  public String input = "a";

  public GhostInputView(Context context) {
    super(context);

    setOnTouchListener(this);
  }

  @Override
  public boolean onTouch(View v, MotionEvent event) {
    switch (event.getActionMasked()) {
      case MotionEvent.ACTION_POINTER_DOWN:
      case MotionEvent.ACTION_DOWN:
        Channels.nativePush("GHOST_INPUT_DOWN", input);
//        Log.d("GhostInputView", "'" + input + "' down!");
        break;
      case MotionEvent.ACTION_CANCEL:
      case MotionEvent.ACTION_UP:
      case MotionEvent.ACTION_POINTER_UP:
        Channels.nativePush("GHOST_INPUT_UP", input);
//        Log.d("GhostInputView", "'" + input + "' up!");
        break;
    }
    return true;
  }
}

public class GhostInputViewManager extends SimpleViewManager<GhostInputView> {
  @Override
  public @Nonnull
  String getName() {
    return "GhostInputView";
  }

  @Override
  protected @Nonnull
  GhostInputView createViewInstance(@Nonnull ThemedReactContext reactContext) {
    return new GhostInputView(reactContext);
  }

  @ReactProp(name = "input")
  public void setInput(GhostInputView view, @Nullable String input) {
    view.input = input;
  }
}
