#include "ghost.h"
#include "simple_handler.h"

#include <fstream>
#include <iostream>

const std::string kDefaultStarterTemplateCode =
    "function love.draw()\n    love.graphics.print('Edit main.lua to get started!', 400, 300)\n    "
    "love.graphics.print('Press Cmd/Ctrl + R to reload.', 400, 316)\nend";

GHOST_EXPORT void ghostSendJSEvent(const char *eventName, const char *serializedParams) {
  std::string validatedParams = (serializedParams) ? serializedParams : "{}";
  std::stringstream msg;
  msg << "{ let event = new Event('" << eventName << "'); "
      << "event.params = " << validatedParams << "; "
      << "window.dispatchEvent(event); }";

  CefRefPtr<CefBrowser> browser = SimpleHandler::GetInstance()->GetFirstBrowser();
  CefRefPtr<CefFrame> frame = browser->GetMainFrame();
  frame->ExecuteJavaScript(msg.str(), frame->GetURL(), 0);
}

inline bool fileExists(const char *path) {
  if (FILE *file = fopen(path, "r")) {
    fclose(file);
    return true;
  }
  return false;
}

bool ghostCreateProjectAtPath(const char *path, const char **entryPoint) {
  // get the starter code
  const char *pathToBundledStarterCode;
  std::string starterCode = kDefaultStarterTemplateCode;
  bool success = ghostGetPathToFileInAppBundle("blank.lua", &pathToBundledStarterCode);
  if (success) {
    std::ifstream starterCodeStream(pathToBundledStarterCode);
    starterCode = std::string((std::istreambuf_iterator<char>(starterCodeStream)),
                              std::istreambuf_iterator<char>());
  }

  // construct path to main.lua
  std::string mainFilePath(path);
  std::stringstream mainFilePathStream;
  mainFilePathStream << mainFilePath;
  
#if defined(WIN32) || defined(_WIN32)
  if (mainFilePath.back() != '\\') {
    mainFilePathStream << "\\";
  }
#else
  if (mainFilePath.back() != '/') {
    mainFilePathStream << "/";
  }
#endif
  mainFilePathStream << "main.lua";
  mainFilePath = mainFilePathStream.str();

  // don't overwrite existing file
  if (fileExists(mainFilePath.c_str())) {
    return false;
  }

  // write main.lua
  std::ofstream outfile(mainFilePath);
  outfile << starterCode << std::endl;
  outfile.close();

  // check that we actually created the file
  bool didCreate = fileExists(mainFilePath.c_str());
  if (didCreate) {
    *entryPoint = strdup(mainFilePath.c_str());
    return true;
  }
  return false;
}
