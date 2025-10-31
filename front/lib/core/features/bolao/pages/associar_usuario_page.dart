import 'package:flutter/material.dart';
import 'package:sorteio_front/core/features/usuario/service/usuario_service.dart';
import 'package:sorteio_front/core/features/usuario/model/usuario_dto.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';
import 'package:sorteio_front/core/features/bolao/services/bolao_service.dart';

class AssociarUsuarioPage extends StatefulWidget {
  final BolaoDto? bolao;

  const AssociarUsuarioPage({Key? key, this.bolao}) : super(key: key);

  @override
  State<AssociarUsuarioPage> createState() => _AssociarUsuarioPageState();
}

class _AssociarUsuarioPageState extends State<AssociarUsuarioPage> {
  final UsuarioService _usuarioService = UsuarioService();
  final BolaoService _bolaoService = BolaoService();
  final TextEditingController _searchController = TextEditingController();

  List<UsuarioDto> _all = [];
  List<UsuarioDto> _filtered = [];
  UsuarioDto? _selected;
  bool _apto = true;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadUsers();
    _searchController.addListener(_onSearch);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearch);
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch() {
    final q = _searchController.text.trim().toLowerCase();
    if (q.isEmpty) {
      setState(() => _filtered = List.from(_all));
      return;
    }
    setState(
      () => _filtered = _all
          .where((u) => u.nome.toLowerCase().contains(q))
          .toList(),
    );
  }

  Future<void> _loadUsers() async {
    setState(() => _isLoading = true);
    try {
      final users = await _usuarioService.buscarUsuarios();
      setState(() {
        _all = users;
        _filtered = List.from(_all);
      });
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Erro ao carregar usuários: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _save() async {
    if (_selected == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Selecione um usuário')));
      return;
    }
    if (widget.bolao == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Bolão inválido')));
      return;
    }

    setState(() => _isLoading = true);
    try {
      final success = await _bolaoService.associarUsuarioAoBolao(
        widget.bolao!.id,
        _selected!.id,
        _apto,
      );
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Usuário associado com sucesso')),
        );
        Navigator.of(context).pop(true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Falha ao associar usuário')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Erro: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.bolao?.nome ?? 'Associar usuário';
    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Container(
              height: 52,
              decoration: BoxDecoration(
                color: Colors.transparent,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Theme.of(context).dividerColor.withOpacity(0.3),
                ),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Row(
                children: [
                  const Icon(Icons.search, color: Colors.grey),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      decoration: const InputDecoration(
                        border: InputBorder.none,
                        hintText: 'Buscar usuário...',
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _filtered.isEmpty
                  ? Center(
                      child: Text(
                        'Nenhum usuário encontrado',
                        style: TextStyle(color: Colors.grey.shade600),
                      ),
                    )
                  : ListView.separated(
                      itemCount: _filtered.length,
                      separatorBuilder: (_, __) => const Divider(height: 1),
                      itemBuilder: (context, index) {
                        final u = _filtered[index];
                        final selected = _selected?.id == u.id;
                        return ListTile(
                          leading: CircleAvatar(
                            child: Text(
                              u.nome.isNotEmpty ? u.nome[0].toUpperCase() : '?',
                            ),
                          ),
                          title: Text(u.nome),
                          subtitle: u.telefone != null
                              ? Text(u.telefone!)
                              : null,
                          trailing: selected
                              ? const Icon(Icons.check, color: Colors.green)
                              : null,
                          onTap: () => setState(() => _selected = u),
                        );
                      },
                    ),
            ),
            const SizedBox(height: 8),
            SwitchListTile(
              title: const Text('Criar como apto'),
              value: _apto,
              onChanged: (v) => setState(() => _apto = v),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(false),
                    child: const Text('Cancelar'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _save,
                    child: _isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Text('Salvar'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
