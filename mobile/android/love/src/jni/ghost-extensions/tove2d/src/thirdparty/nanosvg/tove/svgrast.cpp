/*
 * TÖVE - Animated vector graphics for LÖVE.
 * https://github.com/poke1024/Tove
 *
 * Portions of this code are taken from NanoSVG.
 * Portions of this code Copyright (c) 2019, Bernhard Liebl.
 *
 * All rights reserved.
 */

inline uint8_t int16_to_uint8(int16_t x) {
	if (x <= 0) {
		return 0;
	} else if (x >= 0xff) {
		return 0xff;
	} else {
		return uint8_t(x);
	}
}

void tove_deleteRasterizer(NSVGrasterizer* r) {

	if (r->stencil.data) free(r->stencil.data);
	if (r->dither.data) free(r->dither.data);
}

void tove__scanlineBit(
	NSVGrasterizer* r,
	int x,
	int y,
	int count,
	float tx,
	float ty,
	float scale,
	NSVGcachedPaint* cache,
	TOVEclip *clip) {

	unsigned char* const row = &r->bitmap[y * r->stride];
	unsigned char* const cover = r->scanline;

	const int x1 = x + count;
	for (; x < x1; x++) {
		row[x / 8] |= (cover[x] > 0 ? 1 : 0) << (x % 8);
	}
}

inline void maskClip(
	NSVGrasterizer* r,
	TOVEclip* clip,
	int xmin,
	int y,
	int count) {

	unsigned char* const cover = r->scanline;
	const int xmax = xmin + count - 1;

	for (int i = 0; i < clip->count; i++) {
		unsigned char* stencil = &r->stencil.data[
			r->stencil.size * clip->index[i] + y * r->stencil.stride];

		for (int j = xmin; j <= xmax; j++) {
			if (((stencil[j / 8] >> (j % 8)) & 1) == 0) {
				cover[j] = 0;
			}
		}
	}
}


class UnrestrictedPalette {
public:
	inline UnrestrictedPalette(
		const NSVGrasterizer *r) {
	}

	inline RGBA operator()(uint8_t cr, uint8_t cg, uint8_t cb, uint8_t ca) const {
		return RGBA{cr, cg, cb, ca};
	}
};

class RestrictedPalette {
	const TOVErasterizerQuality * const quality;

public:
	inline RestrictedPalette(
		const NSVGrasterizer *r) :
		
		quality(&r->quality) {
	}

	inline RGBA operator()(uint8_t cr, uint8_t cg, uint8_t cb, uint8_t ca) const {
		return tove::Palette::deref(quality->palette)->closest(
			cr,
			cg,
			cb,
			ca);
	}
};

typedef UnrestrictedPalette AnyPalette;



class NoDithering {
public:
	inline NoDithering(
		NSVGrasterizer* r,
		NSVGcachedPaint *cache,
		int x,
		int y,
		int direction,
		int count) {
	}

	template<typename Palette, typename T>
	inline RGBA operator()(
		T r, T g, T b, T a,
		const int x,
		const Palette &palette) const {

		return palette(r, g, b, a);
	}
};

class Noise {
	const TOVEnoise &noise;
	uint64_t s[2];

	enum Type {
		NOISE_NONE,
		NOISE_WHITE,
		NOISE_MATRIX
	};

	const Type type;
	const float *matrix;

	inline uint64_t xorshift128plus() {
		// see https://de.wikipedia.org/wiki/Xorshift
		uint64_t x = s[0];
		const uint64_t y = s[1];
		s[0] = y;
		x ^= x << 23; // a
		s[1] = x ^ y ^ (x >> 17) ^ (y >> 26); // b, c
		return s[1] + y;
	}

public:
	inline Noise(const TOVEnoise &noise, int x, int y) :
		noise(noise),
		type(noise.amount > 0.0f ? (noise.matrix ? NOISE_MATRIX : NOISE_WHITE) : NOISE_NONE) {
		
		if (type == NOISE_WHITE) {
			s[0] = y ^ 0x868e9b74cf54a3a8;
			s[1] = x ^ 0x4a9f72f594298821;

			// get really random first.
			for (int i = 0; i < 10; i++) {
				xorshift128plus();
			}
		} else if (type == NOISE_MATRIX) {
			matrix = &noise.matrix[noise.n * (y % noise.n)];
		}
	}

