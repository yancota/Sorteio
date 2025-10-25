import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:sorteio_front/core/exceptions/api_exceptions.dart';
import 'api_logger.dart';

class ApiService {
  final String baseUrl;
  final Map<String, String> defaultHeaders;

  ApiService({
    required this.baseUrl,
    this.defaultHeaders = const {},
  });

  Future<T> get<T>(
    String endpoint, {
    Map<String, String>? headers,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final url = '$baseUrl$endpoint';
      final finalHeaders = {...defaultHeaders, ...?headers};

      ApiLogger.logRequest('GET', url, finalHeaders, null);
      final stopwatch = Stopwatch()..start();

      final response = await http.get(
        Uri.parse(url),
        headers: finalHeaders,
      );

      stopwatch.stop();
      ApiLogger.logResponse(
        response.statusCode,
        url,
        _tryDecodeResponse(
          utf8.decode(response.bodyBytes),
          response.bodyBytes,
        ),
      );

      return _handleResponse(response, fromJson);
    } catch (e, stackTrace) {
      ApiLogger.logError('$baseUrl$endpoint', e, stackTrace);
      throw ApiException(message: 'Erro na requisição: ${e.toString()}');
    }
  }

  Future<T> post<T>(
    String endpoint, {
    Map<String, String>? headers,
    dynamic body,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final url = '$baseUrl$endpoint';
      final finalHeaders = {
        'Content-Type': 'application/json',
        ...defaultHeaders,
        ...?headers,
      };

      ApiLogger.logRequest('POST', url, finalHeaders, body);
      final stopwatch = Stopwatch()..start();
      var dadosFinal = jsonEncode(body);
      final response = await http.post(
        Uri.parse(url),
        headers: finalHeaders,
        body: dadosFinal,
      );

      stopwatch.stop();
      ApiLogger.logResponse(
        response.statusCode,
        url,
        _tryDecodeResponse(
          utf8.decode(response.bodyBytes),
          response.bodyBytes,
        ),
      );

      return _handleResponse(response, fromJson);
    } catch (e, stackTrace) {
      ApiLogger.logError('$baseUrl$endpoint', e, stackTrace);
      throw ApiException(message: 'Erro na requisição: ${e.toString()}');
    }
  }

  Future<Map<String, dynamic>> postRaw(
    String endpoint, {
    Map<String, String>? headers,
    dynamic body,
  }) async {
    try {
      final url = '$baseUrl$endpoint';
      final finalHeaders = {
        'Content-Type': 'application/json',
        ...defaultHeaders,
        ...?headers,
      };
      var bodyEncode = jsonEncode(body);
      ApiLogger.logRequest('POST', url, finalHeaders, body);
      final stopwatch = Stopwatch()..start();

      final response = await http.post(
        Uri.parse(url),
        headers: finalHeaders,
        body: bodyEncode,
      );

      stopwatch.stop();
      ApiLogger.logResponse(
        response.statusCode,
        url,
        _tryDecodeResponse(
          utf8.decode(response.bodyBytes),
          response.bodyBytes,
        ),
      );

      final decodedBody = utf8.decode(response.bodyBytes);

      dynamic jsonData;
      if (decodedBody.trim().isNotEmpty) {
        try {
          final sanitizedBody = _protectBigInts(decodedBody);
          jsonData = jsonDecode(sanitizedBody);
        } catch (e) {
          print('⚠ Erro ao fazer decode do JSON: $e');
          print('⚠ Body recebido: "$decodedBody"');
          jsonData = {'error': 'Invalid JSON', 'rawBody': decodedBody};
        }
      } else {
        print('⚠ Body vazio recebido para status ${response.statusCode}');
        jsonData = {
          'error': 'Empty response body',
          'statusCode': response.statusCode
        };
      }

      return {
        'statusCode': response.statusCode,
        'data': jsonData,
        'success': response.statusCode >= 200 && response.statusCode < 300,
        'isEmpty': decodedBody.trim().isEmpty,
      };
    } catch (e, stackTrace) {
      ApiLogger.logError('$baseUrl$endpoint', e, stackTrace);
      throw ApiException(message: 'Erro na requisição: ${e.toString()}');
    }
  }

