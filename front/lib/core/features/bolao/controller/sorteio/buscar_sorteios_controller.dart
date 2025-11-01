import 'package:flutter/foundation.dart';
import 'package:sorteio_front/core/features/bolao/services/bolao_service.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';
import 'package:sorteio_front/core/features/bolao/model/criar_sorteio_dto.dart';

class BuscarSorteiosController extends ChangeNotifier {
  final BolaoService _service = BolaoService();

  BolaoDto? bolao;
  bool isLoading = false;
  String? error;
  String query = '';
  final List<CriarSorteioDto> _all = [];
  List<CriarSorteioDto> filtered = [];

  List<CriarSorteioDto> get sorteios => List.unmodifiable(filtered);

  Future<void> init(BolaoDto? b) async {
    bolao = b;
    await loadSorteios();
  }

  Future<void> loadSorteios() async {
    if (bolao == null || bolao!.id == 0) return;
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final list = await _service.buscarSorteiosPorBolao(bolao!.id);
      _all.clear();
      for (final r in list) {
        if (r.data != null) _all.add(r.data!);
      }
      // inicializa filtered
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
    await loadSorteios();
  }
}
