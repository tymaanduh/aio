// Auto-generated C++ equivalent module proxy for main/services/language_bridge_service.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "main/services/language_bridge_service.js";

namespace aio::repo_polyglot_equivalents::main::services::language_bridge_service {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int add_array_values(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "add_array_values", args_json);
}

inline int build_descriptor_refs_from_text(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "build_descriptor_refs_from_text", args_json);
}

inline int build_state_stats(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "build_state_stats", args_json);
}

inline int build_triad_id(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "build_triad_id", args_json);
}

inline int build_triads(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "build_triads", args_json);
}

inline int capture_sources(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "capture_sources", args_json);
}

inline int clean_text(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clean_text", args_json);
}

inline int clip_snippet(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clip_snippet", args_json);
}

inline int compile_machine_descriptors(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "compile_machine_descriptors", args_json);
}

inline int create_machine_descriptor_record(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_machine_descriptor_record", args_json);
}

inline int ensure_entry_link(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensure_entry_link", args_json);
}

inline int extract_code_tokens(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "extract_code_tokens", args_json);
}

inline int extract_english_phrases(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "extract_english_phrases", args_json);
}

inline int extract_english_terms(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "extract_english_terms", args_json);
}

inline int extract_machine_terms(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "extract_machine_terms", args_json);
}

inline int extract_pseudocode_phrases(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "extract_pseudocode_phrases", args_json);
}

inline int get_seed_synonyms(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "get_seed_synonyms", args_json);
}

inline int hash_text(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "hash_text", args_json);
}

inline int index_dictionary_entries(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "index_dictionary_entries", args_json);
}

inline int inject_language_bridge_repository(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "inject_language_bridge_repository", args_json);
}

inline int is_code_identifier(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "is_code_identifier", args_json);
}

inline int link_entry_artifacts(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "link_entry_artifacts", args_json);
}

inline int link_entry_refs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "link_entry_refs", args_json);
}

inline int load_bridge_state(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "load_bridge_state", args_json);
}

inline int load_state_internal(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "load_state_internal", args_json);
}

inline int lookup_machine_rule(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "lookup_machine_rule", args_json);
}

inline int MACHINE_DESCRIPTOR_TERM_RULE_MAP(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "MACHINE_DESCRIPTOR_TERM_RULE_MAP", args_json);
}

inline int make_source_id(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "make_source_id", args_json);
}

inline int normalize_key(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_key", args_json);
}

inline int normalize_machine_term(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_machine_term", args_json);
}

inline int normalize_spaces(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_spaces", args_json);
}

inline int now_iso(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "now_iso", args_json);
}

inline int process_text_into_artifacts(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "process_text_into_artifacts", args_json);
}

inline int rank_and_limit_results(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "rank_and_limit_results", args_json);
}

inline int save_state_internal(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "save_state_internal", args_json);
}

inline int search_glossary(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "search_glossary", args_json);
}

inline int search_keyword(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "search_keyword", args_json);
}

inline int search_machine_descriptor(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "search_machine_descriptor", args_json);
}

inline int search_triad(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "search_triad", args_json);
}

inline int set_dictionary_source(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "set_dictionary_source", args_json);
}

inline int split_sentences(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "split_sentences", args_json);
}

inline int to_array(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "to_array", args_json);
}

inline int to_search_limit(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "to_search_limit", args_json);
}

inline int unique_strings(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "unique_strings", args_json);
}

inline int upsert_glossary(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "upsert_glossary", args_json);
}

inline int upsert_keyword(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "upsert_keyword", args_json);
}

inline int upsert_machine_descriptor(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "upsert_machine_descriptor", args_json);
}

inline int upsert_triad(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "upsert_triad", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
