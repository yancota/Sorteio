import 'package:sorteio_front/core/features/login/model/token_dto.dart';
import 'package:sorteio_front/core/features/usuario/model/usuario_dto.dart';
import 'package:sorteio_front/core/services/api_service.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class LoginService {
  String get urlBase => Constants().baseUrl;

  Future<TokenDTO> login(String nome, String telefone) async {
    String endpoint = '/auth/login';

    try {
      final apiService = ApiService(baseUrl: urlBase);
      final response = await apiService.post(
        endpoint,
        body: {'username': nome, 'password': telefone},
      );

      return TokenDTO.fromJson(response);
    } catch (e) {
      rethrow;
    }
  }
}
