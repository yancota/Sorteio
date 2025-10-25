import 'package:intl/intl.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';
import 'package:sorteio_front/core/features/bolao/services/bolao_service.dart';

class BolaoController {
  final VerificarValorServicoUtilsRepository _service =
      VerificarValorServicoUtilsRepository();

  Future<List<BolaoDto>> buscarBoloes() async {
    try {
      final response = await _service.buscarBoloes();
      return response;
    } catch (e) {
      rethrow;
    }
  }

  String formatDate(DateTime date) {
    return DateFormat('dd/MM/yyyy HH:mm').format(date.toLocal());
  }

  String formatCurrency(String value) {
    // Assumindo que value é uma string numérica
    final num = double.tryParse(value) ?? 0.0;
    return 'R\$ ${num.toStringAsFixed(2).replaceAll('.', ',')}';
  }

  String formatBoolean(bool value) {
    return value ? 'Sim' : 'Não';
  }
}
