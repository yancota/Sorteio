import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/usuario/controller/cadastro_usuario_controller.dart';
import 'package:sorteio_front/core/features/usuario/model/usuario_dto.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class BuscarUsuariosScreen extends StatefulWidget {
  const BuscarUsuariosScreen({Key? key}) : super(key: key);

  @override
  State<BuscarUsuariosScreen> createState() => _BuscarUsuariosScreenState();
}

class _BuscarUsuariosScreenState extends State<BuscarUsuariosScreen> {
  final CadastroUsuarioController _controller = CadastroUsuarioController();
  final TextEditingController _searchController = TextEditingController();

  List<UsuarioDto> _allUsers = [];
  List<UsuarioDto> _filtered = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetch();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    final q = _searchController.text.toLowerCase().trim();
    setState(() {
      if (q.isEmpty) {
        _filtered = List.from(_allUsers);
      } else {
        _filtered = _allUsers
            .where(
              (u) =>
                  u.nome.toLowerCase().contains(q) ||
                  (u.telefone ?? '').contains(q),
            )
            .toList();
      }
    });
  }

  Future<void> _fetch() async {
    setState(() => _isLoading = true);
    try {
      final users = await _controller.buscarUsuarios();
      setState(() {
        _allUsers = users;
        _filtered = List.from(_allUsers);
      });
    } catch (e) {
      // show simple error
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao buscar usuários: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lista de Usuários'),
        backgroundColor: Constants.backgroundLight,
        elevation: 0,
        iconTheme: IconThemeData(color: Constants.primary),
        titleTextStyle: TextStyle(
          color: Colors.black87,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final result = await Modular.to.pushNamed('/usuario/cadastro');
          if (result != null && result is UsuarioDto) {
            _fetch();
          }
        },
        backgroundColor: Constants.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.person_add),
        label: const Text('Cadastrar Usuário'),
      ),
      body: RefreshIndicator(
        onRefresh: _fetch,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.search),
                  hintText: 'Pesquisar por nome ou telefone',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  isDense: true,
                ),
              ),
            ),

            if (_isLoading)
              const Expanded(child: Center(child: CircularProgressIndicator()))
            else if (_filtered.isEmpty)
              Expanded(
                child: Center(
                  child: Text(
                    'Nenhum usuário encontrado',
                    style: TextStyle(color: Colors.grey[700]),
                  ),
                ),
              )
            else
              Expanded(
                child: ListView.separated(
                  physics: const AlwaysScrollableScrollPhysics(),
                  itemCount: _filtered.length,
                  separatorBuilder: (context, index) =>
                      const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final u = _filtered[index];
                    return ListTile(
                      leading: CircleAvatar(
                        backgroundColor: Constants.primary.withOpacity(0.15),
                        child: Text(
                          _initials(u.nome),
                          style: TextStyle(
                            color: Constants.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      title: Text(u.nome),
                      subtitle: u.telefone != null
                          ? Text(_formatPhone(u.telefone!))
                          : null,
                      onTap: () {
                        // retorna usuário selecionado
                        Modular.to.pop(u);
                      },
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }

  String _initials(String nome) {
    final parts = nome
        .trim()
        .split(RegExp(r'\s+'))
        .where((s) => s.isNotEmpty)
        .toList();
    if (parts.isEmpty) return '';
    if (parts.length == 1) return parts.first.substring(0, 1).toUpperCase();
    return (parts.first.substring(0, 1) + parts.last.substring(0, 1))
        .toUpperCase();
  }

  String _formatPhone(String raw) {
    final digits = raw.replaceAll(RegExp(r'\D'), '');
    if (digits.isEmpty) return raw;
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) {
      return '(${digits.substring(0, 2)}) ${digits.substring(2)}';
    }
    if (digits.length <= 10) {
      return '(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}';
    }
    // 11+ digits (most common: 11 digits)
    final end = digits.length < 11 ? digits.length : 11;
    return '(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, end)}';
  }
}
