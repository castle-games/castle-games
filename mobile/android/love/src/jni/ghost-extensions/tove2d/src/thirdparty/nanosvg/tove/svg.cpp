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

static TOVEclipPathDefinition* tove__createClipPathDefinition(const char* name, const float *xform)
{
	TOVEclipPathDefinition* clipPath = (TOVEclipPathDefinition*)malloc(sizeof(TOVEclipPathDefinition));
	if (clipPath == NULL) return NULL;
	memset(clipPath, 0, sizeof(TOVEclipPathDefinition));
	strncpy(clipPath->id, name, 63);
	clipPath->id[63] = '\0';
	memcpy(clipPath->xform, xform, 6 * sizeof(float));
	return clipPath;
}

TOVEclipPathDefinition* tove__addClipPathDefinition(NSVGparser* p, const char* name)
{
	TOVEclipPathDefinition** link;

	link = &p->image->clip.definitions;
	while (*link != NULL) {
		if (strcmp((*link)->id, name) == 0) {
			break;
		}
		link = &(*link)->next;
	}
	if (*link == NULL) {
		*link = tove__createClipPathDefinition(name, nsvg__getAttr(p)->xform);
	}
	return *link;
}

void tove__deleteClipPaths(TOVEimageClip* clip)
{
	TOVEclipPathDefinition* definition = clip->definitions;
	while (definition != NULL) {
		TOVEclipPathDefinition* pnext = definition->next;
		nsvg__deleteShapes(definition->shapes);
		free(definition);
		definition = pnext;
	}

	TOVEclipPath* instance = clip->instances;
	while (instance != NULL) {
		TOVEclipPath* pnext = instance->next;
		nsvg__deleteShapes(instance->shapes);
		free(instance);
		instance = pnext;
	}
}

int tove__findClipPath(NSVGparser* p, const char* name, const float *xform) {
	int index;

	// FIXME search for exact match

	TOVEclipPath** link = &p->image->clip.instances;
	if (*link) {
		index = 1 + (*link)->index;
	} else {
		index = 0;
	}

	TOVEclipPath* instance = (TOVEclipPath*)malloc(sizeof(TOVEclipPath));
	if (instance == NULL) {
		return -1;
	}
	memset(instance, 0, sizeof(TOVEclipPath));

	instance->definition = tove__addClipPathDefinition(p, name);
	if (!instance->definition) {
		free(instance);
		return -1;
	}
	instance->index = index;
	memcpy(instance->xform, xform, 6 * sizeof(float));
	instance->next = *link;
	*link = instance;

	return index;
}

NSVGpath* tove__clonePath(NSVGpath* path, const float* t) {
	NSVGpath* cloned = (NSVGpath*)malloc(sizeof(NSVGpath));
	if (cloned == NULL) return NULL;
	memcpy(cloned, path, sizeof(NSVGpath));

	const int npts = path->npts;
	cloned->pts = (float*)malloc(sizeof(float) * 2 * npts);
	cloned->npts = npts;
	cloned->next = NULL;

	for (int i = 0; i < npts; i++) {
		const float x = path->pts[2 * i + 0];
		const float y = path->pts[2 * i + 1];
		cloned->pts[2 * i + 0] = x*t[0] + y*t[2] + t[4];
		cloned->pts[2 * i + 1] = x*t[1] + y*t[3] + t[5];
	}

	return cloned;
}

NSVGshape* tove__cloneShape(NSVGshape* shape, const float* xform) {
	NSVGshape* cloned = (NSVGshape*)malloc(sizeof(NSVGshape));
	if (cloned == NULL) return NULL;
	memcpy(cloned, shape, sizeof(NSVGshape));
	cloned->paths = NULL;
	cloned->next = NULL;

	cloned->clip.index = NULL;
	cloned->clip.count = 0;

	NSVGpath** link = &cloned->paths;
	NSVGpath* path = shape->paths;
	while (path) {
		*link = tove__clonePath(path, xform);
		link = &((*link)->next);
		path = path->next;
	}
	*link = NULL;

	cloned->fill.type = NSVG_PAINT_COLOR;
	cloned->stroke.type = NSVG_PAINT_NONE;

	return cloned;
}

void tove__finishParse(NSVGparser* p) {
	TOVEclipPath *path = p->image->clip.instances;
	while (path) {

		float xform[6];
		nsvg__xformInverse(xform, path->definition->xform);
		nsvg__xformMultiply(xform, path->xform);

		NSVGshape* shape = path->definition->shapes;
		NSVGshape** link = &path->shapes;
		while (shape) {
			*link = tove__cloneShape(shape, xform);
			link = &((*link)->next);
			shape = shape->next;
		}
		*link = NULL;

		path = path->next;
	}
}
