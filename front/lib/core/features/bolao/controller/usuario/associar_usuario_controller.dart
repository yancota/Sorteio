import 'package:flutter/foundation.dart';
import 'package:sorteio_front/core/features/usuario/service/usuario_service.dart';
import 'package:sorteio_front/core/features/usuario/model/usuario_dto.dart';
import 'package:sorteio_front/core/features/bolao/services/bolao_service.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';

class AssociarUsuarioController extends ChangeNotifier {
  final UsuarioService _usuarioService = UsuarioService();
  final BolaoService _bolaoService = BolaoService();

  BolaoDto? bolao;

  bool isLoading = false;
  String? error;

  final List<UsuarioDto> _all = [];
  List<UsuarioDto> filtered = [];
  UsuarioDto? selected;
  bool apto = true;

  // Inicializa e carrega dados
  Future<void> init(BolaoDto? b) async {
    bolao = b;
    await load();
  }

  Future<void> load() async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      // Carrega todos os usuários
      final users = await _usuarioService.buscarUsuarios();

      // Carrega participantes já associados (para filtrar)
      final associatedNames = <String>{};
      if (bolao != null && bolao!.id != 0) {
        final ranking = await _bolaoService.buscarRankingBolao(bolao!.id);
        for (final r in ranking) {
          if (r.data != null) {
            for (final p in r.data!.participantes) {
              associatedNames.add(p.nome.trim().toLowerCase());
            }
          }
        }
      }

      _all.clear();
      // Filtra usuários que já estão associados ao bolão (comparando nome)
      _all.addAll(
        users.where(
          (u) => !associatedNames.contains(u.nome.trim().toLowerCase()),
        ),
      );
      filtered = List.from(_all);
    } catch (e) {
      error = e.toString();
      filtered.clear();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void search(String q) {
    final query = q.trim().toLowerCase();
    if (query.isEmpty) {
      filtered = List.from(_all);
    } else {
      filtered = _all
          .where((u) => u.nome.toLowerCase().contains(query))
          .toList();
    }
    notifyListeners();
  }

  void select(UsuarioDto? u) {
    selected = u;
    notifyListeners();
  }

  void toggleApto(bool v) {
    apto = v;
    notifyListeners();
  }

  Future<bool> associate() async {
    if (selected == null || bolao == null) return false;
    isLoading = true;
    notifyListeners();
    try {
      final ok = await _bolaoService.associarUsuarioAoBolao(
        bolao!.id,
        selected!.id,
        apto,
      );
      return ok;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
