import 'package:flutter/material.dart';
import 'package:sorteio_front/core/features/bolao/services/bolao_service.dart';

class CriarSorteioController extends ChangeNotifier {
  final BolaoService _service = BolaoService();

  int? bolaoId;
  List<String> valoresEscolhidos = [];
  String nome = '';
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

  Future<void> init(int? bolaoId) async {
    this.bolaoId = bolaoId;
  }

  Future<bool> criarSorteio() async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final response = await _service.criarSorteio(
        bolaoId!,
        nome,
        valoresEscolhidos,
      );

      if (response.success) {
        try {
          int sorteioId = response.data!.id;

          final sorteio = await _service.realizarSorteio(sorteioId);
          debugPrint('Sorteio realizado: ${sorteio.message}');
          return sorteio.success;
        } catch (e) {
          error = e.toString();
          return false;
        }
      }

      error = response.message ?? 'Falha ao criar sorteio';
      return false;
    } catch (e) {
      error = e.toString();
      notifyListeners();
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
