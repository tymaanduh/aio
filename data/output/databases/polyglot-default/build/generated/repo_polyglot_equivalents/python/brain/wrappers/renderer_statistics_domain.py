#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_statistics_domain.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "buildStatisticsModelSync",
  "getEntryUsageScore",
  "getStatisticsModel",
  "getStatsModelKey",
  "invalidateStatisticsCache",
  "renderStatisticsView",
  "requestStatsWorkerComputeNow",
  "scheduleStatsWorkerCompute"
]
AIO_SYMBOL_MAP = {
  "buildStatisticsModelSync": "build_statistics_model_sync",
  "getEntryUsageScore": "get_entry_usage_score",
  "getStatisticsModel": "get_statistics_model",
  "getStatsModelKey": "get_stats_model_key",
  "invalidateStatisticsCache": "invalidate_statistics_cache",
  "renderStatisticsView": "render_statistics_view",
  "requestStatsWorkerComputeNow": "request_stats_worker_compute_now",
  "scheduleStatsWorkerCompute": "schedule_stats_worker_compute"
}


def _load_proxy_runner():
    shared_runner_path = (pathlib.Path(__file__).resolve().parent / "../../_shared/repo_module_proxy.py").resolve()
    spec = importlib.util.spec_from_file_location("aio_repo_module_proxy", shared_runner_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"failed to load shared runner: {shared_runner_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


_PROXY = _load_proxy_runner()


def module_equivalent_metadata():
    return {
        "source_js_file": AIO_SOURCE_JS_FILE,
        "equivalent_kind": AIO_EQUIVALENT_KIND,
        "function_tokens": list(AIO_FUNCTION_TOKENS),
        "symbol_map": dict(AIO_SYMBOL_MAP),
    }


def invoke_source_function(function_name, *args, **kwargs):
    return _PROXY.invoke_js_function(AIO_SOURCE_JS_FILE, function_name, list(args), dict(kwargs))


def run_source_entrypoint(args=None):
    return _PROXY.run_js_entrypoint(AIO_SOURCE_JS_FILE, list(args or []))

def build_statistics_model_sync(*args, **kwargs):
    return invoke_source_function("buildStatisticsModelSync", *args, **kwargs)

def get_entry_usage_score(*args, **kwargs):
    return invoke_source_function("getEntryUsageScore", *args, **kwargs)

def get_statistics_model(*args, **kwargs):
    return invoke_source_function("getStatisticsModel", *args, **kwargs)

def get_stats_model_key(*args, **kwargs):
    return invoke_source_function("getStatsModelKey", *args, **kwargs)

def invalidate_statistics_cache(*args, **kwargs):
    return invoke_source_function("invalidateStatisticsCache", *args, **kwargs)

def render_statistics_view(*args, **kwargs):
    return invoke_source_function("renderStatisticsView", *args, **kwargs)

def request_stats_worker_compute_now(*args, **kwargs):
    return invoke_source_function("requestStatsWorkerComputeNow", *args, **kwargs)

def schedule_stats_worker_compute(*args, **kwargs):
    return invoke_source_function("scheduleStatsWorkerCompute", *args, **kwargs)


def _main(argv):
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--function", dest="function_name", default="")
    parser.add_argument("--args-json", dest="args_json", default="[]")
    parsed, _ = parser.parse_known_args(argv)
    if parsed.function_name:
        args = json.loads(parsed.args_json)
        result = invoke_source_function(parsed.function_name, *list(args))
        sys.stdout.write(json.dumps({"ok": True, "result": result}) + "\n")
        return 0
    report = run_source_entrypoint(argv)
    return int(report.get("exit_code", 0))


if __name__ == "__main__":
    raise SystemExit(_main(sys.argv[1:]))