	inline float operator()(const int x) {
		switch (type) {
			case NOISE_NONE: {
				return 0.0f;
			} break;
			case NOISE_WHITE: {
				const uint64_t random = xorshift128plus();
				return noise.amount * (int((random >> 10) & 0xff) * ((random & 20) ? 1 : -1));
			} break;
			case NOISE_MATRIX: {
				return noise.amount * matrix[x % noise.n];
			} break;
		}
	}
};

class OrderedDithering {
	const float *current_row;
	const int16_t matrix_width;
	const float spread;
	Noise noise;

public:
	inline OrderedDithering(
		NSVGrasterizer *r,
		NSVGcachedPaint *cache,
		int x,
		int y,
		int direction,
		int count) :
		
		current_row(r->quality.dither.matrix +
			(y % r->quality.dither.matrix_height) *
				r->quality.dither.matrix_width),
		matrix_width(r->quality.dither.matrix_width),
		spread(r->quality.dither.spread),
		noise(r->quality.noise, x, y) {
	}

	template<typename Palette, typename T>
	inline RGBA operator()(
		T f_cr, T f_cg, T f_cb, T f_ca,
		const int x,
		const Palette &palette) {

		const float d = spread * current_row[x % matrix_width] + noise(x);
		
		return palette(
			int16_to_uint8(int16_t(f_cr + d)),
			int16_to_uint8(int16_t(f_cg + d)),
			int16_to_uint8(int16_t(f_cb + d)),
			f_ca);
	}
};

class DiffusionDithering {
public:
	typedef float dither_error_t;
	
	const float *weight_matrix;
	const int16_t weight_matrix_half_w;
	const int16_t weight_matrix_height;

	static constexpr int dither_components = 4;

	dither_error_t **diffusion_matrix;
	Noise noise;

	const int8_t direction;
	const float spread;

	inline void rotate(
		const NSVGrasterizer* r,
		NSVGcachedPaint* cache,
		const int x,
		const int y,
		const int count) {

		dither_error_t **rows = diffusion_matrix;
		dither_error_t * const data = static_cast<dither_error_t*>(r->dither.data);

		const unsigned int stride = r->dither.stride;

		int roll = y - cache->tove.ditherY;
		if (roll < 0) { // should never happen.
			roll = weight_matrix_height;
		} else if (roll > weight_matrix_height) {
			roll = weight_matrix_height;
		}

		cache->tove.ditherY = y;

		// rotate rows.
		for (int i = 0; i < weight_matrix_height; i++) {
			rows[i] = &data[((y + i) % weight_matrix_height) * stride +
				weight_matrix_half_w * dither_components];
		}

		const int span0 = (x - weight_matrix_half_w) * dither_components;
		const int span1 = (x + count + weight_matrix_half_w) * dither_components;

		// new rows.
		for (int i = 0; i < roll; i++) {
			dither_error_t * const row = rows[weight_matrix_height - 1 - i];
			for (int j = span0; j < span1; j++) {
				row[j] = 0.0f;
			}
		}

		// old rows that already have content.
		for (int i = 0; i < weight_matrix_height - roll; i++) {
			dither_error_t * const row = rows[i];

			const int previousLeftSpan = cache->tove.ditherSpan[0];
			for (int j = span0; j < previousLeftSpan; j++) {
				row[j] = 0.0f;
			}
			
			for (int j = cache->tove.ditherSpan[1]; j < span1; j++) {
				row[j] = 0.0f;
			}
		}

#if 0 // visual results of this are quite mixed.
		if (roll < diffusion_matrix_height) {
			// distribute errors from previous rows from the left.

			dither_error_t * const r0 = rows[0];
			dither_error_t * const r1 = rows[1];
			dither_error_t * const r2 = rows[2];

			for (int k = cache->tove.ditherSpan[0] / dither_components; k < x; k++) {
				const float f_cr = r0[k * dither_components + 0];
				const float f_cg = r0[k * dither_components + 1];
				const float f_cb = r0[k * dither_components + 2];
				const float f_ca = r0[k * dither_components + 3];

				const float errors[] = {f_cr, f_cg, f_cb, f_ca};

				if (errors[0] == 0.0f &&
					errors[1] == 0.0f &&
					errors[2] == 0.0f &&
					errors[3] == 0.0f) {
					continue;
				}

				// distribute errors using sierra dithering.
				#pragma clang loop vectorize(enable)
				for (int j = 0; j < 4; j++) {
					const int offset = k * dither_components + j;
					const float error = errors[j];

					r0[offset + 1 * dither_components] += error * (5.0f / 32.0f);
					r0[offset + 2 * dither_components] += error * (3.0f / 32.0f);

					r1[offset - 2 * dither_components] += error * (2.0f / 32.0f);
					r1[offset - 1 * dither_components] += error * (4.0f / 32.0f);
					r1[offset + 0 * dither_components] += error * (5.0f / 32.0f);
					r1[offset + 1 * dither_components] += error * (4.0f / 32.0f);
					r1[offset + 2 * dither_components] += error * (2.0f / 32.0f);

					r2[offset - 1 * dither_components] += error * (2.0f / 32.0f);
					r2[offset + 0 * dither_components] += error * (3.0f / 32.0f);
					r2[offset + 1 * dither_components] += error * (2.0f / 32.0f);
				}
			}
		}
#endif

		cache->tove.ditherSpan[0] = span0;
		cache->tove.ditherSpan[1] = span1;
	}

public:
	static inline bool enabled(const NSVGrasterizer* r) {
		return r->quality.dither.type == TOVE_NSVG_DITHER_DIFFUSION;
	}

