import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/usuario/page/buscar_usuarios_screen.dart';
import 'package:sorteio_front/core/features/usuario/page/cadastro_usuario_screen.dart';


class UsuarioModule extends Module {
  @override
  void routes(RouteManager r) {
    r.child('/', child: (context) => const BuscarUsuariosScreen());
    r.child('/cadastro', child:(context) => const CadastroUsuarioScreen());
  }
}
