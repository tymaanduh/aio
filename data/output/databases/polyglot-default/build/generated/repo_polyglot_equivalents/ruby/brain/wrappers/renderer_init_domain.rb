# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_init_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "applyMotionPreference",
  "applyUiPreferences",
  "applyUiTheme",
  "clearUiSettingsSaveTimer",
  "closeUiSettingsPopover",
  "getNormalizedUiPreferences",
  "getUiSettingsFocusableElements",
  "initializeStatsWorker",
  "initializeUiMotion",
  "initializeUniverseWorker",
  "isMotionReduced",
  "isSystemReducedMotionEnabled",
  "isUiSettingsPopoverOpen",
  "loadUiPreferencesFromDisk",
  "onLeave",
  "onMove",
  "onPointer",
  "openUiSettingsPopover",
  "saveUiPreferencesNow",
  "scheduleUiPreferencesSave",
  "syncUiSettingsControls",
  "toggleUiSettingsPopover",
  "updateReduceMotionPreference",
  "updateUiThemePreference"
]
      SYMBOL_MAP = {
  "applyMotionPreference": "apply_motion_preference",
  "applyUiPreferences": "apply_ui_preferences",
  "applyUiTheme": "apply_ui_theme",
  "clearUiSettingsSaveTimer": "clear_ui_settings_save_timer",
  "closeUiSettingsPopover": "close_ui_settings_popover",
  "getNormalizedUiPreferences": "get_normalized_ui_preferences",
  "getUiSettingsFocusableElements": "get_ui_settings_focusable_elements",
  "initializeStatsWorker": "initialize_stats_worker",
  "initializeUiMotion": "initialize_ui_motion",
  "initializeUniverseWorker": "initialize_universe_worker",
  "isMotionReduced": "is_motion_reduced",
  "isSystemReducedMotionEnabled": "is_system_reduced_motion_enabled",
  "isUiSettingsPopoverOpen": "is_ui_settings_popover_open",
  "loadUiPreferencesFromDisk": "load_ui_preferences_from_disk",
  "onLeave": "on_leave",
  "onMove": "on_move",
  "onPointer": "on_pointer",
  "openUiSettingsPopover": "open_ui_settings_popover",
  "saveUiPreferencesNow": "save_ui_preferences_now",
  "scheduleUiPreferencesSave": "schedule_ui_preferences_save",
  "syncUiSettingsControls": "sync_ui_settings_controls",
  "toggleUiSettingsPopover": "toggle_ui_settings_popover",
  "updateReduceMotionPreference": "update_reduce_motion_preference",
  "updateUiThemePreference": "update_ui_theme_preference"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.invoke_source_function(function_name, *args, **kwargs)
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.invoke_js_function(
          SOURCE_JS_FILE,
          function_name,
          args,
          kwargs
        )
      end

      def self.run_source_entrypoint(args = [])
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.run_js_entrypoint(SOURCE_JS_FILE, args)
      end

      def self.apply_motion_preference(*args, **kwargs)
        invoke_source_function("applyMotionPreference", *args, **kwargs)
      end

      def self.apply_ui_preferences(*args, **kwargs)
        invoke_source_function("applyUiPreferences", *args, **kwargs)
      end

      def self.apply_ui_theme(*args, **kwargs)
        invoke_source_function("applyUiTheme", *args, **kwargs)
      end

      def self.clear_ui_settings_save_timer(*args, **kwargs)
        invoke_source_function("clearUiSettingsSaveTimer", *args, **kwargs)
      end

      def self.close_ui_settings_popover(*args, **kwargs)
        invoke_source_function("closeUiSettingsPopover", *args, **kwargs)
      end

      def self.get_normalized_ui_preferences(*args, **kwargs)
        invoke_source_function("getNormalizedUiPreferences", *args, **kwargs)
      end

      def self.get_ui_settings_focusable_elements(*args, **kwargs)
        invoke_source_function("getUiSettingsFocusableElements", *args, **kwargs)
      end

      def self.initialize_stats_worker(*args, **kwargs)
        invoke_source_function("initializeStatsWorker", *args, **kwargs)
      end

      def self.initialize_ui_motion(*args, **kwargs)
        invoke_source_function("initializeUiMotion", *args, **kwargs)
      end

      def self.initialize_universe_worker(*args, **kwargs)
        invoke_source_function("initializeUniverseWorker", *args, **kwargs)
      end

      def self.is_motion_reduced(*args, **kwargs)
        invoke_source_function("isMotionReduced", *args, **kwargs)
      end

      def self.is_system_reduced_motion_enabled(*args, **kwargs)
        invoke_source_function("isSystemReducedMotionEnabled", *args, **kwargs)
      end

      def self.is_ui_settings_popover_open(*args, **kwargs)
        invoke_source_function("isUiSettingsPopoverOpen", *args, **kwargs)
      end

      def self.load_ui_preferences_from_disk(*args, **kwargs)
        invoke_source_function("loadUiPreferencesFromDisk", *args, **kwargs)
      end

      def self.on_leave(*args, **kwargs)
        invoke_source_function("onLeave", *args, **kwargs)
      end

      def self.on_move(*args, **kwargs)
        invoke_source_function("onMove", *args, **kwargs)
      end

      def self.on_pointer(*args, **kwargs)
        invoke_source_function("onPointer", *args, **kwargs)
      end

      def self.open_ui_settings_popover(*args, **kwargs)
        invoke_source_function("openUiSettingsPopover", *args, **kwargs)
      end

      def self.save_ui_preferences_now(*args, **kwargs)
        invoke_source_function("saveUiPreferencesNow", *args, **kwargs)
      end

      def self.schedule_ui_preferences_save(*args, **kwargs)
        invoke_source_function("scheduleUiPreferencesSave", *args, **kwargs)
      end

      def self.sync_ui_settings_controls(*args, **kwargs)
        invoke_source_function("syncUiSettingsControls", *args, **kwargs)
      end

      def self.toggle_ui_settings_popover(*args, **kwargs)
        invoke_source_function("toggleUiSettingsPopover", *args, **kwargs)
      end

      def self.update_reduce_motion_preference(*args, **kwargs)
        invoke_source_function("updateReduceMotionPreference", *args, **kwargs)
      end

      def self.update_ui_theme_preference(*args, **kwargs)
        invoke_source_function("updateUiThemePreference", *args, **kwargs)
      end
    end
  end
end

if __FILE__ == $PROGRAM_NAME
  args = ARGV.dup
  function_flag_index = args.index("--function")
  if function_flag_index
    function_name = args[function_flag_index + 1] || ""
    args_json_index = args.index("--args-json")
    args_json = args_json_index ? (args[args_json_index + 1] || "[]") : "[]"
    result = Aio::RepoPolyglotEquivalents::ModuleProxy.invoke_source_function(
      function_name,
      *Array(JSON.parse(args_json))
    )
    puts(JSON.generate({ ok: true, result: result }))
    exit(0)
  end

  report = Aio::RepoPolyglotEquivalents::ModuleProxy.run_source_entrypoint(ARGV)
  exit(Integer(report.fetch("exit_code", 0)))
end
