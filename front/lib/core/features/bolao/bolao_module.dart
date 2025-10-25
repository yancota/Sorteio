import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/bolao/pages/bolao_page.dart';


class BolaoModule extends Module {
  @override
  void routes(RouteManager r) {
    r.child('/', child: (context) => const BolaoPage());
  }
}
