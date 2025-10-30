import 'package:sorteio_front/core/features/usuario/model/usuario_dto.dart';
import 'package:sorteio_front/core/services/api_service.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class UsuarioService {
  String get urlBase => Constants.baseUrl;

  Future<List<UsuarioDto>> buscarUsuarios() async {
    String endpoint = '/usuarios';

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.get(endpoint);

      final data = response['data'] as List<dynamic>? ?? [];
      return data
          .map((json) => UsuarioDto.fromJson(json as Map<String, dynamic>))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<UsuarioDto> cadastrarUsuario(String nome, String telefone) async {
    String endpoint = '/usuarios';

    try {
      final apiService = ApiService(baseUrl: urlBase);
      // Envia os dados via POST
      final response = await apiService.post(
        endpoint,
        body: {'nome': nome, 'telefone': telefone},
      );

      final data = response['data'];

      if (data is Map<String, dynamic>) {
        return UsuarioDto.fromJson(data);
      }

      if (data is List &&
          data.isNotEmpty &&
          data.first is Map<String, dynamic>) {
        return UsuarioDto.fromJson(data.first as Map<String, dynamic>);
      }

      throw Exception(
        'Resposta da API em formato inesperado ao cadastrar usuário',
      );
    } catch (e) {
      rethrow;
    }
  }
}
