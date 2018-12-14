#include "ghost.h"
#include "simple_handler.h"

#include <fstream>
#include <iostream>

const std::string kStarterTemplateCode =
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
  // construct path to main.lua
  std::string mainFilePath(path);
  std::stringstream mainFilePathStream;
  mainFilePathStream << mainFilePath;
  if (mainFilePath.back() != '/') {
    mainFilePathStream << "/";
  }
  mainFilePathStream << "main.lua";
  mainFilePath = mainFilePathStream.str();

  // don't overwrite existing file
  if (fileExists(mainFilePath.c_str())) {
    return false;
  }

  // write main.lua
  std::ofstream outfile(mainFilePath);
  outfile << kStarterTemplateCode << std::endl;
  outfile.close();

  // check that we actually created the file
  bool didCreate = fileExists(mainFilePath.c_str());
  if (didCreate) {
    *entryPoint = strdup(mainFilePath.c_str());
    return true;
  }
  return false;
}
