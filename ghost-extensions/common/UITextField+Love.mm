#import <UIKit/UIKit.h>

#include <SDL_events.h>

@implementation UITextField (Love)

// Keys that ImGui cares about right now:
//
// ImGuiKey_Tab,
// ImGuiKey_LeftArrow,
// ImGuiKey_RightArrow,
// ImGuiKey_UpArrow,
// ImGuiKey_DownArrow,
// ImGuiKey_Delete,
// ImGuiKey_Backspace,
// ImGuiKey_Enter,
// ImGuiKey_A,
// ImGuiKey_C,
// ImGuiKey_V,
// ImGuiKey_X,
// ImGuiKey_Y,
// ImGuiKey_Z,

- (NSArray<UIKeyCommand *> *)keyCommands
{
	static NSMutableArray *commands;
	static dispatch_once_t oncetoken;
	dispatch_once(&oncetoken,^{
		commands = [NSMutableArray array];
		
		static NSArray *inputs = @[@"\t",UIKeyInputLeftArrow, UIKeyInputRightArrow, UIKeyInputUpArrow, UIKeyInputDownArrow, @"\b", @"\r"];
		
		// Modifier bits are contiguous, with `UIKeyModifierShift` being the lowest
		unsigned int allmods = UIKeyModifierShift | UIKeyModifierControl | UIKeyModifierAlternate | UIKeyModifierCommand;
		for (NSString *input in inputs)
		{
			[commands addObject:[UIKeyCommand keyCommandWithInput:input modifierFlags:0 action:@selector(keyPressed:)]];
			for (int mod = UIKeyModifierShift; mod <= allmods; mod += UIKeyModifierShift)
				[commands addObject:[UIKeyCommand keyCommandWithInput:input modifierFlags:mod action:@selector(keyPressed:)]];
		}
	});
	return commands;
}

static void pressAndReleaseSDLKey(SDL_Keycode sym, SDL_Scancode scancode)
{
	SDL_Event e;
	e.key.keysym.sym = sym;
	e.key.keysym.scancode = scancode;
	e.type = SDL_KEYDOWN;
	SDL_PushEvent(&e);
	e.type = SDL_KEYUP;
	SDL_PushEvent(&e);
}

- (void)keyPressed:(UIKeyCommand *)keyCommand
{
	if (keyCommand.modifierFlags & UIKeyModifierShift)
		pressAndReleaseSDLKey(SDLK_RSHIFT, SDL_SCANCODE_RSHIFT);
	if (keyCommand.modifierFlags & UIKeyModifierControl)
		pressAndReleaseSDLKey(SDLK_RCTRL, SDL_SCANCODE_RCTRL);
	if (keyCommand.modifierFlags & UIKeyModifierAlternate)
		pressAndReleaseSDLKey(SDLK_RALT, SDL_SCANCODE_RALT);
	if (keyCommand.modifierFlags & UIKeyModifierCommand)
		pressAndReleaseSDLKey(SDLK_RGUI, SDL_SCANCODE_RGUI);
	
	if ([keyCommand.input isEqualToString:@"\t"])
		pressAndReleaseSDLKey(SDLK_TAB, SDL_SCANCODE_TAB);
	else if ([keyCommand.input isEqualToString:UIKeyInputLeftArrow])
		pressAndReleaseSDLKey(SDLK_LEFT, SDL_SCANCODE_LEFT);
	else if ([keyCommand.input isEqualToString:UIKeyInputRightArrow])
		pressAndReleaseSDLKey(SDLK_RIGHT, SDL_SCANCODE_RIGHT);
	else if ([keyCommand.input isEqualToString:UIKeyInputUpArrow])
		pressAndReleaseSDLKey(SDLK_UP, SDL_SCANCODE_UP);
	else if ([keyCommand.input isEqualToString:UIKeyInputDownArrow])
		pressAndReleaseSDLKey(SDLK_DOWN, SDL_SCANCODE_DOWN);
	else if ([keyCommand.input isEqualToString:@"\b"])
		pressAndReleaseSDLKey(SDLK_BACKSPACE, SDL_SCANCODE_BACKSPACE);
	else if ([keyCommand.input isEqualToString:@"\r"])
		pressAndReleaseSDLKey(SDLK_RETURN, SDL_SCANCODE_RETURN);
}

@end