	static inline bool allocate(NSVGrasterizer* r, int w) {
		if (enabled(r)) {
			TOVEdither &dither = r->dither;
			dither.stride = (w + r->quality.dither.matrix_width) * dither_components;
			dither.data = (dither_error_t*)realloc(
				dither.data,
				dither.stride * r->quality.dither.matrix_height * sizeof(dither_error_t));
			dither.rows = (void**)realloc(
				dither.rows, r->quality.dither.matrix_height * sizeof(void*));
			return dither.data != nullptr && dither.rows != nullptr;
		} else {
			return true;
		}
	}

	inline DiffusionDithering(
		NSVGrasterizer* r,
		NSVGcachedPaint *cache,
		int x,
		int y,
		int direction,
		int count) :
		
		weight_matrix(r->quality.dither.matrix),
		weight_matrix_half_w((r->quality.dither.matrix_width - 1) / 2),
		weight_matrix_height(r->quality.dither.matrix_height),
		diffusion_matrix(reinterpret_cast<dither_error_t**>(r->dither.rows)),
		noise(r->quality.noise, x, y),
		spread(r->quality.dither.spread),
		direction(direction) {

		rotate(r, cache, x, y, count);
	}

	template<typename Palette>
	inline RGBA operator()(
		float r, float g, float b, float a,
		const int x,
		const Palette &palette) {
		
		dither_error_t * const r0 = diffusion_matrix[0];

		const float f_cr = nsvg__clampf(r + r0[x * dither_components + 0] * spread, 0.0f, 255.0f);
		const float f_cg = nsvg__clampf(g + r0[x * dither_components + 1] * spread, 0.0f, 255.0f);
		const float f_cb = nsvg__clampf(b + r0[x * dither_components + 2] * spread, 0.0f, 255.0f);
		const float f_ca = nsvg__clampf(a + r0[x * dither_components + 3] * spread, 0.0f, 255.0f);

		RGBA rgba = palette(f_cr + 0.5f, f_cg + 0.5f, f_cb + 0.5f, f_ca + 0.5f);
		const uint8_t cr = rgba.r;
		const uint8_t cg = rgba.g;
		const uint8_t cb = rgba.b;
		const uint8_t ca = rgba.a;

		const float bias = noise(x);
		const float errors[] = {
			f_cr - cr + bias,
			f_cg - cg + bias,
			f_cb - cb + bias,
			f_ca - ca + bias};
		const int dx = direction * dither_components;

		// distribute errors using sierra dithering.
		#pragma clang loop vectorize(enable)
		for (int j = 0; j < 4; j++) {
			const int offset = x * dither_components + j;
			const float error = errors[j];

			const float *w = weight_matrix + weight_matrix_half_w + 1;
			for (int mx = 1; mx <= weight_matrix_half_w; mx++) {
				r0[offset + mx * dx] += error * *w++;
			}

			for (int my = 1; my < weight_matrix_height; my++) {
				dither_error_t * const r = diffusion_matrix[my];
				for (int mx = -weight_matrix_half_w; mx <= weight_matrix_half_w; mx++) {
					r[offset + mx * dx] += error * *w++;
				}
			}
		}

		return RGBA{cr, cg, cb, ca};
	}
};


class LinearGradient {
	const float* const t;

public:
	inline LinearGradient(const NSVGcachedPaint* cache) : t(cache->xform) {
	}

	inline float operator()(float fx, float fy) const {
		return fx*t[1] + fy*t[3] + t[5];
	}
};

