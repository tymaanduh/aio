# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_init_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.apply_motion_preference(*args)
        raise NotImplementedError, "Equivalent stub for 'applyMotionPreference' from brain/wrappers/renderer_init_domain.js"
      end

      def self.apply_ui_preferences(*args)
        raise NotImplementedError, "Equivalent stub for 'applyUiPreferences' from brain/wrappers/renderer_init_domain.js"
      end

      def self.apply_ui_theme(*args)
        raise NotImplementedError, "Equivalent stub for 'applyUiTheme' from brain/wrappers/renderer_init_domain.js"
      end

      def self.clear_ui_settings_save_timer(*args)
        raise NotImplementedError, "Equivalent stub for 'clearUiSettingsSaveTimer' from brain/wrappers/renderer_init_domain.js"
      end

      def self.close_ui_settings_popover(*args)
        raise NotImplementedError, "Equivalent stub for 'closeUiSettingsPopover' from brain/wrappers/renderer_init_domain.js"
      end

      def self.get_normalized_ui_preferences(*args)
        raise NotImplementedError, "Equivalent stub for 'getNormalizedUiPreferences' from brain/wrappers/renderer_init_domain.js"
      end

      def self.get_ui_settings_focusable_elements(*args)
        raise NotImplementedError, "Equivalent stub for 'getUiSettingsFocusableElements' from brain/wrappers/renderer_init_domain.js"
      end

      def self.initialize_stats_worker(*args)
        raise NotImplementedError, "Equivalent stub for 'initializeStatsWorker' from brain/wrappers/renderer_init_domain.js"
      end

      def self.initialize_ui_motion(*args)
        raise NotImplementedError, "Equivalent stub for 'initializeUiMotion' from brain/wrappers/renderer_init_domain.js"
      end

      def self.initialize_universe_worker(*args)
        raise NotImplementedError, "Equivalent stub for 'initializeUniverseWorker' from brain/wrappers/renderer_init_domain.js"
      end

      def self.is_motion_reduced(*args)
        raise NotImplementedError, "Equivalent stub for 'isMotionReduced' from brain/wrappers/renderer_init_domain.js"
      end

      def self.is_system_reduced_motion_enabled(*args)
        raise NotImplementedError, "Equivalent stub for 'isSystemReducedMotionEnabled' from brain/wrappers/renderer_init_domain.js"
      end

      def self.is_ui_settings_popover_open(*args)
        raise NotImplementedError, "Equivalent stub for 'isUiSettingsPopoverOpen' from brain/wrappers/renderer_init_domain.js"
      end

      def self.load_ui_preferences_from_disk(*args)
        raise NotImplementedError, "Equivalent stub for 'loadUiPreferencesFromDisk' from brain/wrappers/renderer_init_domain.js"
      end

      def self.on_leave(*args)
        raise NotImplementedError, "Equivalent stub for 'onLeave' from brain/wrappers/renderer_init_domain.js"
      end

      def self.on_move(*args)
        raise NotImplementedError, "Equivalent stub for 'onMove' from brain/wrappers/renderer_init_domain.js"
      end

      def self.on_pointer(*args)
        raise NotImplementedError, "Equivalent stub for 'onPointer' from brain/wrappers/renderer_init_domain.js"
      end

      def self.open_ui_settings_popover(*args)
        raise NotImplementedError, "Equivalent stub for 'openUiSettingsPopover' from brain/wrappers/renderer_init_domain.js"
      end

      def self.save_ui_preferences_now(*args)
        raise NotImplementedError, "Equivalent stub for 'saveUiPreferencesNow' from brain/wrappers/renderer_init_domain.js"
      end

      def self.schedule_ui_preferences_save(*args)
        raise NotImplementedError, "Equivalent stub for 'scheduleUiPreferencesSave' from brain/wrappers/renderer_init_domain.js"
      end

      def self.sync_ui_settings_controls(*args)
        raise NotImplementedError, "Equivalent stub for 'syncUiSettingsControls' from brain/wrappers/renderer_init_domain.js"
      end

      def self.toggle_ui_settings_popover(*args)
        raise NotImplementedError, "Equivalent stub for 'toggleUiSettingsPopover' from brain/wrappers/renderer_init_domain.js"
      end

      def self.update_reduce_motion_preference(*args)
        raise NotImplementedError, "Equivalent stub for 'updateReduceMotionPreference' from brain/wrappers/renderer_init_domain.js"
      end

      def self.update_ui_theme_preference(*args)
        raise NotImplementedError, "Equivalent stub for 'updateUiThemePreference' from brain/wrappers/renderer_init_domain.js"
      end
    end
  end
end
