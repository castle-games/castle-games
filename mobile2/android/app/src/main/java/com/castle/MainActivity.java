package com.castle;

import android.view.KeyEvent;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Castle";
    }

    // System behavior for volume, camera, zoom buttons
    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
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
