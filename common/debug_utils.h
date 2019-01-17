#ifndef __DEBUG_UTILS_H__
#define __DEBUG_UTILS_H__

// Print 'msg' followed by a count of how many times this statement was hit. Useful for
// debugging if some statement is being hit continuously or not (without a counter it's
// hard to separate messages from previous messages).
#define DEBUG_COUNTER(msg) \
do { \
static int counter = 0; \
printf(msg ": %d\n", ++counter); \
} while (0)

#endif
