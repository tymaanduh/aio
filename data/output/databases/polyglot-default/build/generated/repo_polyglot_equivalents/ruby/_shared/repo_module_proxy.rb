# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

module Aio
  module RepoPolyglotEquivalents
    module Shared
      module RepoModuleProxy
        module_function

        def find_repo_root(start_path)
          current = Pathname.new(start_path).expand_path
          current = current.dirname if current.file?
          loop do
            package_file = current.join("package.json")
            scripts_dir = current.join("scripts")
            return current if package_file.exist? && scripts_dir.exist?
            parent = current.parent
            raise "repository root not found" if parent == current
            current = parent
          end
        end

        def parse_bridge_output(raw_stdout)
          lines = String(raw_stdout || "").lines.map(&:strip).reject(&:empty?)
          lines.reverse_each do |line|
            begin
              parsed = JSON.parse(line)
              return parsed if parsed.is_a?(Hash)
            rescue JSON::ParserError
              next
            end
          end
          {}
        end

        def run_bridge(payload)
          root = find_repo_root(__dir__)
          bridge_path = root.join("scripts", "repo-polyglot-module-bridge.js")
          raise "missing bridge script: #{bridge_path}" unless bridge_path.exist?

          node_exec = ENV.fetch("AIO_NODE_EXEC", "node")
          stdout, stderr, status = Open3.capture3(
            node_exec,
            bridge_path.to_s,
            stdin_data: JSON.generate(payload),
            chdir: root.to_s
          )

          parsed = parse_bridge_output(stdout)
          unless status.success? && parsed["ok"] == true
            detail = String(parsed["error"] || "").strip
            err = String(stderr || "").strip
            message = detail.empty? ? err : detail
            message = "bridge execution failed" if message.empty?
            raise message
          end

          parsed
        end

        def invoke_js_function(source_js_file, function_name, args = [], kwargs = {})
          payload = {
            action: "invoke_function",
            source_js_file: String(source_js_file),
            function_name: String(function_name),
            args: Array(args),
            kwargs: kwargs.is_a?(Hash) ? kwargs : {}
          }
          run_bridge(payload)["result"]
        end

        def run_js_entrypoint(source_js_file, args = [])
          payload = {
            action: "run_entrypoint",
            source_js_file: String(source_js_file),
            args: Array(args).map(&:to_s)
          }
          run_bridge(payload)
        end
      end
    end
  end
end
