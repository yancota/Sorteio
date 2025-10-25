class ApiLogger {
  static bool enableLogs = true;  // Desabilite em produção

  static const String _reset = '\x1B[0m';
  static const String _red = '\x1B[31m';
  static const String _green = '\x1B[32m';
  static const String _yellow = '\x1B[33m';
  static const String _blue = '\x1B[34m';
  static const String _magenta = '\x1B[35m';
  static const String _cyan = '\x1B[36m';

  static void logRequest(String method, String url, Map<String, dynamic>? headers, dynamic body) {
    if (!enableLogs) return;
    print('\n🌐 REQUEST [$method] $url');
    if (headers != null) {
      print('Headers:');
      headers.forEach((key, value) => print('  $key: $value'));
    }
    if (body != null) {
      print('Body: $body');
    }
  }

  static void logResponse(int statusCode, String url, dynamic body) {
    if (!enableLogs) return;
    final emoji = statusCode >= 200 && statusCode < 300 ? '✅' : '❌';
    print('\n$emoji RESPONSE [$statusCode] $url');
    if (body != null) {
      print('Body: $body');
    }
  }

  static void logError(String message, dynamic error, StackTrace? stackTrace) {
    if (!enableLogs) return;
    print('\n❌ ERROR: $message');
    print('Error details: $error');
    if (stackTrace != null) {
      print('Stack trace:\n$stackTrace');
    }
  }
}