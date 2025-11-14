import 'package:intl/intl.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';
import 'package:sorteio_front/core/features/bolao/services/bolao_service.dart';

class BolaoController {
  final BolaoService _service = BolaoService();

  Future<List<BolaoDto>> buscarBoloes() async {
    try {
      final response = await _service.buscarBoloes();
      return response;
    } catch (e) {
      rethrow;
    }
  }

  Future<BolaoDto> criarBolao(
    String nome,
    int quantidadeCampeao,
    bool reiniciarBolao,
    double valor,
  ) async {
    try {
      final response = await _service.criarBolao(
        nome,
        quantidadeCampeao,
        reiniciarBolao,
        valor,
      );
      return response;
    } catch (e) {
      rethrow;
    }
  }

  String formatDate(DateTime date) {
    return DateFormat('dd/MM/yyyy HH:mm').format(date.toLocal());
  }

  String formatCurrency(String value) {
    final v = double.tryParse(value) ?? 0.0;
    final fmt = NumberFormat.currency(locale: 'pt_BR', symbol: 'R\$');
    return fmt.format(v);
  }

  String formatBoolean(bool value) {
    return value ? 'Sim' : 'Não';
  }
}