  Future<T> put<T>(
    String endpoint, {
    Map<String, String>? headers,
    dynamic body,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final url = '$baseUrl$endpoint';
      final finalHeaders = {
        'Content-Type': 'application/json',
        ...defaultHeaders,
        ...?headers,
      };

      ApiLogger.logRequest('PUT', url, finalHeaders, body);
      final stopwatch = Stopwatch()..start();
      final dados = jsonEncode(body);
      final response = await http.put(
        Uri.parse(url),
        headers: finalHeaders,
        body: dados,
      );

      stopwatch.stop();
      ApiLogger.logResponse(
        response.statusCode,
        url,
        _tryDecodeResponse(
          utf8.decode(response.bodyBytes),
          response.bodyBytes,
        ),
      );

      return _handleResponse(response, fromJson);
    } catch (e, stackTrace) {
      ApiLogger.logError('$baseUrl$endpoint', e, stackTrace);
      throw ApiException(message: 'Erro na requisição: ${e.toString()}');
    }
  }

  Future<T> delete<T>(
    String endpoint, {
    Map<String, String>? headers,
    dynamic body,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final url = '$baseUrl$endpoint';
      final finalHeaders = {
        'Content-Type': 'application/json',
        ...defaultHeaders,
        ...?headers,
      };

      ApiLogger.logRequest('DELETE', url, finalHeaders, body);
      final stopwatch = Stopwatch()..start();

      var bodyEncoded = jsonEncode(body);
      final response = await http.delete(
        Uri.parse(url),
        headers: finalHeaders,
        body: bodyEncoded,
      );

      stopwatch.stop();
      ApiLogger.logResponse(
        response.statusCode,
        url,
        _tryDecodeResponse(
          utf8.decode(response.bodyBytes),
          response.bodyBytes,
        ),
      );

      return _handleResponse(response, fromJson);
    } catch (e, stackTrace) {
      ApiLogger.logError('$baseUrl$endpoint', e, stackTrace);
      throw ApiException(message: 'Erro na requisição: ${e.toString()}');
    }
  }

  T _handleResponse<T>(
    http.Response response,
    T Function(Map<String, dynamic>)? fromJson,
  ) {
    final decodedBody = utf8.decode(response.bodyBytes);

    final sanitizedBody = _protectBigInts(decodedBody);
    final jsonData = jsonDecode(sanitizedBody);

    if ((response.statusCode >= 200 && response.statusCode < 300) ||
        response.statusCode == 1) {
      if (jsonData is Map &&
          jsonData.containsKey('codigo') &&
          jsonData['codigo'] != null &&
          jsonData['codigo'] != 1 &&
          jsonData['codigo'] != 200 &&
          jsonData['codigo'] != 201 &&
          jsonData['codigo'] != 202 &&
          jsonData['codigo'] != 210 &&
          jsonData['codigo'] != 211 &&
          jsonData['codigo'] != 212) {
        String? errorMsg = jsonData['mensagem'] ??
            jsonData['message'] ??
            jsonData['error'] ??
            decodedBody ??
            'Erro na requisição';
        throw ApiException(
          message: errorMsg ?? '',
          statusCode: response.statusCode,
        );
      }

      if (jsonData is Map &&
          jsonData.containsKey('_success') &&
          jsonData['_success'] == false) {
        String? errorMsg = jsonData['mensagem'] ??
            jsonData['message'] ??
            jsonData['error'] ??
            'Erro na requisição';
        throw ApiException(
          message: errorMsg ?? 'Erro desconhecido',
          statusCode: response.statusCode,
        );
      }

      if (fromJson != null) {
        return fromJson(jsonData);
      }
      return jsonData as T;
    }

    String? errorMsg = jsonData['mensagem'] ??
        jsonData['errors']?[0]?['sourceKey'] ??
        jsonData['errors']?[0]?['description'] ??
        jsonData['message'] ??
        jsonData['error'] ??
        decodedBody ??
        'Erro na requisição';

    throw ApiException(
      message: errorMsg ?? 'Erro desconhecido',
      statusCode: response.statusCode,
    );
  }

  String _protectBigInts(String body) {
    final reg = RegExp(r'("ticketId"\s*:\s*)(\d{16,})(?!")');
    return body.replaceAllMapped(reg, (m) => '${m.group(1)}"${m.group(2)}"');
  }

  dynamic _tryDecodeResponse(String body, [List<int>? bodyBytes]) {
    try {
      if (bodyBytes != null && bodyBytes.isNotEmpty) {
        final decoded = utf8.decode(bodyBytes);
        if (decoded.trim().isEmpty) return null; // corpo vazio
        return json.decode(decoded);
      }

      if (body.trim().isEmpty) return null; // corpo vazio
      return json.decode(body);
    } catch (e) {
      // fallback: retorna texto cru em vez de quebrar
      return body;
    }
  }
}
