import 'package:flutter/material.dart';
import 'package:sorteio_front/core/features/bolao/services/bolao_service.dart';

class RankingBolaoController extends ChangeNotifier {
  final BolaoService _service = BolaoService();

  int? inscricaoId;
  List<String> valoresEscolhidos = [];
  bool isLoading = false;
  String? error;

  String query = '';

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
