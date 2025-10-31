import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';
import 'package:sorteio_front/core/features/bolao/model/criar_aposta_dto.dart';
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

  Future<List<RankingBolaoDto>> buscarRankingBolao(int? id) async {
    String endpoint = '/inscricoes/bolao/$id/ranking';

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.get(endpoint);

      final raw = response['data'];
      if (raw == null) return [];

      // Caso comum: backend retorna { success: true, data: { bolao: ..., participantes: [...] } }
      // Aqui `raw` é o objeto `data`. Precisamos construir um RankingBolaoDto com esse objeto
      if (raw is Map<String, dynamic>) {
        final dataMap = Map<String, dynamic>.from(raw);
        final dto = RankingBolaoDto(
          success: response['success'] as bool? ?? false,
          data: RankingDataDto.fromJson(dataMap),
        );
        return [dto];
      }

      // Se por algum motivo o backend retornar uma lista de objetos `data`
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

  /// Associa um usuário a um bolão (inscrição).
  /// Retorna true se a operação tiver sucesso (campo `success` da API).
  Future<bool> associarUsuarioAoBolao(
    int bolaoId,
    int usuarioId,
    bool apto,
  ) async {
    String endpoint = '/inscricoes';

    final body = {'bolao_id': bolaoId, 'usuario_id': usuarioId, 'apto': apto};

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.post(endpoint, body: body);
      return response['success'] as bool? ?? false;
    } catch (e) {
      rethrow;
    }
  }
}
