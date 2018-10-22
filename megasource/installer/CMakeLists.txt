if(${CMAKE_SOURCE_DIR} STREQUAL ${CMAKE_BINARY_DIR})
	# Protop: run cmake like this: cmake -G "<generator>" -H. -Bbuild
	message(FATAL_ERROR "Prevented in-tree build.")
endif()

cmake_minimum_required(VERSION 3.1)

project(castleinstaller)

install(DIRECTORY "../build/Release/" DESTINATION .)

set(CPACK_GENERATOR "NSIS")
set(CPACK_PACKAGE_NAME "Castle")
set(CPACK_PACKAGE_VENDOR "Castle")

set(CPACK_PACKAGE_VERSION_MAJOR "0")
set(CPACK_PACKAGE_VERSION_MINOR "0")
set(CPACK_PACKAGE_VERSION_PATCH "1")
set(CPACK_PACKAGE_VERSION "${CPACK_PACKAGE_VERSION_MAJOR}.${CPACK_PACKAGE_VERSION_MINOR}.${CPACK_PACKAGE_VERSION_PATCH}")

set(CPACK_PACKAGE_INSTALL_DIRECTORY "Castle")
set(CPACK_PACKAGE_EXECUTABLES "Castle;Castle")
set(CPACK_SOURCE_GENERATOR "TGZ")
set(CPACK_SOURCE_PACKAGE_FILE_NAME "${CPACK_PACKAGE_NAME}-${CPACK_PACKAGE_VERSION}")

set(CPACK_NSIS_ENABLE_UNINSTALL_BEFORE_INSTALL ON)
# Castle.exe is in the root install directory
set(CPACK_NSIS_EXECUTABLES_DIRECTORY .)
set(CPACK_NSIS_PACKAGE_NAME "Castle")
set(CPACK_NSIS_DISPLAY_NAME "Castle ${CPACK_PACKAGE_VERSION}")
set(CPACK_NSIS_MODIFY_PATH OFF)
set(CPACK_NSIS_INSTALL_ROOT "$PROGRAMFILES")

# Need \\\\ for some reason. https://stackoverflow.com/questions/28768417/how-to-set-an-icon-in-nsis-install-cmake.
# Icon is 150x57
set(CPACK_PACKAGE_ICON "${CMAKE_CURRENT_SOURCE_DIR}/../extra\\\\castle.bmp")
set(CPACK_NSIS_MUI_ICON "${CMAKE_CURRENT_SOURCE_DIR}/../extra/castle.ico")
set(CPACK_NSIS_MUI_UNIICON "${CMAKE_CURRENT_SOURCE_DIR}/../extra/castle.ico")
# A path to the executable that contains the installer icon.
set(CPACK_NSIS_INSTALLED_ICON_NAME "Castle.exe")
#set(CPACK_NSIS_HELP_LINK ${APP_URL})
set(CPACK_NSIS_URL_INFO_ABOUT "https://playcastle.io/")
#set(CPACK_NSIS_CONTACT ${APP_EMAIL})
set(CPACK_RESOURCE_FILE_LICENSE "${CMAKE_CURRENT_SOURCE_DIR}/../extra/license.txt")

# Run install_redist.bat without opening a terminal window
set(CPACK_NSIS_EXTRA_INSTALL_COMMANDS "
	nsExec::Exec '\\\"$sysdir\\\\cmd.exe\\\" /c if 1==1 \\\"$INSTDIR\\\\install_redist.bat\\\"'
	Pop $0

	WriteRegStr HKCR \\\"castle\\\" \\\"\\\" \\\"URL:Castle Protocol\\\"
	WriteRegStr HKCR \\\"castle\\\" \\\"URL Protocol\\\" \\\"\\\"
	WriteRegStr HKCR \\\"castle\\\\DefaultIcon\\\" \\\"\\\" \\\"$INSTDIR\\\\castle.ico\\\"
	WriteRegStr HKCR \\\"castle\\\\shell\\\" \\\"\\\" \\\"open\\\"
	WriteRegStr HKCR \\\"castle\\\\shell\\\\open\\\" \\\"\\\" \\\"Open in Castle\\\"
	WriteRegStr HKCR \\\"castle\\\\shell\\\\open\\\\command\\\" \\\"\\\" \\\"$INSTDIR\\\\Castle.exe $\\\\\\\"%1$\\\\\\\"\\\"
	System::Call 'shell32.dll::SHChangeNotify(i, i, i, i) v  (0x08000000, 0, 0, 0)'
")

set(CPACK_NSIS_EXTRA_UNINSTALL_COMMANDS "
	DeleteRegKey HKCR \\\"castle\\\"
	System::Call 'shell32.dll::SHChangeNotify(i, i, i, i) v  (0x08000000, 0, 0, 0)'
")

set(CPACK_NSIS_MUI_FINISHPAGE_RUN "Castle.exe")

include(CPack)

add_custom_target(PACKAGE_AND_MOVE
  COMMAND ${CMAKE_CPACK_COMMAND}
  COMMAND ${CMAKE_COMMAND} -E copy "Castle-${CPACK_PACKAGE_VERSION}-win32.exe" ../../CastleSetup.exe
)