class RadialGradient {
	const float* const t;

public:
	inline RadialGradient(const NSVGcachedPaint* cache) : t(cache->xform) {
	}

	inline float operator()(float fx, float fy) const {
		const float gx = fx*t[0] + fy*t[2] + t[4];
		const float gy = fx*t[1] + fy*t[3] + t[5];
		return sqrtf(gx*gx + gy*gy);
	}
};


class FastGradientColors {
	const NSVGcachedPaint * const cache;

public:
	inline FastGradientColors(
		NSVGrasterizer* r,
		NSVGcachedPaint *cache,
		int x,
		int y,
		int direction,
		int count) : cache(cache) {
	}

	inline bool good() {
		return true;
	}

	inline RGBA operator()(int x, float gy) const {
		const uint32_t c = cache->colors[(int)nsvg__clampf(gy * 255.0f, 0, 255.0f)];
		return RGBA{uint8_t(c), uint8_t(c >> 8), uint8_t(c >> 16), uint8_t(c >> 24)};
	}
};

template<typename Dithering, typename Palette>
class BestGradientColors {

	const NSVGgradient * const gradient;
	const NSVGgradientStop *stop;
	const NSVGgradientStop *const stopN;

	Dithering dithering;
	const Palette palette;

public:
	inline BestGradientColors(
		NSVGrasterizer* r,
		NSVGcachedPaint *cache,
		int x,
		int y,
		int direction,
		int count) :

		dithering(r, cache, x, y, direction, count),
		palette(r),

		gradient(cache->tove.paint->gradient),
		stop(gradient->stops),
		stopN(gradient->stops + gradient->nstops) {

	}

	static void init(
		const NSVGrasterizer *r,
		NSVGcachedPaint* cache,
		NSVGpaint* paint,
		float opacity) {

		cache->tove.paint = paint;
		cache->tove.ditherY = -r->quality.dither.matrix_height;

		NSVGgradientStop *stop = paint->gradient->stops;
		const int n = paint->gradient->nstops;

		for (int i = 0; i < n; i++) {
			stop->tove.color = nsvg__applyOpacity(stop->color, opacity);
			stop->tove.offset = nsvg__clampf(stop->offset, 0.0f, 1.0f);
			stop++;
		}
	}

	inline bool good() const {
		return stop + 1 < stopN;
	}

	inline RGBA operator()(const int x, const float gy) {

		while (gy >= (stop + 1)->tove.offset && (stop + 2) < stopN) {
			stop++;
		}
		while (gy < stop->tove.offset && stop > gradient->stops) {
			stop--;
		}

		const unsigned int c0 = stop->tove.color;
		const int cr0 = (c0) & 0xff;
		const int cg0 = (c0 >> 8) & 0xff;
		const int cb0 = (c0 >> 16) & 0xff;
		const int ca0 = (c0 >> 24) & 0xff;

		const unsigned int c1 = (stop + 1)->tove.color;
		const int cr1 = (c1) & 0xff;
		const int cg1 = (c1 >> 8) & 0xff;
		const int cb1 = (c1 >> 16) & 0xff;
		const int ca1 = (c1 >> 24) & 0xff;

		const float offset0 = stop->tove.offset;
		const float range = (stop + 1)->tove.offset - offset0;
		const float t = nsvg__clampf((gy - offset0) / range, 0.0f, 1.0f);
		const float s = 1.0f - t;

		return dithering(
			cr0 * s + cr1 * t,
			cg0 * s + cg1 * t,
			cb0 * s + cb1 * t,
			ca0 * s + ca1 * t,
			x,
			palette);
	}
};


