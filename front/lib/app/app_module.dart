import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/bolao/bolao_module.dart';
import 'package:sorteio_front/core/features/usuario/usuario_module.dart';
import 'package:sorteio_front/core/pages/splash.dart';

class AppModule extends Module {
  @override
  void binds(i) {
    // Adicione seus binds aqui, se necessário
  }

  @override
  void routes(r) {
    r.child('/', child: (context) => const SplashPage());
    r.module('/bolao', module: BolaoModule());
    r.module('/usuario', module: UsuarioModule());
  }
}
