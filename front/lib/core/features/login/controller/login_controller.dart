import 'package:flutter/foundation.dart';
import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/login/model/token_dto.dart';
import 'package:sorteio_front/core/features/login/service/login_service.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class LoginController extends ChangeNotifier {
  final LoginService _service = Modular.get<LoginService>();

  bool isLoading = false;

  Future<TokenDTO> login(String username, String password) async {
    isLoading = true;
    notifyListeners();
    try {
      final token = await _service.login(username, password);

      if (token.token != null) {
        Constants.token = token.token!;
      }

      return token;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
