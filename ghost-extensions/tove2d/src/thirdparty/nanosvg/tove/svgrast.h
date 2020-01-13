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

struct TOVEstencil {
    unsigned char* data;
    int32_t size;
    int32_t stride;
};

struct TOVEdither {
    void *data;
	uint32_t stride;
	void **rows;
};

struct TOVEcachedPaint {
	NSVGpaint *paint;
	int32_t ditherY;
	int32_t ditherSpan[2];
};

enum TOVEditherType {
	TOVE_NSVG_DITHER_NONE,
	TOVE_NSVG_DITHER_DIFFUSION,
	TOVE_NSVG_DITHER_ORDERED
};

struct TOVEnoise {
	float amount;
	const float *matrix;
	int16_t n;
};

struct TOVErasterizerQuality {
	struct {
		TOVEditherType type;
		const float *matrix;
		int16_t matrix_width;
		int16_t matrix_height;
		float spread;
	} dither;
	TOVEnoise noise;
	void *palette;
};

typedef void (*TOVEscanlineFunction)(
	NSVGrasterizer *rasterizer,
	int x,
	int y,
	int n,
	float tx,
	float ty,
	float scale,
	NSVGcachedPaint* cache,
	TOVEclip* clip);

void tove_deleteRasterizer(NSVGrasterizer* r);

TOVEscanlineFunction tove__initPaint(
	NSVGcachedPaint* cache,
	const NSVGrasterizer* r,
	NSVGpaint* paint,
	float opacity,
	bool &initCacheColors);

bool tove__rasterize(
	NSVGrasterizer* r,
    NSVGimage* image,
    int w,
    int h,
	float tx,
    float ty,
    float scale);
