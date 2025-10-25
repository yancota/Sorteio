import 'package:flutter_modular/flutter_modular.dart';


class BolaoModule extends Module {
  @override
  void routes(RouteManager r) {
    r.child('/', child: (context) => const BolaoPage());
  }
}