template<typename Gradient, typename Colors>
void drawGradientScanline(
	NSVGrasterizer* r,
	int x,
	int y,
	int count,
	float tx,
	float ty,
	float scale,
	NSVGcachedPaint* cache,
	TOVEclip* clip) {

	using ::tove::nsvg__div255;

	unsigned char* dst0 = &r->bitmap[y * r->stride] + x*4;
	unsigned char* cover0 = &r->scanline[x];
	maskClip(r, clip, x, y, count);

	// TODO: spread modes.
	// TODO: plenty of opportunities to optimize.
	float fx, fy, dx, gy;
	int i, cr, cg, cb, ca;
	const Gradient gradient(cache);

	fx = ((float)x - tx) / scale;
	fy = ((float)y - ty) / scale;
	dx = 1.0f / scale;

	// use serpentine scanning for better dithering.
	const int idir = (y & 1) ? 1 : -1;
	int i0;
	if (idir > 0) {
		i0 = 0;
	} else {
		fx += (count - 1) * dx;
		dx = -dx;
		i0 = count - 1;
	}

	Colors colors(r, cache, x, y, idir, count);

	for (int k = 0; k < count; k++) {
		const int i = i0 + k * idir;

		int r,g,b,a,ia;
		const RGBA rgba = colors(x + i, gradient(fx, fy));
		cr = rgba.r;
		cg = rgba.g;
		cb = rgba.b;
		ca = rgba.a;

		unsigned char *cover = cover0 + i;
		a = nsvg__div255((int)cover[0] * ca);
		ia = 255 - a;

		// Premultiply
		r = nsvg__div255(cr * a);
		g = nsvg__div255(cg * a);
		b = nsvg__div255(cb * a);

		// Blend over
		unsigned char *dst = dst0 + 4 * i;
		r += nsvg__div255(ia * (int)dst[0]);
		g += nsvg__div255(ia * (int)dst[1]);
		b += nsvg__div255(ia * (int)dst[2]);
		a += nsvg__div255(ia * (int)dst[3]);

		dst[0] = (unsigned char)r;
		dst[1] = (unsigned char)g;
		dst[2] = (unsigned char)b;
		dst[3] = (unsigned char)a;

		fx += dx;
	}
}

template<typename Dithering, typename Palette>
inline void drawColorScanline(
	NSVGrasterizer* r,
	int xmin,
	int y,
	int count,
	float tx,
	float ty,
	float scale,
	NSVGcachedPaint* cache,
	TOVEclip* clip) {

	unsigned char* dst = &r->bitmap[y * r->stride] + xmin*4;
	unsigned char* cover = &r->scanline[xmin];
	maskClip(r, clip, xmin, y, count);

	const int cr0 = cache->colors[0] & 0xff;
	const int cg0 = (cache->colors[0] >> 8) & 0xff;
	const int cb0 = (cache->colors[0] >> 16) & 0xff;
	const int ca0 = (cache->colors[0] >> 24) & 0xff;

	Dithering dithering(r, cache, xmin, y, 1, count);
	const Palette palette(r);

	for (int i = 0; i < count; i++) {
		const RGBA rgba = dithering(
			cr0, cg0, cb0, ca0,
			xmin + i,
			palette);
		int cr = rgba.r;
		int cg = rgba.g;
		int cb = rgba.b;
		int ca = rgba.a;

		int r,g,b;
		int a = nsvg__div255((int)cover[0] * ca);
		int ia = 255 - a;
		// Premultiply
		r = nsvg__div255(cr * a);
		g = nsvg__div255(cg * a);
		b = nsvg__div255(cb * a);

		// Blend over
		r += nsvg__div255(ia * (int)dst[0]);
		g += nsvg__div255(ia * (int)dst[1]);
		b += nsvg__div255(ia * (int)dst[2]);
		a += nsvg__div255(ia * (int)dst[3]);

		dst[0] = (unsigned char)r;
		dst[1] = (unsigned char)g;
		dst[2] = (unsigned char)b;
		dst[3] = (unsigned char)a;

		cover++;
		dst += 4;
	}
}

