import 'package:intl/intl.dart';
import 'package:sorteio_front/core/features/usuario/model/usuario_dto.dart';
import 'package:sorteio_front/core/features/usuario/service/usuario_service.dart';

class CadastroUsuarioController {
  final UsuarioService _service = UsuarioService();

  Future<List<UsuarioDto>> buscarUsuarios() async {
    try {
      final response = await _service.buscarUsuarios();
      return response;
    } catch (e) {
      rethrow;
    }
  }

  Future<UsuarioDto> cadastrarUsuario(String nome, String telefone) async {
    try {
      final response = await _service.cadastrarUsuario(nome, telefone);
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
