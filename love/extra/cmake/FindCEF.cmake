# Sets the following variables:
#
#  CEF_FOUND
#  CEF_INCLUDE_DIR
#  CEF_LIBRARY

set(CEF_SEARCH_PATHS
	/var/empty/local
	/var/empty
	)

find_path(CEF_INCLUDE_DIR
	NAMES include/cef_app.h
	PATH_SUFFIXES include include/CEF
	PATHS ${CEF_SEARCH_PATHS})

find_library(CEF_LIBRARY
	NAMES cef
	PATH_SUFFIXES lib
	PATHS ${CEF_SEARCH_PATHS})

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(CEF DEFAULT_MSG CEF_LIBRARY CEF_INCLUDE_DIR)

mark_as_advanced(CEF_INCLUDE_DIR CEF_LIBRARY)
