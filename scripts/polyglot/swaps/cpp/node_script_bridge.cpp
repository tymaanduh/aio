#include <iostream>
#include <string>
#include <vector>

#ifdef _WIN32
#include <process.h>
#else
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#endif

int main(int argc, char* argv[]) {
  if (argc < 3) {
    std::cerr << "node_script_bridge expects: <node_exec> <script_path> [script_args...]\n";
    return 2;
  }

#ifdef _WIN32
  std::vector<const char*> child_args;
  child_args.reserve(static_cast<size_t>(argc));
  for (int index = 1; index < argc; index += 1) {
    child_args.push_back(argv[index]);
  }
  child_args.push_back(nullptr);

  const char* exec_path = argv[1];
  int status = _spawnvp(_P_WAIT, exec_path, child_args.data());
  if (status == -1) {
    std::cerr << "failed to spawn node runtime\n";
    return 1;
  }
  return status;
#else
  pid_t child = fork();
  if (child < 0) {
    std::cerr << "fork failed\n";
    return 1;
  }

  if (child == 0) {
    execv(argv[1], argv + 1);
    std::cerr << "execv failed for node runtime\n";
    _exit(127);
  }

  int status_code = 0;
  if (waitpid(child, &status_code, 0) < 0) {
    std::cerr << "waitpid failed\n";
    return 1;
  }

  if (WIFEXITED(status_code)) {
    return WEXITSTATUS(status_code);
  }
  if (WIFSIGNALED(status_code)) {
    return 128 + WTERMSIG(status_code);
  }
  return 1;
#endif
}
