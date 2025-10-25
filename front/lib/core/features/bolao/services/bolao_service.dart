import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';
import 'package:sorteio_front/core/services/api_service.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class VerificarValorServicoUtilsRepository {
  //String get basicAuth => Constants.tokenKey;
  String get urlBase => Constants.baseUrl;

  Future<List<BolaoDto>> buscarBoloes() async {
    String endpoint = '/boloes';

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.get(endpoint);

      // A resposta é {success: true, data: [...]}, então extraímos data
      final data = response['data'] as List<dynamic>? ?? [];
      return data
          .map((json) => BolaoDto.fromJson(json as Map<String, dynamic>))
          .toList();
    } catch (e) {
      rethrow;
    }
  }
}
