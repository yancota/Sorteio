import 'package:flutter/foundation.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';
import 'package:sorteio_front/core/features/bolao/model/criar_aposta_dto.dart';
import 'package:sorteio_front/core/features/bolao/model/criar_sorteio_dto.dart';
import 'package:sorteio_front/core/features/bolao/model/ranking_bolao_dto.dart';
import 'package:sorteio_front/core/services/api_service.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class BolaoService {
  //String get basicAuth => Constants.tokenKey;
  String get urlBase => Constants().baseUrl;

  Future<List<BolaoDto>> buscarBoloes() async {
    String endpoint = '/boloes';

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.get(endpoint);

      final data = response['data'] as List<dynamic>? ?? [];
      return data
          .map((json) => BolaoDto.fromJson(json as Map<String, dynamic>))
          .toList();
    } catch (e) {
      rethrow;
    }
  }


  Future<BolaoDto> criarBolao(String nome, int quantidadeCampeao, bool reiniciarBolao, double valor) async {
    String endpoint = '/boloes';

    final body = {
      'nome': nome,
      'quantidadeCampeao': quantidadeCampeao,
      'reiniciarBolao': reiniciarBolao,
      'valor': valor
    };

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.post(endpoint, body: body);
      return BolaoDto.fromJson(response['data'] as Map<String, dynamic>);
    } catch (e) {
      rethrow;
    }
  }

  Future<List<RankingBolaoDto>> buscarRankingBolao(int? id) async {
    String endpoint = '/inscricoes/bolao/$id/ranking';

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.get(endpoint);

      final raw = response['data'];
      if (raw == null) return [];

      if (raw is Map<String, dynamic>) {
        final dataMap = Map<String, dynamic>.from(raw);
        final dto = RankingBolaoDto(
          success: response['success'] as bool? ?? false,
          data: RankingDataDto.fromJson(dataMap),
        );
        return [dto];
      }

      if (raw is List<dynamic>) {
        return raw.map((e) {
          if (e is Map<String, dynamic>) {
            return RankingBolaoDto(
              success: response['success'] as bool? ?? false,
              data: RankingDataDto.fromJson(Map<String, dynamic>.from(e)),
            );
          }
          return RankingBolaoDto.fromJson(e as Map<String, dynamic>);
        }).toList();
      }

      return [];
    } catch (e) {
      rethrow;
    }
  }

  Future<CriarApostaResponseDto> fazerAposta(
    int inscricaoId,
    List<String> valoresEscolhidos,
  ) async {
    String endpoint = '/apostas';

    final body = {
      'inscricaoBolao': {'id': inscricaoId},
      'valores_escolhidos': valoresEscolhidos,
    };

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.post(endpoint, body: body);

      return CriarApostaResponseDto.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  Future<bool> associarUsuarioAoBolao(
    int bolaoId,
    int usuarioId,
    bool apto,
  ) async {
    String endpoint = '/inscricoes';

    final body = {
      'bolao': {'id': bolaoId},
      'usuario': {'id': usuarioId},
      'apto': apto,
    };

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.post(endpoint, body: body);
      return response['success'] as bool? ?? false;
    } catch (e) {
      rethrow;
    }
  }

  Future<CriarSorteioResponseDto> criarSorteio(
    int bolaoId,
    String nome,
    List<String> valoresSorteados,
  ) async {
    String endpoint = '/sorteios';

    final body = {
      'nome': nome,
      'bolao': {'id': bolaoId},
      'valores_sorteados': valoresSorteados,
    };

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.post(endpoint, body: body);

      return CriarSorteioResponseDto.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }

  Future<List<CriarSorteioResponseDto>> buscarSorteiosPorBolao(
    int bolaoId,
  ) async {
    String endpoint = '/sorteios/bolao/$bolaoId';

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.get(endpoint);

      final rawList = response['data'] as List<dynamic>? ?? [];
      final List<CriarSorteioResponseDto> result = [];
      for (final item in rawList) {
        if (item is Map<String, dynamic>) {
          // caso item seja diretamente o objeto do sorteio (id, nome, valores_sorteados...)
          if (item.containsKey('id') && item.containsKey('nome')) {
            result.add(
              CriarSorteioResponseDto(
                success: response['success'] as bool? ?? false,
                message: response['message'] as String?,
                data: CriarSorteioDto.fromJson(Map<String, dynamic>.from(item)),
              ),
            );
            continue;
          }
          // caso item seja uma resposta envelopada
          result.add(
            CriarSorteioResponseDto.fromJson(Map<String, dynamic>.from(item)),
          );
        }
      }
      return result;
    } catch (e) {
      rethrow;
    }
  }

  Future<CriarSorteioResponseDto> realizarSorteio(int sorteioId) async {
    String endpoint = '/sorteios/$sorteioId/realizar';
    final body = {};

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final raw = await apiService.post(endpoint, body: body);

      return CriarSorteioResponseDto.fromJson(raw);

    } catch (e) {
      rethrow;
    }
  }

    Future<bool> tornarApto(int inscricaoId) async {
    String endpoint = '/inscricoes/$inscricaoId/tornar-apto';
    final body = {};

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.put(endpoint, body: body);

      return response['success'] as bool? ?? false;

    } catch (e) {
      rethrow;
    }
  }


}