TOVEscanlineFunction tove__initPaint(
	NSVGcachedPaint* cache,
	const NSVGrasterizer* r,
	NSVGpaint* paint,
	float opacity,
	bool &initCacheColors) {

	if (r && (r->quality.palette || r->quality.dither.type != TOVE_NSVG_DITHER_NONE)) {
		switch (cache->type) {
			case NSVG_PAINT_COLOR:
				initCacheColors = true;
				if (r->quality.palette) {
					switch (r->quality.dither.type) {
						case TOVE_NSVG_DITHER_NONE: {
							return drawColorScanline<NoDithering, RestrictedPalette>;
						} break;
						case TOVE_NSVG_DITHER_DIFFUSION: {
							return drawColorScanline<DiffusionDithering, RestrictedPalette>;
						} break;
						case TOVE_NSVG_DITHER_ORDERED: {
							return drawColorScanline<OrderedDithering, RestrictedPalette>;
						} break;
					}
				} else {
					return drawColorScanline<NoDithering, UnrestrictedPalette>;
				}
				break;
			case NSVG_PAINT_LINEAR_GRADIENT:
				BestGradientColors<DiffusionDithering, AnyPalette>::init(
					r, cache, paint, opacity);
				initCacheColors = false;
				if (r->quality.palette) {
					switch (r->quality.dither.type) {
						case TOVE_NSVG_DITHER_NONE: {
							return drawGradientScanline<
								LinearGradient,
								BestGradientColors<NoDithering, RestrictedPalette>>;
						} break;
						case TOVE_NSVG_DITHER_DIFFUSION: {
							return drawGradientScanline<
								LinearGradient,
								BestGradientColors<DiffusionDithering, RestrictedPalette>>;
						} break;
						case TOVE_NSVG_DITHER_ORDERED: {
							return drawGradientScanline<
								LinearGradient,
								BestGradientColors<OrderedDithering, RestrictedPalette>>;
						} break;
					}
				} else {
					switch (r->quality.dither.type) {
						case TOVE_NSVG_DITHER_NONE: {
							assert(false);
						}; break;
						case TOVE_NSVG_DITHER_DIFFUSION: {
							return drawGradientScanline<
								LinearGradient,
								BestGradientColors<DiffusionDithering, UnrestrictedPalette>>;
						} break;
						case TOVE_NSVG_DITHER_ORDERED: {
							return drawGradientScanline<
								LinearGradient,
								BestGradientColors<OrderedDithering, UnrestrictedPalette>>;
						} break;
					}
				}
				break;
			case NSVG_PAINT_RADIAL_GRADIENT:
				BestGradientColors<DiffusionDithering, AnyPalette>::init(
					r, cache, paint, opacity);
				initCacheColors = false;
				if (r->quality.palette) {
					switch (r->quality.dither.type) {
						case TOVE_NSVG_DITHER_NONE: {
							return drawGradientScanline<
								RadialGradient,
								BestGradientColors<NoDithering, RestrictedPalette>>;
						} break;
						case TOVE_NSVG_DITHER_DIFFUSION: {
							return drawGradientScanline<
								RadialGradient,
								BestGradientColors<DiffusionDithering, RestrictedPalette>>;
						} break;
						case TOVE_NSVG_DITHER_ORDERED: {
							return drawGradientScanline<
								RadialGradient,
								BestGradientColors<OrderedDithering, RestrictedPalette>>;
						} break;
					}
				} else {
					switch (r->quality.dither.type) {
						case TOVE_NSVG_DITHER_NONE: {
							assert(false);
						}; break;
						case TOVE_NSVG_DITHER_DIFFUSION: {
							return drawGradientScanline<
								RadialGradient,
								BestGradientColors<DiffusionDithering, UnrestrictedPalette>>;
						} break;
						case TOVE_NSVG_DITHER_ORDERED: {
							return drawGradientScanline<
								RadialGradient,
								BestGradientColors<OrderedDithering, UnrestrictedPalette>>;
						} break;
					}
				}
				break;
		}
	}

	switch (cache->type) {
		case NSVG_PAINT_LINEAR_GRADIENT:
			initCacheColors = true;
			return drawGradientScanline<LinearGradient, FastGradientColors>;
		case NSVG_PAINT_RADIAL_GRADIENT:
			initCacheColors = true;
			return drawGradientScanline<RadialGradient, FastGradientColors>;
		default:
			initCacheColors = false;
			return drawColorScanline<NoDithering, UnrestrictedPalette>;
	}
}

bool tove__rasterize(
	NSVGrasterizer* r,
    NSVGimage* image,
    int w,
    int h,
	float tx,
    float ty,
    float scale)
{
	if (!DiffusionDithering::allocate(r, w)) {
		return false;
	}

	TOVEclipPath* clipPath;
	int clipPathCount = 0;

	clipPath = image->clip.instances;
	if (clipPath == NULL) {
		return true;
	}

	while (clipPath != NULL) {
		clipPathCount++;
		clipPath = clipPath->next;
	}

	r->stencil.stride = w / 8 + (w % 8 != 0 ? 1 : 0);
	r->stencil.size = h * r->stencil.stride;
	r->stencil.data = (unsigned char*)realloc(
		r->stencil.data, r->stencil.size * clipPathCount);
	if (r->stencil.data == NULL) {
		return false;
	}
	memset(r->stencil.data, 0, r->stencil.size * clipPathCount);

	clipPath = image->clip.instances;
	while (clipPath != NULL) {
		nsvg__rasterizeShapes(r, clipPath->shapes, tx, ty, scale,
			&r->stencil.data[r->stencil.size * clipPath->index],
			w, h, r->stencil.stride, tove__scanlineBit);
		clipPath = clipPath->next;
	}

	return true;
}
