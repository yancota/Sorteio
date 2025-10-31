import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/bolao/pages/bolao_detail_page.dart';
import 'package:sorteio_front/core/features/bolao/pages/bolao_page.dart';
import 'package:sorteio_front/core/features/bolao/pages/bolao_participants_page.dart';


class BolaoModule extends Module {
  @override
  void routes(RouteManager r) {
    r.child('/', child: (context) => const BolaoPage());
    r.child('/detail', child: (context) {
      final bolao = Modular.args.data;
      return BolaoDetailPage(bolao: bolao);
    });
    r.child('/participantes', child: (context) {
      final bolao = Modular.args.data;
      return BolaoParticipantsPage(bolao: bolao);
    });
  }
}
