import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/login/controller/login_controller.dart';
import 'package:sorteio_front/core/features/login/screen/home_screen.dart';
import 'package:sorteio_front/core/features/login/screen/login_screen.dart';
import 'package:sorteio_front/core/features/login/service/login_service.dart';


class LoginModule extends Module {

  @override
  void binds(Injector i) {

    i.addLazySingleton(LoginController.new);
    i.addLazySingleton(LoginService.new);

  }
  @override
  void routes(RouteManager r) {
    r.child('/', child: (context) => const LoginScreen());
    r.child('/home', child: (context) => const HomeScreen());
  }
}
