package ghost;

import android.content.Context;
import android.view.View;

import org.love2d.android.GameActivity;

public class GhostView extends View {
  protected GameActivity mGameActivity;

  public GhostView(Context context, GameActivity gameActivity) {
    super(context);

    mGameActivity = gameActivity;
  }
}
