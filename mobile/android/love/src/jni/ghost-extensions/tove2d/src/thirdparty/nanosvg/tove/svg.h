/*
 * TÖVE - Animated vector graphics for LÖVE.
 * https://github.com/poke1024/Tove
 *
 * Portions taken from NanoSVG
 * Copyright (c) 2019, Bernhard Liebl
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

struct NSVGrasterizer;
struct NSVGimage;
struct NSVGcachedPaint;
struct NSVGpaint;
struct NSVGshape;
struct NSVGparser;

typedef uint8_t TOVEclipPathIndex;

#define TOVE_MAX_CLIP_PATHS 255 			// also note TOVEclipPathIndex

struct TOVEclip {
	TOVEclipPathIndex* index;				// Array of clip path indices (of related NSVGimage).
	TOVEclipPathIndex count;				// Number of clip paths in this set.
};

struct TOVEclipPathDefinition {
	char id[64];							// Unique id of this clip path (from SVG).
	NSVGshape* shapes;						// Linked list of shapes in this clip path.
	float xform[6];							// Transform context at point of definition.
	TOVEclipPathDefinition* next;			// Pointer to next clip path or NULL.
};

struct TOVEclipPath {
	TOVEclipPathDefinition* definition;
	TOVEclipPathIndex index;				// Unique internal index of this clip path.
	float xform[6];							// Transform for instanced usage.
	NSVGshape* shapes;
	TOVEclipPath* next;
};

struct TOVEimageClip {
	TOVEclipPathDefinition* definitions;	// Linked list of clip path definitions in the image.
	TOVEclipPath* instances;				// Linked list of clip path instances in the image.
};

struct TOVEgradientStop {
    uint32_t color;
    float offset;
};

TOVEclipPathDefinition* tove__addClipPathDefinition(NSVGparser* p, const char* name);
int tove__findClipPath(NSVGparser* p, const char* name, const float *xform);
void tove__deleteClipPaths(TOVEimageClip* clip);
void tove__finishParse(NSVGparser* p);
