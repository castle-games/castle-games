package ghost;

import android.content.Context;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.SparseArray;
import android.view.MotionEvent;
import android.view.View;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.love2d.android.Channels;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

class GhostInputZone extends View implements View.OnTouchListener {
  public GhostInputZone(Context context) {
    super(context);

    setOnTouchListener(this);
  }

  private class ChildState {
    int id;
    double x;
    double y;
    double width;
    double height;
    String keyCode = null;
    boolean prevDown = false;
  }

  private SparseArray<ChildState> childStates = new SparseArray<ChildState>();

  public int hapticsDuration = 40;
  public int hapticsAmplitude = 80;

  static long lastVibrateTime = System.currentTimeMillis();

  public void updateChild(int childId, double x, double y, double width, double height, ReadableMap config) {
    ChildState childState = childStates.get(childId);
    if (childState == null) {
      childState = new ChildState();
      childStates.put(childId, childState);
    }

    childState.id = childId;
    childState.x = x;
    childState.y = y;
    childState.width = width;
    childState.height = height;

    if (config.hasKey("keyCode")) {
      childState.keyCode = config.getString("keyCode");
    }
  }

  @Override
  public boolean onTouch(View v, MotionEvent event) {
    // See if we want to count this as a pressed touch or not
    boolean down = false;
    switch (event.getActionMasked()) {
      case MotionEvent.ACTION_POINTER_DOWN:
      case MotionEvent.ACTION_DOWN:
        down = true;
        break;
      case MotionEvent.ACTION_MOVE:
        down = true;
        break;
      case MotionEvent.ACTION_CANCEL:
      case MotionEvent.ACTION_UP:
      case MotionEvent.ACTION_POINTER_UP:
      case MotionEvent.ACTION_OUTSIDE:
        down = false;
        break;
    }

    // Get zone-relative x and y of touch
    int[] zonePos = new int[2];
    getLocationOnScreen(zonePos);
    int zoneX = zonePos[0];
    int zoneY = zonePos[1];
    double x = event.getRawX() - zoneX;
    double y = event.getRawY() - zoneY;

    // See if it hit someone
    ChildState closest = null;
    double closestSquaredDist = Double.MAX_VALUE;
    if (down) {
      for (int i = 0; i < childStates.size(); ++i) {
        ChildState childState = childStates.valueAt(i);

        if (childState.x <= x && x <= childState.x + childState.width &&
            childState.y <= y && y <= childState.y + childState.height) {
          double centerX = childState.x + 0.5 * childState.width;
          double centerY = childState.y + 0.5 * childState.height;
          double dx = x - centerX;
          double dy = y - centerY;
          double squaredDist = dx * dx + dy * dy;
          if (squaredDist < closestSquaredDist) {
            closest = childState;
            closestSquaredDist = squaredDist;
          }
        }
      }
    }

    // Send events
    boolean vibrate = false;
    for (int i = 0; i < childStates.size(); ++i) {
      ChildState childState = childStates.valueAt(i);
      boolean currDown = closest != null && childState.id == closest.id;
      if (currDown != childState.prevDown) {
        if (currDown) {
          Channels.nativePush("GHOST_KEY_DOWN", childState.keyCode);
          vibrate = true;
        } else {
          Channels.nativePush("GHOST_KEY_UP", childState.keyCode);
        }
      }
      childState.prevDown = currDown;
    }

    // Vibrate if needed
    if (vibrate) {
      long currTime = System.currentTimeMillis();
      if (currTime - lastVibrateTime > 120) {
        lastVibrateTime = currTime;
        Vibrator vibrator = (Vibrator) getContext().getSystemService(Context.VIBRATOR_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          vibrator.vibrate(VibrationEffect.createOneShot(hapticsDuration, hapticsAmplitude));
        } else {
          vibrator.vibrate(hapticsDuration);
        }
      }
    }

    return true;
  }
}

public class GhostInputZoneManager extends SimpleViewManager<GhostInputZone> {
  @Override
  public @Nonnull
  String getName() {
    return "GhostInputZone";
  }

  @Override
  protected @Nonnull
  GhostInputZone createViewInstance(@Nonnull ThemedReactContext reactContext) {
    return new GhostInputZone(reactContext);
  }

  @ReactProp(name = "haptics")
  public void setHaptics(GhostInputZone view, ReadableMap haptics) {
    if (haptics.hasKey("duration")) {
      view.hapticsDuration = haptics.getInt("duration");
    }
    if (haptics.hasKey("amplitude")) {
      view.hapticsAmplitude = haptics.getInt("amplitude");
    }
  }

  @Override
  public void receiveCommand(@Nonnull GhostInputZone zone, int commandId, @Nullable ReadableArray args) {
    super.receiveCommand(zone, commandId, args);
    if (commandId == 0) {
      int childId = args.getInt(0);
      double x = args.getInt(1);
      double y = args.getInt(2);
      double width = args.getInt(3);
      double height = args.getInt(4);
      ReadableMap config = args.getMap(5);
      zone.updateChild(childId, x, y, width, height, config);
    }
  }
}
