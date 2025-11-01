import 'package:flutter/material.dart';
import 'package:sorteio_front/core/features/bolao/services/bolao_service.dart';

class PalpiteBolaoController extends ChangeNotifier {
  final BolaoService _service = BolaoService();

  int? inscricaoId;
  List<String> valoresEscolhidos = [];
  bool isLoading = false;
  String? error;

  String query = '';

  // Adiciona um valor único (se ainda não existir) e notifica a UI
  void addValor(String v) {
    final s = v.trim();
    if (s.isEmpty) return;
    if (!valoresEscolhidos.contains(s)) {
      valoresEscolhidos.add(s);
      notifyListeners();
    }
  }

  // Remove um valor se existir
  void removeValor(String v) {
    valoresEscolhidos.remove(v);
    notifyListeners();
  }

  // Adiciona múltiplos valores a partir de um texto separado por vírgula/spaces
  void addValoresFromText(String text) {
    final parts = text
        .split(RegExp(r'[ ,;]+'))
        .map((e) => e.trim())
        .where((e) => e.isNotEmpty)
        .toList();
    var changed = false;
    for (final p in parts) {
      if (!valoresEscolhidos.contains(p)) {
        valoresEscolhidos.add(p);
        changed = true;
      }
    }
    if (changed) notifyListeners();
  }

  // Substitui a lista inteira de valores
  void setValoresEscolhidos(List<String> vals) {
    valoresEscolhidos = List.from(vals);
    notifyListeners();
  }

  Future<void> init(int? inscricaoId) async {
    this.inscricaoId = inscricaoId;
  }

  Future<bool> fazerAposta() async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final response = await _service.fazerAposta(
        inscricaoId!,
        valoresEscolhidos,
      );

      return response.success;
    } catch (e) {
      error = e.toString();
      notifyListeners();
      rethrow;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
