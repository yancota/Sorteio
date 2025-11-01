import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/bolao/pages/bolao_detail_page.dart';
import 'package:sorteio_front/core/features/bolao/pages/bolao_page.dart';
import 'package:sorteio_front/core/features/bolao/pages/sorteio/bolao_sorteios_page.dart';
import 'package:sorteio_front/core/features/bolao/pages/usuario/bolao_participants_page.dart';
import 'package:sorteio_front/core/features/bolao/pages/usuario/fazer_aposta_page.dart';


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

    r.child('/sorteios', child: (context) {
      final bolao = Modular.args.data;
      return BolaoSorteiosPage(bolao: bolao);
    });

    r.child('/fazer_aposta', child: (context) {
      final raw = Modular.args.data;
      int? inscricaoId;
      List<String>? valores;
      if (raw is Map) {
        inscricaoId = raw['inscricaoId'] is int
            ? raw['inscricaoId'] as int
            : (raw['inscricaoId'] is String ? int.tryParse(raw['inscricaoId']) : null);
        final v = raw['valoresEscolhidos'];
        if (v is List) valores = v.map((e) => e.toString()).toList();
      }
      return FazerApostaPage(inscricaoId: inscricaoId, valoresEscolhidos: valores);
    });
  }
}
