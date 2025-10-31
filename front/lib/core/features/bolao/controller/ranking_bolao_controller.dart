import 'package:flutter/foundation.dart';
import 'package:sorteio_front/core/features/bolao/model/ranking_bolao_dto.dart';
import 'package:sorteio_front/core/features/bolao/services/bolao_service.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';

// View model for the UI
class Participant {
  final String nome;
  final int score;
  final bool apto;

  final List<String> valoresEscolhidos;
  final List<String> valoresAcertados;
  final int posicao;

  Participant({
    required this.nome,
    required this.score,
    required this.apto,
    required this.valoresEscolhidos,
    required this.valoresAcertados,
    required this.posicao,
  });

  factory Participant.fromDto(ParticipanteDto dto) {
    return Participant(
      nome: dto.nome,
      score: dto.pontuacaoTotal,
      apto: dto.valoresAcertados.isNotEmpty,
      valoresEscolhidos: dto.valoresEscolhidos,
      valoresAcertados: dto.valoresAcertados,
      posicao: dto.posicao,
    );
  }
}

class RankingBolaoController extends ChangeNotifier {
  final BolaoService _service = BolaoService();

  BolaoDto? bolao;
  bool isLoading = false;
  String? error;

  final List<Participant> _all = [];
  List<Participant> filtered = [];
  String query = '';

  // Inicializa o controller com um bolão opcional
  Future<void> init(BolaoDto? b) async {
    bolao = b;
    await loadParticipants();
  }

  List<Participant> get participants => List.unmodifiable(filtered);

  Future<void> loadParticipants() async {
    if (bolao == null || bolao!.id == 0) return;
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      debugPrint(
        'RankingBolaoController: carregando participantes para bolao id=${bolao!.id}',
      );
      final list = await _service.buscarRankingBolao(bolao!.id);
      debugPrint(
        'RankingBolaoController: resposta do service lista length=${list.length}',
      );
      final participantsDto = <ParticipanteDto>[];
      for (final r in list) {
        debugPrint(
          '  item: hasData=${r.data != null} participantes=${r.data?.participantes.length ?? 0}',
        );
        if (r.data != null) participantsDto.addAll(r.data!.participantes);
      }

      debugPrint(
        'RankingBolaoController: total participantes extraidos=${participantsDto.length}',
      );

      _all.clear();
      _all.addAll(participantsDto.map((e) => Participant.fromDto(e)));
      _applyFilter();
    } catch (e) {
      error = e.toString();
      filtered.clear();
      notifyListeners();
      rethrow;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void _applyFilter() {
    if (query.trim().isEmpty) {
      filtered = List.from(_all);
    } else {
      final q = query.trim().toLowerCase();
      filtered = _all.where((p) => p.nome.toLowerCase().contains(q)).toList();
    }
    notifyListeners();
  }

  void search(String q) {
    query = q;
    _applyFilter();
  }

  Future<void> refresh() async {
    await loadParticipants();
  }
}
